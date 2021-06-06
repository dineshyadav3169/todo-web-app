var VERSION = 'v1';
var cacheFirstFiles = [
'/manifest.json',
'/image/dash.jpg',
'/svg/input.svg'
];
var networkFirstFiles = [
    '/index.html',
    '/dashboard.html',
	'/script/dash/auth/handler.js',
	'/script/dash/dash.js',
    '/script/dash/function.js',
    '/script/login/login.js',
];
var cacheFiles = cacheFirstFiles.concat(networkFirstFiles);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});
self.addEventListener('fetch', event => {
  console.log(event);
  if (event.request.method !== 'GET') { return; }
  if (networkFirstFiles.indexOf(event.request.url) !== -1) {
    event.respondWith(networkElseCache(event));
  } else if (cacheFirstFiles.indexOf(event.request.url) !== -1) {
    event.respondWith(cacheElseNetwork(event));
  } else {
    event.respondWith(fetch(event.request));
  }
});
function cacheElseNetwork (event) {
  return caches.match(event.request).then(response => {
    function fetchAndCache () {
       return fetch(event.request,{mode:'no-cors'}).then(response => {
        caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
        return response;
      });
    }
    if (!response) { return fetchAndCache(); }
    fetchAndCache();
    return response;
  });
}
function networkElseCache (event) {
  return caches.match(event.request).then(match => {
    if (!match) { return fetch(event.request,{mode:'no-cors'}); }
    return fetch(event.request,{mode:'no-cors'}).then(response => {
      caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
      return response;
    }) || response;
  });
}