const CACHE_NAME = 'swdelphus1';

const urlsToCache = [
    "/src",
    "/public/index.html",
    '/src/App.js',
    '/src/pages',
    '/src/pages/Clientes.js',
    '/src/pages/Menu.js',
    '/src/pages/EntrarForm.js',
    '/src/pages/Pedidos.js',
    '/src/pages/Produtos.js',
    '/src/pages/RegClientes.js',
    '/src/pages/Utils.js',
    '/src/pages/NotasFiscais.js',
    '/src/pages/Sincronizacao.js',
    '/src/index.js',
    '/src/index.css',
    '/src/App.css',
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'

]


self.addEventListener('install', function (event) {
  console.log('install')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('instalou')
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener("activate", event => {
  console.log('activate')
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        console.log('ativou')
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key);
        }
      }))
    )
  );
});


self.addEventListener('fetch', function (event) {
  console.log('fetch')
  event.respondWith(
    caches.match(event.request).then(response => {
      console.log('fetchou')
      return response || fetch(event.request);
    })
  );
});