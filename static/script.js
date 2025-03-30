
// Kullanıcıdan mesaj alıp API'ye gönderen JavaScript dosyası

const backgrounds = [];
for (let i = 1; i <= 20; i++) {
    backgrounds.push(`/static/background${i}.jpeg`);
}

let currentIndex = 0;

function changeBackground() {
    currentIndex = (currentIndex + 1) % backgrounds.length;
    document.body.style.backgroundImage = `url(${backgrounds[currentIndex]})`;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

async function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    let chatBox = document.getElementById("chat-box");
    
    // Kullanıcı mesajını ekle
    let userMessage = document.createElement("div");
    userMessage.className = "message user-message";
    userMessage.innerText = userInput;
    chatBox.appendChild(userMessage);

    // Boş mesaj kutusu
    document.getElementById("user-input").value = "";

    // API'ye istek gönder
    let response = await fetch(window.location.origin + "/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userInput })
    });

    let data = await response.json();

    // Bot mesajını yazı animasyonu ile göster
    let botMessage = document.createElement("div");
    botMessage.className = "message bot-message";
    chatBox.appendChild(botMessage);

    let text = data.response;
    let index = 0;

    function typeText() {
        if (index < text.length) {
            botMessage.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeText, 30); // Harf harf yazma efekti
        }
    }
    typeText();

    // Sayfanın en altına otomatik kaydır
    chatBox.scrollTop = chatBox.scrollHeight;

    // 📌 Her mesaj sonrası arka planı değiştir
    changeBackground();
}
