const CACHE_NAME = 'soko-pwa-cache-v2.0.6'; // Version ပြောင်းလိုက်ပါသည်
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Update အသစ်လာရင် ချက်ချင်းပြောင်းရန်
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Cache အဟောင်းတွေကို ဖျက်ပစ်မည်
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Network First Strategy (အင်တာနက်ရှိရင် Netlify က အသစ်ကို အရင်ယူမည်၊ လိုင်းမရှိမှသာ Cache ထဲက အဟောင်းကို ယူမည်)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});