/* Service worker de AUTO-DISTRUGERE.
   Rolul lui este să înlocuiască vechiul service worker (Cartea Fermecată), care
   servea pagina veche din cache. Când browserul verifică actualizările pentru
   service worker (la următoarea încărcare a paginii), preia acest fișier, care:
     1) golește TOATE cache-urile,
     2) se dezinstalează singur,
     3) reîncarcă ferestrele deschise -> pagina vine proaspătă de pe rețea.
   Aplicația „Bucătarul din Frigider" NU mai folosește deloc service worker. */

self.addEventListener("install", function(){
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil((async function(){
    try {
      var keys = await caches.keys();
      await Promise.all(keys.map(function(k){ return caches.delete(k); }));
    } catch(e){}
    try { await self.registration.unregister(); } catch(e){}
    try {
      var clients = await self.clients.matchAll({ type: "window" });
      clients.forEach(function(client){
        try { client.navigate(client.url); } catch(e){}
      });
    } catch(e){}
  })());
});

// Nu interceptăm nimic: totul merge direct la rețea.
self.addEventListener("fetch", function(){});
