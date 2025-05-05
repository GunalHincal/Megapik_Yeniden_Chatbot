# Chatbot arayüzünü çalıştıracak olan ana dosya  

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, Response
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
import os
os.environ["HF_HOME"] = "/tmp/hf_home"

# Eğer ChromaDB veritabanı yoksa, yeniden oluştur
if not os.path.exists("chroma_db"):
    print("📌 ChromaDB oluşturuluyor...")
    os.system("python vector_store_api.py")

# ✅ Ortam değişkenlerini yükle
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("⚠️ GEMINI_API_KEY bulunamadı! Lütfen .env dosyanı kontrol et.")

# ✅ Gemini API'yi başlat
genai.configure(api_key=GEMINI_API_KEY)

# 📌 FastAPI başlat
app = FastAPI()

# 📌 HTML Şablonlar ve Statik Dosyalar
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/backgrounds", StaticFiles(directory="static/backgrounds"), name="backgrounds")
templates = Jinja2Templates(directory="templates")

# 📌 ChromaDB Yolu
CHROMA_DB_PATH = "./chroma_db"

# 📌 ChromaDB Yükleme
def load_vector_store():
    """ChromaDB vektör deposunu yükler."""
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    vector_store = Chroma(
        persist_directory=CHROMA_DB_PATH,
        embedding_function=embeddings
    )

    retriever = vector_store.as_retriever(search_type="mmr", search_kwargs={"k": 35})

    return vector_store, retriever

vector_store, retriever = load_vector_store()  

@app.get("/health")
async def read_health():
    return {"status": "ok"}

# 📌 UptimeRobot'un yaptığı HEAD isteğine 200 OK döndürmek için boş endpoint
@app.head("/")
def head_root():
    return Response(headers={"X-App-Status": "Megapik Chatbot Active"})

# 📌 1️⃣ ChromaDB içinde kaç doküman olduğunu kontrol et
@app.get("/vector_store_info")
def vector_store_info():
    """ChromaDB'deki doküman sayısını döndürür."""
    try:
        doc_count = vector_store._collection.count()
        return {"message": f"📊 ChromaDB içindeki doküman sayısı: {doc_count}"}
    except Exception as e:
        return {"error": f"⚠️ ChromaDB içeriği okunamadı: {str(e)}"}

# 📌 2️⃣ Kullanıcı Sorusuna En İlgili Chunk'ları Getir
def find_relevant_text(question: str, num_chunks: int = 30):
    """Kullanıcının sorusuna en alakalı chunk'ları getirir."""
    docs = retriever.invoke(question)

    if not docs:
        return None  # Chunk bulunamazsa None dön

    relevant_chunks = sorted(docs[:num_chunks], key=lambda x: x.metadata.get("page", 0) or 0)
    return " ".join([doc.page_content for doc in relevant_chunks])

# 📌 3️⃣ Gemini API ile Yanıt Üret
class ChatRequest(BaseModel):
    message: str
    num_chunks: int = 30  # Varsayılan olarak 30 chunk getirilecek
    history: list = []  # Bu satırı ekle

@app.post("/chat")
def chat(request: ChatRequest):
    user_question = request.message
    num_chunks = request.num_chunks  

    # 📌 Chunk'ları getir
    relevant_text = find_relevant_text(user_question, num_chunks)

    # 📌 Eğer kitapla ilgili bilgi yoksa cevap verme
    if relevant_text is None:
        return {"response": "Bu bilgi kitapta yer almıyor."}

    # 📌 Gelişmiş Prompt Kullanımı
    prompt = f"""
    Sen, 'Megapik-Yeniden' kitabına tamamen hakim, bilgili ve sohbet edebilme yeteneği gelişmiş bir yapay zeka chatbotusun. 
    Görevin, kullanıcılara kitabın içeriğine dayalı, ayrıntılı, doğal ve insan gibi akıcı yanıtlar vermektir. 
    Kitaptaki olayları ve karakterleri kendi kelimelerinle ama özgün ve detaylı şekilde anlatabilirsin.
    Cevaplarını yalnızca bu içeriğe dayanarak oluştur ve kitapta yer almayan bilgileri üretme yanlış çıkarımlar üretme.

    **Kurallar:**
    - Sorulara **sadece kitap içeriğine dayanarak** cevap ver, yerine ve sorusuna göre detaylı ve derinlemesine cevap verebilirsin.
    - Yorum sorularında özgün olabilirsin ama bilgi sorularında kitaba bağlı kal. 
    - **Kısa ve öz anlat** ancak önemli detayları kaçırma. Çok yüzeysel bilgiler sunma. Olay örgüsü sorularında olayların arka planını, 
    - neden-sonuç ilişkisini ve kitabın ruhunu yansıt. Ancak çok da uzatma kitaba bağlı kal.
    - **Kitapta olmayan bilgileri uydurma!** Eğer doğrudan bir bilgi yoksa, sadece kitap içeriğinden çıkarımlar yap.
    - **Selam, nasılsın, günaydın gibi genel sohbetlere cevap verme.** Eğer soru kitapla ilgili değilse, 
    - "Üzgünüm, sadece kitap ile ilgili sorulara cevap verebilirim.Ama seninle kitap hakkında konuşmayı çok isterim. 
    - Bana Megapik hakkında her şeyi sorabilirsin. 😊" tarzında bir cevap ver. Sen kendi cevabını ayarla her defasında.
    - **İnsan gibi konuş.** Cümlelerin doğal, akıcı ve duygusal derinliği olsun. Okuyucu, gerçekten kitabı bilen biriyle sohbet ediyormuş gibi hissetsin.
    
    **Kitap İçeriği:**  
    {relevant_text}  

    **Kullanıcı Sorusu:**  
    {user_question}  

    **Cevabın:**  
    """

    try:
        model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
        response = model.generate_content(
            [prompt],  # 🔹 İçerik listesi içinde gönderilmeli!
            generation_config={
                "max_output_tokens": 800,  # 🔹 Daha iyi cevap kontrolü
                "temperature": 0.2  # 🔹 Daha dengeli yanıtlar almak için 
            }
        )

        if response is None or response.text.strip() == "Bu bilgi kitapta yer almıyor":
            return {"response": "Bu konuda kitapta doğrudan bir bilgi bulunmuyor."}
        elif hasattr(response, "text"):
            # 1) Cevabı al
            answer = response.text.strip()
            # 2) Gelen geçmişe cevap mesajını ekle
            full_history = request.history + [{"role": "assistant", "content": answer}]
            # 3) Son 10 mesajı al
            trimmed_history = full_history[-10:]
            # 4) Döndür
            return {
                "response": answer,
                "history": trimmed_history
            }
        else:
            return {"response": "⚠️ API çağrısı başarılı oldu, ancak beklenen formatta yanıt alınamadı."}
    
    except Exception as e:
        return {"response": f"❌ Hata: {str(e)}"}

# 📌 4️⃣ HTML Sayfasını Göster
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# 📌 5️⃣ Statik klasördeki tüm .jpeg görselleri sıralı olarak döndür
@app.get("/api/backgrounds")
def list_background_images():
    try:
        files = os.listdir("static/backgrounds")
        # 🔹 Sadece görsel dosyalarını al
        allowed_extensions = (".jpeg", ".jpg", ".png", ".webp")
        images = sorted([
            f"/static/{f}" for f in files if f.lower().endswith(allowed_extensions)
        ])
        return images
    except Exception as e:
        return {"error": f"⚠️ Görsel listelenirken hata oluştu: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    load_dotenv()
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run("main:app", host=host, port=port, reload=False)


# 📌 7️⃣ Uvicorn ile çalıştırma
# 🔹 Şimdi bu kodu test edelim:
# python main.py
# 🔹 Eğer bu dosyayı doğrudan çalıştırıyorsanız, FastAPI sunucusunu başlatın
# uvicorn main:app --reload --port 8001

# eğer json bilgisi gelirse pycache ı temizleyip komutu yeniden çalıştırın
# Remove-Item -Recurse -Force __pycache__
# uvicorn main:app --reload --port 8001


# 📌 8️⃣ Şu soruları sor:
# 🔹 Kitabın kahramanları kimler?
# 🔹 Kitap hangi konuları işliyor?
# 🔹 Kitaptaki önemli olaylar nelerdir?
# 🔹 Kitapta geçen yerler nelerdir?
# 🔹 Kitabın yazarı kimdir?
# 🔹 Kitap hangi tarihte yayımlandı?
# 🔹 Kitap kaç sayfadır?
# 🔹 Kitabın konusu nedir?
# 🔹 Kitap hakkında genel bilgi verir misin?
# 🔹 Kitabın ana fikri nedir?
# 🔹 Kitap hakkında ne düşünüyorsun?
# 🔹 Kitabı tavsiye eder misin?
# 🔹 Kitap hakkında ne söylemek istersin?