const version = "v1.0.3"; // <--- Change this on every release
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
    }).catch((err) => {
      console.log('Error Cache Open (Install)', err)
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        let responseClone = response.clone();
        caches.open(cache).then((c) => {
          c.put(event.request, responseClone);
        }).catch((err) => {
          console.log('Error Cache Open (Fetch)', err)
        })
        return response;
      }).catch((err) => {
        console.log('Error Fetch (Fetch)', err)
      })
    }).catch((err) => {
      console.log('Error Cache Match (Fetch)', err)
    })
  );
});

self.addEventListener('activate', (event) => {
  var cacheKeeplist = [cache];
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
