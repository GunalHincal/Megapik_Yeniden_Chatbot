// Kullanıcıdan mesaj alıp API'ye gönderen JavaScript dosyası

// 🌄 Arka plan görselleri
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

        // Tüm görselleri önbelleğe al
        await Promise.all(imageUrls.map(url => 
            new Promise((resolve) => {
                const img = new Image();
                img.onload = resolve;
                img.src = url;
                backgrounds.push(img);
            })
        ));

        // Sayfa yüklendiğinde ilk görseli ayarla
        if (backgrounds.length > 0) {
            currentIndex = 0;
            document.body.style.backgroundImage = `url(${backgrounds[currentIndex].src})`;
        }

    } catch (error) {
        console.error("⚠️ Arka plan yüklenemedi:", error);
        // Fallback arka plan
        document.body.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
}

// 🎨 Arka planı değiştir
function changeBackground() {
    if (backgrounds.length === 0) return;
    
    currentIndex = (currentIndex + 1) % backgrounds.length;
    const bgUrl = new URL(backgrounds[currentIndex].src, window.location.origin);
    document.body.style.backgroundImage = `url(${bgUrl.href})`;
}

// ✉️ Mesaj gönderme fonksiyonu
async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const userInput = inputField.value.trim();
    const sendButton = document.querySelector("button");

    if (!userInput) return;

    const chatBox = document.getElementById("chat-box");

    // 👤 Kullanıcı mesajını ekle (XSS korumalı)
    const userMessage = document.createElement("div");
    userMessage.className = "message user-message";
    userMessage.textContent = userInput; // textContent kullanımı XSS'i önler
    chatBox.appendChild(userMessage);

    // Input'u devre dışı bırak
    inputField.value = "";
    inputField.disabled = true;
    sendButton.disabled = true;

    // 🤖 Bot yanıtı için yer tutucu
    const botMessage = document.createElement("div");
    botMessage.className = "message bot-message";
    botMessage.textContent = "Yanıt yazılıyor...";
    chatBox.appendChild(botMessage);

    // Scroll'u en alta al
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // 10 saniye timeout ile istek gönder
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP hatası! Durum: ${response.status}`);
        }

        const data = await response.json();
        
        // Yazı animasyonu
        botMessage.textContent = "";
        await typeText(botMessage, data.response);

    } catch (error) {
        botMessage.textContent = error.name === "AbortError" 
            ? "⏳ İstek zaman aşımına uğradı" 
            : "⚠️ Teknik bir hata oluştu";
        console.error("Chatbot hatası:", error);
    } finally {
        // Input'u tekrar aktif et
        inputField.disabled = false;
        sendButton.disabled = false;
        inputField.focus();
        
        // Arka planı değiştir
        changeBackground();
    }
}

// ⌨️ Klavye kontrolü
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// 🔤 Yazı animasyonu
function typeText(element, text, speed = 30) {
    return new Promise((resolve) => {
        let index = 0;
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index++);
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

// 🚀 Sayfa yüklendiğinde
window.addEventListener('DOMContentLoaded', () => {
    loadBackgrounds();
    document.getElementById('user-input').focus();
});

// 🔄 Service Worker güncelleme bildirimi
if ('serviceWorker' in navigator) {
    let refreshing = false;
    
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <p>🎉 Yeni güncelleme yüklendi!</p>
            <button onclick="window.location.reload()">Yenile</button>
        `;
        document.body.appendChild(notification);
    });
}