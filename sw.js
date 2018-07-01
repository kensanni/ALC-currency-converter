const cacheName = "Currency-converter";
const cacheData = [
  'images/bg.png',
  'index.html',
  'styles.css',
  'convert.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css',
  'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300',
  'https://free.currencyconverterapi.com/api/v5/currencies'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        return cache.addAll(cacheData)
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const cacheCurrenyResponse = response.clone();

          caches.open(cacheName).then(cache => {
            cache.put(event.request, cacheCurrenyResponse);
          })
          return response;
        })
      }
    )
  );
});
