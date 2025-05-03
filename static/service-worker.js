// service-worker.js (Sadeleştirilmiş Versiyon)

// 🔔 Sadece bildirim özelliğini tutuyoruz
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/').then(() => {
      // Ek işlemler yapılabilir
      console.log('Bildirim tıklandı, ana sayfa açılıyor');
    })
  );
});

// ⚠️ Diğer tüm Service Worker özelliklerini devre dışı bırakıyoruz
self.addEventListener('install', (event) => {
  console.log('Service Worker yüklendi (cache yok)');
  self.skipWaiting(); // Hemen aktif ol
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker aktif');
  event.waitUntil(self.clients.claim());
});

// 🌐 Ağ isteklerine müdahale etmiyoruz
self.addEventListener('fetch', (event) => {
  // Hiçbir şey yapma, doğrudan ağ isteğine izin ver
  return;
});

// 🔔 Yeni versiyon için kullanıcıya bildirim (Opsiyonel, istersek eklenebilir)
