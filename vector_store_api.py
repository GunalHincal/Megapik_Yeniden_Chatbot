# 📌 1. Gerekli Kütüphaneleri Yükle

from fastapi import FastAPI
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyMuPDFLoader
import os


try:
    from langchain_huggingface import HuggingFaceEmbeddings
    from langchain_chroma import Chroma
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain_community.document_loaders import PyMuPDFLoader
    print("✅ Tüm importlar başarılı!")
except Exception as e:
    print("❌ Import hatası:", e)
    raise

# ✅ Ortam değişkenlerini yükle
load_dotenv()

# 📂 Dosya yolları
PDF_PATH = "data/megapik_yeniden.pdf"
CHROMA_DB_PATH = "./chroma_db"

# 📌 FastAPI uygulamasını başlat
app = FastAPI()

# 📌 1. PDF'ten Chunk'ları Çıkartma
def get_pdf_chunks(pdf_path):
    """PDF dosyasını okur, metni çıkartır ve küçük chunk'lara böler."""
    loader = PyMuPDFLoader(pdf_path)
    docs = loader.load()

    # 🔹 Metni daha uzun ve bağlamsal chunk'lara böl
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,  # 📌 Chunk boyutu
        chunk_overlap=300  # 📌 Cümlelerin bölünmesini önleme
    )
    chunked_docs = text_splitter.split_documents(docs)
    
    return chunked_docs

# 📌 2. Embedding Modeli
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# 📌 3. ChromaDB'yi Oluşturma Fonksiyonu
def create_vector_store():
    """ChromaDB'yi başlatır ve chunk'ları kaydeder."""
    chunks = get_pdf_chunks(PDF_PATH)
    chunk_count = len(chunks)  # 🔹 Oluşturulan chunk sayısını al
    print(f"📊 Toplam {chunk_count} chunk oluşturuldu!")

    _ = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=CHROMA_DB_PATH
        )

    return {
        "message": f"✅ {chunk_count} adet chunk başarıyla ChromaDB'ye kaydedildi!",
        "chunk_count": chunk_count
    }

# 📌 4. API Endpointleri
@app.post("/create_vector_store")
def api_create_vector_store():
    """Vektör deposunu oluşturmak için API endpointi"""
    response = create_vector_store()
    return response

@app.get("/")
def home():
    return {"message": "✅ Vector Store başarıyla oluşturuldu, API Çalışıyor!"}

@app.get("/test")
def test():
    return {"message": "Bu bir test endpointidir."}

@app.get("/vector_store_debug")
def vector_store_debug():
    """ChromaDB içindeki tüm vektörleri detaylı listeler."""
    try:
        documents = Chroma(persist_directory=CHROMA_DB_PATH, embedding_function=embeddings).vectorstore.get()
        return {
            "total_vectors": len(documents["documents"]),
            "details": documents
        }
    except Exception as e:
        return {"error": f"⚠️ Hata oluştu: {str(e)}"}


# 📌 5. FastAPI Sunucusunu Çalıştırmak İçin
# Eğer bu dosyayı doğrudan çalıştırıyorsanız, FastAPI sunucusunu başlatın
# ve PDF dosyasını okuyup chunk'ları oluşturun.
if __name__ == "__main__":
    import uvicorn
    import os
    from dotenv import load_dotenv

    # 🌍 Ortam değişkenlerini yükle
    load_dotenv()

    # 📥 Chunk oluştur ve terminale yazdır
    print("📥 PDF okunuyor, metin çekiliyor ve chunk'lar oluşturuluyor...")
    response = create_vector_store()
    print(response["message"])  # ✅ Chunk sayısını terminale yazdır

    # 🌐 Sunucu ayarlarını ortamdan al
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8001))

    # 🚀 FastAPI sunucusunu başlat
    uvicorn.run(app, host=host, port=port)



# 📌 6. FastAPI Sunucusunu Terminalden Çalıştırmak İçin / Direkt terminalden test etmek
# önce run et dosyayı vector store oluşturulsun: 
# python vector_store_api.py
# sonra terminalden çalıştır:
# uvicorn vector_store_api:app --reload --port 8001

# açılan sayfada şu mesaj gelmeli:
# {"message":"✅ Vector Store başarıyla oluşturuldu, API Çalışıyor!"} 



# sonra şu URL'yi aç: 👉 http://127.0.0.1:8001/docs

# ✅ ChromaDB'yi Windows PowerShell'de Silmek İçin: (ChromaDB’yi temizleyip tekrar oluşturur)
# Remove-Item -Recurse -Force .\chroma_db
# Remove-Item -Path .\static\backgrounds -Recurse -Force
# Remove-Item -Path .\venv -Recurse -Force
# Remove-Item -Recurse -Force __pycache__

# 📌 Eğer 8000 portu zaten kullanılıyorsa, başka bir port deneyebilirsiniz:
# uvicorn vector_store_api:app --host 127.0.0.1 --port 8080 --reload
# ✅ Sonra şu adrese git:
# 👉 http://127.0.0.1:8080/

# 📌 Tarayıcıda şu adrese git ve API’nin çalıştığını kontrol et:
# 👉 http://127.0.0.1:8001/docs veya http://localhost:8001/

# 📌 Chatbot'un HTML arayüzünü görmek için: 
# 👉 http://127.0.0.1:8001/

# 📌 ChromaDB içeriğini görmek için,  kaç chunk olduğunu
# 👉 http://127.0.0.1:8000/vector_store_info

# 📌 Bu yeni endpoint sayesinde ChromaDB’de kaç vektör, kaç döküman var, 
# bunlar nasıl eklenmiş, tekrar var mı gibi detayları öğrenebileceğiz.
# 👉 http://127.0.0.1:8001/vector_store_debug

# 🚀 Burada /create_vector_store endpointine basıp, ChromaDB’nin düzgün çalıştığını görebilirsin!

# http://127.0.0.1:8001/ → "Vector Store API Çalışıyor!"
# http://127.0.0.1:8001/test → "Bu bir test endpointidir."