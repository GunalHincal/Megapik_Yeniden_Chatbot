const CACHE_NAME = 'megapik-cache-v3.0.0'; // ✅ Versiyonu artırdım
const urlsToCache = [
  '/',
  '/static/style.css',
  '/static/script.js',
  '/static/megapik_cover.jpeg',
  '/static/favicon.ico',
  '/static/apple-touch-icon.png',
  '/static/android-chrome-192x192.png',
  '/static/android-chrome-512x512.png',
  '/static/site.webmanifest',
  // 🎨 Background görselleri cache'le (yeni klasör yolu!)
  '/static/backgrounds/background1.jpeg',
  '/static/backgrounds/background2.jpeg',
  '/static/backgrounds/background3.jpeg',
  '/static/backgrounds/background4.jpeg',
  '/static/backgrounds/background5.jpeg',
  '/static/backgrounds/background6.jpeg',
  '/static/backgrounds/background7.jpeg',
  '/static/backgrounds/background8.jpeg',
  '/static/backgrounds/background9.jpeg',
  '/static/backgrounds/background10.jpeg',
  '/static/backgrounds/background11.jpeg',
  '/static/backgrounds/background12.jpeg',
  '/static/backgrounds/background13.jpeg',
  '/static/backgrounds/background14.jpeg',
  '/static/backgrounds/background15.jpeg',
  '/static/backgrounds/background16.jpeg',
  '/static/backgrounds/background17.jpeg',
  '/static/backgrounds/background18.jpeg',
  '/static/backgrounds/background19.jpeg',
  '/static/backgrounds/background20.jpeg'
];

// 📦 Install: Cache dosyaları yükle
self.addEventListener('install', function(event) {
  console.log('📦 Service Worker: Install edildi.');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('📦 Service Worker: Cache başlatıldı.');
      return cache.addAll(urlsToCache);
    })
  );
});

// ⚙️ Activate: Eski cache'leri temizle
self.addEventListener('activate', function(event) {
  console.log('🧹 Service Worker: Activate edildi.');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eski cache siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 🌐 Fetch: Önce cache, yoksa internetten al
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// ✅ Skip waiting fonksiyonunu en sona ekle
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Yeni service worker aktif olunca hemen kontrolü alsın
self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

// 🔔 Yeni versiyon için kullanıcıya bildirim (Opsiyonel, istersek eklenebilir)
