// ÙŠØ®Ø²Ù‘Ù† Ù…Ù„ÙØ§Øª Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ Ù„ÙŠØ¹Ù…Ù„ Ø¨Ø¯ÙˆÙ† Ø¥Ù†ØªØ±Ù†Øª. ØºÙŠÙ‘Ø± Ø±Ù‚Ù… Ø§Ù„Ø¥ØµØ¯Ø§Ø± Ø¹Ù†Ø¯ ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ù…Ù„ÙØ§Øª.
const CACHE = 'mywallet-v4';
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Ø§Ù„Ø¶ØºØ· Ø¹Ù„Ù‰ Ø§Ù„Ø¥Ø´Ø¹Ø§Ø± ÙŠÙØªØ­ Ø§Ù„ØªØ·Ø¨ÙŠÙ‚
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then(l => l.length ? l[0].focus() : self.clients.openWindow('./')));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // Ø§Ù„Ø´Ø¨ÙƒØ© Ø£ÙˆÙ„Ø§Ù‹ Ø­ØªÙ‰ ØªØµÙ„ Ø§Ù„ØªØ­Ø¯ÙŠØ«Ø§ØªØŒ Ø«Ù… Ø§Ù„Ù†Ø³Ø®Ø© Ø§Ù„Ù…Ø®Ø²Ù†Ø© Ø¹Ù†Ø¯ Ø§Ù†Ù‚Ø·Ø§Ø¹ Ø§Ù„Ø¥Ù†ØªØ±Ù†Øª
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
