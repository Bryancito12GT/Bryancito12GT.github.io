/* ============================================================
   sw.js — Service Worker
   Guarda la aplicación completa en el dispositivo para que
   funcione sin conexión desde la segunda visita.
   ============================================================ */

const CACHE = 't4m-v2';

const ARCHIVOS = [
  './',
  'index.html',
  'manifest.json',
  'assets/css/estilos.css',
  'assets/js/nucleo.js',
  'assets/js/datos-entreno.js',
  'assets/js/datos-nutricion.js',
  'assets/js/datos-mercado.js',
  'assets/js/plan.js',
  'assets/js/asistente.js',
  'assets/js/svg-ejercicios.js',
  'assets/js/herramientas.js',
  'assets/js/seguimiento.js',
  'assets/js/vistas.js',
  'assets/js/app.js',
  'assets/img/icono-192.png',
  'assets/img/icono-512.png',
  'assets/img/icono-maskable.png',
  'vendor/bootstrap/bootstrap.min.css',
  'vendor/bootstrap/bootstrap.bundle.min.js',
  'vendor/chartjs/chart.umd.js',
  'vendor/icons/bootstrap-icons.min.css',
  'vendor/icons/fonts/bootstrap-icons.woff2',
  'vendor/fonts/barlow-condensed-latin-400-normal.woff2',
  'vendor/fonts/barlow-condensed-latin-600-normal.woff2',
  'vendor/fonts/barlow-condensed-latin-700-normal.woff2',
  'vendor/fonts/inter-latin-400-normal.woff2',
  'vendor/fonts/inter-latin-500-normal.woff2',
  'vendor/fonts/inter-latin-700-normal.woff2'
];

/* Instalación: descarga todo de una vez */
self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(ARCHIVOS.map(a => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

/* Activación: borra versiones viejas */
self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Respuesta: primero la caché (rápido y sin datos), luego la red */
self.addEventListener('fetch', ev => {
  if(ev.request.method !== 'GET') return;
  ev.respondWith(
    caches.match(ev.request).then(hit => {
      if(hit) return hit;
      return fetch(ev.request).then(res => {
        if(res && res.status === 200 && res.type === 'basic'){
          const copia = res.clone();
          caches.open(CACHE).then(c => c.put(ev.request, copia));
        }
        return res;
      }).catch(() => caches.match('index.html'));
    })
  );
});
