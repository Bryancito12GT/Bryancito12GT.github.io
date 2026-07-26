/* ============================================================
   app.js
   Arranque: carga el estado, construye la navegación, pinta la
   primera sección y registra la instalación sin conexión.
   ============================================================ */

(function iniciar(){

  /* 1. Estado guardado */
  App.cargar();

  /* 2. Si es la primera visita, el plan empieza hoy */
  if(!App.estado.perfil.inicio) App.estado.perfil.inicio = Fechas.hoyISO();
  App.guardar();

  /* 3. Genera el plan y la lista de mercado según el perfil guardado */
  Plan.aplicar();
  Presupuesto.aplicar();

  /* 4. Navegación */
  Nav.construir();

  /* 5. Sección inicial: la del enlace si la hay, si no, inicio */
  const destino = location.hash.replace('#','');
  Nav.ir(SECCIONES.some(s => s.id === destino) ? destino : 'inicio');

  /* 6. Cabecera dinámica */
  App.refrescarMarca();

  /* 7. Primera vez: asistente de configuración */
  if(Asistente.necesario()) Asistente.abrir(false);

  /* 8. Revisión de logros al abrir */
  Logros.revisar();

  /* 9. Atajos de teclado en escritorio */
  document.addEventListener('keydown', ev => {
    if(ev.target.matches('input, select, textarea')) return;
    if(ev.key >= '1' && ev.key <= '9'){
      const s = SECCIONES[Number(ev.key) - 1];
      if(s) Nav.ir(s.id);
    }
    if(ev.key.toLowerCase() === 'd') Cronos.abrirDescanso();
    if(ev.key.toLowerCase() === 'c') Cronos.abrirCrono();
  });

  /* 10. Service worker: hace que funcione sin conexión */
  if('serviceWorker' in navigator && location.protocol.startsWith('http')){
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .catch(err => console.warn('Service worker no registrado:', err));
    });
  }

  /* 11. Instalación como aplicación */
  window.addEventListener('beforeinstallprompt', ev => {
    ev.preventDefault();
    window.promptInstalacion = ev;
    if(Nav.actual === 'configuracion'){
      const t = document.getElementById('tarjeta-instalar');
      if(t) t.style.display = '';
    }
  });

  window.addEventListener('appinstalled', () => {
    window.promptInstalacion = null;
    Avisos.mostrar('Aplicación instalada. Ya funciona sin datos.', 'phone');
  });

  /* 12. Al volver a la app tras cambiar de día, refresca la vista */
  let ultimoDia = Fechas.hoyISO();
  document.addEventListener('visibilitychange', () => {
    if(document.visibilityState === 'visible' && Fechas.hoyISO() !== ultimoDia){
      ultimoDia = Fechas.hoyISO();
      if(Vistas.alEntrar[Nav.actual]) Vistas.alEntrar[Nav.actual]();
    }
  });

})();
