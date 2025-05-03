// Kullanıcıdan mesaj alıp API'ye gönderen JavaScript dosyası

// 🌄 Arka plan görselleri
const backgrounds = [];
let currentIndex = -1;

// 📝 Chat history limiti
const MAX_HISTORY = 10;
let history = [];

// 🌄 Arka planları yükle
async function loadBackgrounds() {
    try {
        const response = await fetch("/api/backgrounds");
        if (!response.ok) throw new Error(`Arka plan API hatası: ${response.status}`);
        const imageUrls = await response.json();

        // ✨ URL’leri backgrounds mount noktasına göre düzelt
        const fixedUrls = imageUrls.map(url => {
            // e.g. "/static/3.jpeg" --> "/backgrounds/3.jpeg"
            const filename = url.split("/").pop();
            return `/backgrounds/${filename}`;
        });

        await Promise.all(fixedUrls.map(url => new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                backgrounds.push(img);
                resolve();
            };
            img.src = url;
        })));

        if (backgrounds.length > 0) {
            currentIndex = 0;
            document.body.style.backgroundImage = `url(${backgrounds[0].src})`;
        }

    } catch (error) {
        console.error("⚠️ Arka plan yüklenemedi:", error);
        document.body.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
}

// 🎨 Arka planı değiştir (rastgele, ardışık tekrar yok)
function changeBackground() {
    if (backgrounds.length === 0) return;

    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * backgrounds.length);
    } while (nextIndex === currentIndex && backgrounds.length > 1);

    currentIndex = nextIndex;
    document.body.style.backgroundImage = `url(${backgrounds[currentIndex].src})`;
}

// ✉️ Mesaj gönderme
async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const userInput = inputField.value.trim();
    const sendButton = document.querySelector("button");
    if (!userInput) return;

    const chatBox = document.getElementById("chat-box");

    history.push({ role: "user", content: userInput });

    const userMessage = document.createElement("div");
    userMessage.className = "message user-message";
    userMessage.textContent = userInput;
    chatBox.appendChild(userMessage);

    inputField.value = "";
    inputField.disabled = true;
    sendButton.disabled = true;

    const botMessage = document.createElement("div");
    botMessage.className = "message bot-message";
    botMessage.textContent = "Yanıt yazılıyor...";
    chatBox.appendChild(botMessage);

    chatBox.scrollTop = chatBox.scrollHeight;
    const trimmed = history.slice(-MAX_HISTORY);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 50000);

        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ history: trimmed, message: userInput, num_chunks: 30 }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP hatası! Durum: ${response.status}`);
        const data = await response.json();

        history = data.history;
        botMessage.textContent = "";
        await typeText(botMessage, data.response);

    } catch (error) {
        botMessage.textContent = error.name === "AbortError"
            ? "⏳ İstek zaman aşımına uğradı"
            : "⚠️ Teknik bir hata oluştu";
        console.error("Chatbot hatası:", error);
    } finally {
        inputField.disabled = false;
        sendButton.disabled = false;
        inputField.focus();
        changeBackground();  // 🎨 Arka planı değiştir
    }
}

// ⌨️ Enter tuşuna basıldığında mesaj gönder
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
