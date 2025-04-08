// Kullanıcıdan mesaj alıp API'ye gönderen JavaScript dosyası

// 🌄 Tüm arka plan görsellerini /api/backgrounds endpoint'inden dinamik olarak alır
const backgrounds = [];
let currentIndex = -1;

async function loadBackgrounds() {
    try {
        const response = await fetch("/api/backgrounds");

        // 🔍 API yanıtını kontrol et
        if (!response.ok) {
            throw new Error(`Arka plan API hatası: ${response.status}`);
        }

        const imageUrls = await response.json();

        for (const url of imageUrls) {
            const img = new Image();
            img.src = url;
            backgrounds.push(img);
        }

        // 🔎 Yüklenen görselleri kontrol et
        console.log("✅ Yüklenen görsel sayısı:", backgrounds.length);
        console.log("🖼️ Yüklenen görseller:", backgrounds.map(img => img.src));

        // Sayfa yüklendiğinde ilk görseli ayarla
        if (backgrounds.length > 0) {
            currentIndex = 0;
            document.body.style.backgroundImage = `url(${backgrounds[currentIndex].src})`;
            console.log("🧪 İlk görsel yüklendi:", backgrounds[currentIndex].src);
        }

    } catch (error) {
        console.error("⚠️ Arka plan görselleri yüklenemedi:", error);
    }
}

// 🎨 Arka planı sırayla değiştirir
function changeBackground() {
    if (backgrounds.length === 0) return;

    currentIndex = (currentIndex + 1) % backgrounds.length;
    const nextImage = backgrounds[currentIndex].src;
    document.body.style.backgroundImage = `url(${nextImage})`;
    console.log("🎨 Yeni arka plan:", nextImage);
}

// ⌨️ Klavyeden Enter'a basıldığında mesajı gönder
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// ✉️ Kullanıcı mesajını al, API'ye gönder, bot yanıtını yaz
async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const userInput = inputField.value.trim();
    const sendButton = document.querySelector("button");

    if (userInput === "") return;

    const chatBox = document.getElementById("chat-box");

    // 👤 Kullanıcı mesajını ekle
    const userMessage = document.createElement("div");
    userMessage.className = "message user-message";
    userMessage.innerText = userInput;
    chatBox.appendChild(userMessage);

    // 📭 Input temizlensin ve devre dışı bırakılsın
    inputField.value = "";
    inputField.disabled = false;
    sendButton.disabled = true;

    // 🤖 Bot mesaj kutusu (önce "Yükleniyor..." yazsın)
    const botMessage = document.createElement("div");
    botMessage.className = "message bot-message";
    botMessage.innerText = "Yanıt yazılıyor...";
    chatBox.appendChild(botMessage);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput })
        });

        if (!response.ok) throw new Error("Sunucu hatası");

        const data = await response.json();
        const text = data.response;

        // 🔤 Yazı animasyonu
        botMessage.innerText = "";  // placeholder'ı temizle
        let index = 0;

        function typeText() {
            if (index < text.length) {
                botMessage.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeText, 30);   // Yazı animasyonu için bekleme süresi
            }
        }

        typeText();

    } catch (error) {
        botMessage.innerText = "⚠️ Bir hata oluştu. Lütfen tekrar deneyin.";
        console.error("Chatbot hatası:", error);
    }

    // 🧼 Input tekrar aktif olsun
    inputField.disabled = false;
    sendButton.disabled = false;
    inputField.focus();

    // 📜 Chatbox'ı aşağı kaydır
    chatBox.scrollTop = chatBox.scrollHeight;

    // 🌄 Her mesaj sonrası arka plan değişsin
    changeBackground();
}

// Sayfa açıldığında arka planları yükle
window.onload = async function () {
    await loadBackgrounds();
}

// 🚀 Service Worker yeni versiyonu olduğunda kullanıcıya bildirim göster
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', function() {
        const updateNotification = document.createElement('div');
        updateNotification.className = 'update-notification';
        updateNotification.innerHTML = `
            <p>🔄 Yeni bir güncelleme mevcut!</p>
            <button onclick="location.reload()">Sayfayı Yenile</button>
        `;
        document.body.appendChild(updateNotification);
    });
}
