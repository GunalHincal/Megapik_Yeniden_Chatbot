# Megapik 'Yeniden' Chatbot

Megapik Chatbot, Meltem Hınçal'ın "Megapik Genişleme" ile devam edecek olan bilim kurgu serisinin ilk kitabı olan "Megapik Yeniden" için özel olarak tasarlanmıştır.

📘 Nisan ayında raflarda ve kitap fuarlarında yerini alacak olan "Megapik Genişleme" kitabıyla bu büyülü evren de genişlemeye devam edecek!

Seriyi yakalamak, karakterleri tanımak ve kitap dünyasına derinlemesine dalmak için bu chatbot size her adımda rehberlik edecek.

Kitap hakkında merak ettiklerinizi sorun, ve bırakın Megapik anlatsın! 📚

## 📖 Megapik Chatbot

**Megapik Chatbot**, Meltem Hınçal’ın **Megapik - Yeniden** kitabına dayalı olarak geliştirilmiş, **doğal dil işleme (NLP)** ve yapay zeka tabanlı bir sohbet botudur. Kullanıcılar, kitap içeriği hakkında sorular sorabilir ve chatbot, yalnızca kitap metninden aldığı bilgilerle yanıt üretebilir.

## 🚀 Chatbotu Deneyimleyin

Chatbotu çevrimiçi denemek için Render üzerindeki bağlantıyı kullanabilirsiniz:

🔗 https://megapik-yeniden-chatbot.onrender.com/

## 🎯 Projenin Amacı

Bu proje, kitap temelli akıllı sohbet botları geliştirme sürecini anlamak ve **Retrieval-Augmented Generation (RAG)** mimarisini kullanarak kitap bazlı bilgi erişimi sağlamak amacıyla oluşturulmuştur. Kitap içeriğini referans alan chatbot, **LLM (Large Language Model)** destekli doğal cevaplar üreterek kullanıcı deneyimini iyileştirmeyi hedefler.

## 💡 Projenin Özellikleri

* Kullanıcı sorusu, ChromaDB üzerinden en alakalı parçalara (chunk) eşleştirilir.
* Bu içerik, Gemini API’ye gönderilerek insan benzeri doğal yanıtlar alınır.
* Arayüzde arka plan her mesajdan sonra otomatik değişir.

## 🛠️ Kullanılan Teknolojiler

| Alan               | Teknoloji / Kütüphane          |
| ------------------ | -------------------------------- |
| Backend            | FastAPI, Uvicorn                 |
| NLP & Vektörleme  | HuggingFace, ChromaDB, LangChain |
| LLM API            | Google Gemini API                |
| Frontend           | HTML, CSS, JavaScript            |
| Veri Depolama      | ChromaDB                         |
| Ortam Yönetimi    | Python Dotenv                    |
| Test ve Paylaşım | ngrok, render                    |

## 📂 Proje Klasör Yapısı

```
📂 MEGAPIK_YENIDEN_BOT/
├── 📂 chroma_db/                    # ChromaDB vektör veritabanı klasörü
├── 📂 data/                         # PDF dosyası burada yer alıyor
│   └── megapik_yeniden.pdf
├── 📂 static/                       # Statik dosyalar (CSS, JS, görseller)
│   ├── 📂 backgrounds/              # Arka plan görselleri (background1.jpeg ... background20.jpeg)
│   ├── android-chrome-*.png         # Favicon ikonları
│   ├── apple-touch-icon.png
│   ├── favicon.ico / .png
│   ├── megapik_yeniden_cover*.jpeg  # Kitap kapağı görselleri
│   ├── script.js                    # Chatbot JS dosyası
│   ├── service-worker.js            # Bildirim için SW
│   ├── site.webmanifest             # PWA yapılandırması
│   └── style.css                    # Stil dosyası
├── 📂 templates/
│   └── index.html                   # Chatbot HTML arayüzü
├── 📄 .env                         # Ortam değişkenleri
├── 📄 .gitignore                   # Git takip dışı bırakılacak dosyalar
├── 📄 main.py                      # FastAPI uygulaması
├── 📄 vector_store_api.py          # ChromaDB oluşturan script
├── 📄 README.md                    # Proje açıklaması
├── 📄 render.yaml                  # Render deploy ayar dosyası
├── 📄 requirements.txt             # Projenin ihtiyaç duyduğu kütüphaneler
└── 📄 requirements-docs.txt        # Kütüphane açıklamaları, notlar (silindi.)
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
uvicorn main:app --reload --port 8001
```

### 5️⃣ Tarayıcıdan Aç

```
http://127.0.0.1:8001
```

### 6️⃣ Dışarıdan Erişim için Ngrok Kullan (Opsiyonel)

```
ngrok http 8001
```

## 🔍 Endpointler ve API Testi

**🌐 Ngrok ile Uygulamaya Erişim**

Uygulamayı dış dünyadan test etmek için aşağıdaki ngrok bağlantısını kullanabilirsiniz.

#### 🔗 Ngrok URL:

Ngrok ile paylaşılmış bağlantı:

```
👉 https://aa09-213-43-43-246.ngrok-free.app/
```

#### 📌 Swagger UI:

```
👉 https://aa09-213-43-43-246.ngrok-free.app/docs

👉 http://127.0.0.1:8001/docs
```

#### 📌 Vektör Deposu Bilgisi (/vector_store_info)

```
👉 https://aa09-213-43-43-246.ngrok-free.app/vector_store_info

👉 http://127.0.0.1:8001/vector_store_info
```

#### 📌 Chatbot endpointi:

```
POST /chat
{
  "message": "Kitabın kahramanları kimler?"
}
```

## 🧪 Testler

### 1️⃣ API Testi için `curl`

```
curl http://127.0.0.1:8001/vector_store_info
```

### 2️⃣ Swagger UI Üzerinden Test

#### 🛠 FastAPI Dokümantasyonu ve Debugging

Swagger UI entegrasyonu sayesinde, API uç noktalarını test edebilir ve JSON yanıtlarını görüntüleyebilirsin.

#### 📌 Swagger UI'ye erişmek için:

```
Yerel ortamda: http://127.0.0.1:8001/docs adresine gidin.
```

* GET /vector_store_debug endpointini seçin.
* "Try it out" ve ardından "Execute" butonlarına tıklayın.
* Yanıtta vektör chunk bilgilerini görüntüleyin.

#### 📌 Önemli Endpoint'ler:

Endpoint Açıklama

**GET /** vector_store_debug	Vektör deposundaki verileri ve sorgu mekanizmasını test etmek için kullanılır. Bu endpoint, sistemin hangi veri parçalarını getirdiğini ve nasıl çalıştığını görmek için kullanılabilir.

**POST /** chat	Kullanıcının girdisini işleyerek LLM destekli chatbot yanıtını döndürür.

**GET /** vector_store_info	ChromaDB içindeki vektör sayısını gösterir.

#### 📌 Nasıl Kullanılır?

**Swagger UI’ye git:** http://127.0.0.1:8001/docs
GET /vector_store_debug endpoint’ine tıkla.
**"Try it out"** butonuna basın ve **"Execute"** ile çalıştırın.
Yanıt olarak en alakalı vektör chunk'larını göreceksiniz.

## 🎯 Sonuç ve Gelecek Çalışmalar

Bu proje, **kitap içeriğine dayalı chatbot geliştirme** sürecini detaylandırarak **bilgiye dayalı yapay zeka asistanlarının nasıl inşa edilebileceğini** gösteren bir çalışma olmuştur. Gelecekte **farklı veri kaynakları** ile genişletilerek akademik ve ticari kullanım alanları artırılabilir.

👩‍💻 **Geliştirici:** Günal Hınçal
📆 **Tarih:** Mart 2025

Her türlü geri bildiriminiz için ulaşabilirsiniz. Projeyi beğenip desteklemeyi unutmayın! 😊

**✨ Teşekkürler!**

## 🚀 Follow Me for More Updates

Stay connected and follow me for updates on my projects, insights, and tutorials:

- **LinkedIn:** **[Connect with me professionally to learn more about my work and collaborations](https://www.linkedin.com/in/gunalhincal)**
- **Medium:** **[Check out my blog for articles on technology, data science, and more!](https://medium.com/@hincalgunal)**

Feel free to reach out or follow for more updates! 😊 Have Fun!
