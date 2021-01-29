const version = "v1.0.1"; // <--- Change this on every release
const cache = `nickliffenblog-${version}`;
const files = [
  './index.html',
  './404.html',
  './css/hyde.css',
  './css/poole.css',
  './articles/increasing-adoption-of-ghas-code-scanning-at-scale.html',
  './articles/building-a-simple-website.html'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cache).then((cache) => {
      return cache.addAll(files);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        return caches.open(cache).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      console.log('getting cache keys,', cacheNames)
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          console.log('filtered cacheNames,', cacheName);
        }).map(function(cacheName) {
          console.log('cacheName maps', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});
