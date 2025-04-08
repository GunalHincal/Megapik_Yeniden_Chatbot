const CACHE_NAME = 'megapik-cache-v2'; // ✅ Versiyonu artırdım
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
  // Background görselleri cache'le
  '/static/background1.jpeg',
  '/static/background2.jpeg',
  '/static/background3.jpeg',
  '/static/background4.jpeg',
  '/static/background5.jpeg',
  '/static/background6.jpeg',
  '/static/background7.jpeg',
  '/static/background8.jpeg',
  '/static/background9.jpeg',
  '/static/background10.jpeg',
  '/static/background11.jpeg',
  '/static/background12.jpeg',
  '/static/background13.jpeg',
  '/static/background14.jpeg',
  '/static/background15.jpeg',
  '/static/background16.jpeg',
  '/static/background17.jpeg',
  '/static/background18.jpeg',
  '/static/background19.jpeg',
  '/static/background20.jpeg'
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

// 🔔 Yeni versiyon için kullanıcıya bildirim (Opsiyonel, istersek eklenebilir)