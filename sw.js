const version = "v1.0.3"; // <--- Change this on every release
const cacheName = `nickliffenblog-${version}`;

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/404.html',
        '/css/hyde.css',
        '/css/poole.css',
        '/articles/increasing-adoption-of-ghas-code-scanning-at-scale.html',
        '/articles/building-a-simple-website.html'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        let responseClone = response.clone();
        caches.open(cacheName).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/404.html');
      });
    }
  }));
});

self.addEventListener('activate', (event) => {
  var cacheKeeplist = [cacheName];
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    }).catch((err) => {
      console.log('Error Cache Keys (Activate)', err)
    })
  );
});
