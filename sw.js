/* Service worker — rede primeiro no HTML; cache primeiro em imagem/áudio. */
var PREFIXO="maquina-tempo-vale-";
var CACHE=PREFIXO+"v2";

var ATIVOS=["./","./index.html","./manifest.json","./img/hv_base.png","./img/hv_fala.png","./img/hv_pisca.png","./img/hv_cr1.png","./img/hv_cr2.png","./img/hv_cr3.png","./img/hv_cr4.png","./img/hv_cr5.png","./img/hv_cr6.png","./img/hv_med.png","./img/hv_fundo.jpg","./img/hv_mata.jpg","./img/hv_aldeia.jpg","./img/hv_barco.jpg","./img/hv_colonia.jpg","./img/hv_roca.jpg","./img/hv_cidade.jpg","./audio/hv_abertura.mp3"];
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ATIVOS).catch(function(){});}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE&&k.indexOf(PREFIXO)===0)return caches.delete(k);}));}));self.clients.claim();});
function guardar(req,resp){try{if(resp&&resp.status===200&&resp.type==="basic"){var cp=resp.clone();caches.open(CACHE).then(function(c){c.put(req,cp);});}}catch(x){}return resp;}
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var req=e.request,aceita=req.headers.get("accept")||"";
  var ehPagina=(req.mode==="navigate")||aceita.indexOf("text/html")>=0;
  if(ehPagina){e.respondWith(fetch(req).then(function(r){return guardar(req,r);}).catch(function(){return caches.match(req).then(function(c){return c||caches.match("./index.html");});}));}
  else{e.respondWith(caches.match(req).then(function(c){var rede=fetch(req).then(function(r){return guardar(req,r);}).catch(function(){return c;});return c||rede;}));}
});
