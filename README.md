# Megapik_Yeniden_Chatbot

# 📖 Megapik Chatbot

**Megapik Chatbot**, Meltem Hınçal’ın *Megapik - Yeniden* kitabına dayalı olarak geliştirilmiş, doğal dil işleme (NLP) ve yapay zeka tabanlı bir sohbet botudur. Kullanıcılar, kitap içeriği hakkında sorular sorabilir ve chatbot, yalnızca kitap metninden aldığı bilgilerle yanıt üretebilir.

## 🚀 Projenin Amacı
Bu proje, kitap temelli akıllı sohbet botları geliştirme sürecini anlamak ve **Retrieval-Augmented Generation (RAG)** mimarisini kullanarak kitap bazlı bilgi erişimi sağlamak amacıyla oluşturulmuştur. Kitap içeriğini referans alan chatbot, **LLM (Large Language Model) destekli** doğal cevaplar üreterek kullanıcı deneyimini iyileştirmeyi hedefler.

## 🛠️ Kullanılan Teknolojiler
| Alan                      |     Teknoloji / Kütüphane        |
|---------------------------|----------------------------------|
| Backend                   | FastAPI, Uvicorn                 |
| NLP & Vektörleme          | HuggingFace, ChromaDB, LangChain |
| LLM API                   | Google Gemini API                |
| Frontend                  | HTML, CSS, JavaScript            |
| Veri Depolama             | ChromaDB                         |
| Ortam Yönetimi            | Python Dotenv                    |
| Test ve Paylaşım          | curl, ngrok                      |

## 📂 Proje Klasör Yapısı
```
📂 Megapik_Chatbot/
├── 📂 static/               # CSS, JS ve medya dosyaları
├── 📂 templates/            # HTML dosyaları
├── 📂 chroma_db/            # Vektör veritabanı
├── 📂 data/                 # Kitap PDF verisi
│   ├── megapik_yeniden.pdf  # Kitap metni
├── 📂 src/                  # Chatbot fonksiyonları
├── 📄 main.py               # FastAPI uygulaması
├── 📄 vector_store_api.py   # ChromaDB vektör işlemleri
├── 📄 requirements.txt      # Gerekli Python kütüphaneleri
├── 📄 README.md             # Proje dokümantasyonu
├── 📄 vercel.json           # Vercel deploy yapılandırması
├── 📄 .gitignore            # Git için gereksiz dosyaları dışarıda tutar
```

## 🔧 Kurulum ve Çalıştırma
### 1️⃣ Gerekli Bağımlılıkları Yükle
```
pip install -r requirements.txt
```

### 2️⃣ Sanal Ortamı Aktif Et
```
.\venv\Scripts\activate
```

### 3️⃣ ChromaDB’yi Hazırla (İlk Çalıştırmada Gerekli)
```
python vector_store_api.py
```

### 4️⃣ FastAPI Sunucusunu Çalıştır
```
uvicorn main:app --reload
```

### 5️⃣ Tarayıcıdan Aç
```
http://127.0.0.1:8000
```

### 6️⃣ Dışarıdan Erişim için Ngrok Kullan (Opsiyonel)
```
ngrok http 8000
```

🌐 Ngrok ile Uygulamaya Erişim
Uygulamayı dış dünyadan test etmek için aşağıdaki ngrok bağlantısını kullanabilirsiniz:

🔗 Ngrok URL:
👉 https://aa09-213-43-43-246.ngrok-free.app/

📌 Swagger UI:
👉 https://aa09-213-43-43-246.ngrok-free.app/docs

📌 Vektör Deposu Bilgisi (/vector_store_info)
👉 https://aa09-213-43-43-246.ngrok-free.app/vector_store_info


## 🛠️ Testler
### 1️⃣ API Testi için `curl`
```
curl http://127.0.0.1:8000/vector_store_info
```

### 2️⃣ FastAPI Otomatik API Dokümantasyonu
```
http://127.0.0.1:8000/docs
```

🛠 API Dokümantasyonu ve Debugging
Swagger UI entegrasyonu sayesinde, API uç noktalarını test edebilir ve JSON yanıtlarını görüntüleyebilirsin.

📌 Swagger UI'ye erişmek için:

Yerel ortamda: http://127.0.0.1:8000/docs
Ngrok ile paylaşılmış bağlantı: https://xxxxx.ngrok-free.app/docs
📌 Önemli Endpoint'ler:

Endpoint	Açıklama
GET /vector_store_debug	Vektör deposundaki verileri ve sorgu mekanizmasını test etmek için kullanılır. Bu endpoint, sistemin hangi veri parçalarını getirdiğini ve nasıl çalıştığını görmek için kullanılabilir.
POST /chat	Kullanıcının girdisini işleyerek LLM destekli chatbot yanıtını döndürür.
GET /vector_store_info	ChromaDB içindeki vektör sayısını gösterir.
📌 Nasıl Kullanılır?

Swagger UI’ye git: http://127.0.0.1:8000/docs
GET /vector_store_debug endpoint’ine tıkla.
"Try it out" butonuna bas ve "Execute" ile çalıştır.
Yanıt olarak en alakalı vektör chunk'larını göreceksin.


## 🎯 Sonuç ve Gelecek Çalışmalar
Bu proje, **kitap içeriğine dayalı chatbot geliştirme** sürecini detaylandırarak **bilgiye dayalı yapay zeka asistanlarının nasıl inşa edilebileceğini** gösteren bir çalışma olmuştur. Gelecekte **farklı veri kaynakları** ile genişletilerek akademik ve ticari kullanım alanları artırılabilir.

📌 **Geliştirici:** Günal Hınçal  
📆 **Tarih:** Mart 2025


## Follow Me for More Updates

Stay connected and follow me for updates on my projects, insights, and tutorials:

-  **LinkedIn:** **[Connect with me professionally to learn more about my work and collaborations](https://www.linkedin.com/in/gunalhincal)**
    
-   **Medium:** **[Check out my blog for articles on technology, data science, and more!](https://medium.com/@hincalgunal)**

Feel free to reach out or follow for more updates! 😊 Have Fun!
