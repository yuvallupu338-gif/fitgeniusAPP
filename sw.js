// sw.js - Offline Caching & PWA Coach

const CACHE_NAME = 'calitree-offline-v1';
const ASSETS = [
    './',
    './index.html'
];

// שלב 1: שמירת האפליקציה בזיכרון של הטלפון
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

// שלב 2: ניקוי גרסאות ישנות אם מעדכנים קוד
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});

// שלב 3: משיכת האפליקציה מהזיכרון כשאין אינטרנט!
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            // Fallback למקרה שאין אינטרנט בכלל
            return caches.match('./index.html');
        })
    );
});
