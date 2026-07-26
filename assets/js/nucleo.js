/* ============================================================
   nucleo.js
   Estado de la aplicación, guardado en LocalStorage, utilidades
   de fecha, navegación entre pestañas y avisos.
   ============================================================ */

const CLAVE = 't4m.estado.v1';

/* ---------- Estado por defecto ---------- */
const ESTADO_INICIAL = () => ({
  perfil:{
    nombre:'', sexo:'h', edad:28, altura:175,
    pesoInicial:80, pesoObjetivo:72, cuello:38, cintura:90,
    actividad:1.55, inicio:Fechas.hoyISO(),
    objetivo:'grasa',        // 'grasa' | 'musculo'
    meses:4,                 // duración elegida en el asistente
    presupuesto:'bajo',      // 'bajo' | 'medio' | 'alto'
    presupuestoCOP:250000,
    configurado:false        // false mientras no pase por el asistente
  },
  registros:[],   // {fecha,peso,cintura,pecho,brazo,muslo,animo,sueno,km,notas}
  fotos:[],       // {fecha,img}
  fuerza:[],      // {fecha,ej,peso,reps}
  dias:{},        // 'YYYY-MM-DD': {entreno,cardio,agua,sueno,dieta}
  precios:{},     // sobrescritura de precios del mercado
  logros:[],
  ajustes:{descanso:90, sonido:true, aguaMeta:3.2, deficit:0.22, superavit:0.12}
});

/* ---------- Utilidades de fecha ---------- */
const Fechas = {
  hoyISO(){ return Fechas.aISO(new Date()); },
  aISO(d){
    const z = new Date(d.getTime() - d.getTimezoneOffset()*60000);
    return z.toISOString().slice(0,10);
  },
  desdeISO(s){ const [a,m,d] = s.split('-').map(Number); return new Date(a, m-1, d); },
  sumarDias(iso, n){ const d = Fechas.desdeISO(iso); d.setDate(d.getDate()+n); return Fechas.aISO(d); },
  diffDias(a, b){ return Math.round((Fechas.desdeISO(b) - Fechas.desdeISO(a)) / 86400000); },
  /* 1 = lunes … 7 = domingo */
  diaSemana(iso){ const n = Fechas.desdeISO(iso).getDay(); return n === 0 ? 7 : n; },
  bonita(iso){
    const m = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    const d = Fechas.desdeISO(iso);
    return `${d.getDate()} ${m[d.getMonth()]}`;
  },
  larga(iso){
    const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const m = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const d = Fechas.desdeISO(iso);
    return `${dias[d.getDay()]} ${d.getDate()} de ${m[d.getMonth()]}`;
  }
};

/* ---------- Estado ---------- */
const App = {
  estado:null,

  cargar(){
    try{
      const bruto = localStorage.getItem(CLAVE);
      App.estado = bruto ? Object.assign(ESTADO_INICIAL(), JSON.parse(bruto)) : ESTADO_INICIAL();
      // asegura subobjetos si el guardado viene de una versión previa
      const base = ESTADO_INICIAL();
      for(const k of ['perfil','ajustes']) App.estado[k] = Object.assign(base[k], App.estado[k] || {});
      for(const k of ['registros','fotos','fuerza','logros']) App.estado[k] = App.estado[k] || [];
      for(const k of ['dias','precios']) App.estado[k] = App.estado[k] || {};
    }catch(e){
      console.warn('No se pudo leer el guardado, empiezo de cero.', e);
      App.estado = ESTADO_INICIAL();
    }
    return App.estado;
  },

  guardar(){
    try{
      localStorage.setItem(CLAVE, JSON.stringify(App.estado));
      return true;
    }catch(e){
      Avisos.mostrar('No hay espacio para guardar. Borra algunas fotos de progreso.', 'exclamation-triangle');
      return false;
    }
  },

  /* Semana del plan según la fecha de inicio y la duración elegida */
  totalSemanas(){
    return (typeof Plan !== 'undefined') ? Plan.totalSemanas() : 17;
  },
  totalDias(){ return App.totalSemanas() * 7; },
  semanaActual(){
    const d = Fechas.diffDias(App.estado.perfil.inicio, Fechas.hoyISO());
    return Math.min(App.totalSemanas(), Math.max(1, Math.floor(d / 7) + 1));
  },
  diaDelPlan(){
    return Math.max(0, Fechas.diffDias(App.estado.perfil.inicio, Fechas.hoyISO()));
  },
  esMusculo(){ return App.estado.perfil.objetivo === 'musculo'; },

  /* Cabecera: número de semanas del plan y bloque actual */
  refrescarMarca(){
    const logo = document.querySelector('.marca__logo');
    const sub = document.getElementById('marca-sub');
    if(logo) logo.textContent = App.totalSemanas();
    if(sub){
      const b = App.bloqueDeSemana(App.semanaActual());
      sub.textContent = `Semana ${App.semanaActual()} · ${b.nombre}`;
    }
  },
  bloqueDeSemana(n){
    const s = SEMANAS.find(s => s.n === n);
    return s ? BLOQUES[s.bloque] : BLOQUES.base;
  },
  claveBloque(n){
    const s = SEMANAS.find(s => s.n === n);
    return s ? s.bloque : 'base';
  },

  /* Peso más reciente registrado (o el inicial) */
  pesoActual(){
    const r = App.estado.registros.filter(r => r.peso);
    return r.length ? r[r.length-1].peso : App.estado.perfil.pesoInicial;
  },

  /* Marcas diarias */
  dia(iso){
    return App.estado.dias[iso] || {entreno:false, cardio:false, agua:false, sueno:false, dieta:false};
  },
  marcar(iso, campo, valor){
    const d = App.dia(iso);
    d[campo] = valor === undefined ? !d[campo] : valor;
    App.estado.dias[iso] = d;
    App.guardar();
    Logros.revisar();
    return d;
  },

  /* Adherencia: porcentaje de casillas marcadas en un rango */
  adherencia(desdeISO, hastaISO){
    let total = 0, hechas = 0;
    let f = desdeISO;
    const hoy = Fechas.hoyISO();
    while(f <= hastaISO && f <= hoy){
      const d = App.dia(f);
      total += 5;
      hechas += ['entreno','cardio','agua','sueno','dieta'].filter(k => d[k]).length;
      f = Fechas.sumarDias(f, 1);
    }
    return total ? Math.round(hechas / total * 100) : 0;
  },
  adherenciaSemana(n){
    const ini = Fechas.sumarDias(App.estado.perfil.inicio, (n-1)*7);
    return App.adherencia(ini, Fechas.sumarDias(ini, 6));
  },

  kmTotales(){
    return App.estado.registros.reduce((s,r) => s + (Number(r.km) || 0), 0);
  },
  sesionesFuerza(){
    return Object.values(App.estado.dias).filter(d => d.entreno).length;
  },
  /* Un día cuenta como cumplido con 3 de las 5 casillas marcadas */
  diaCumplido(iso){
    const d = App.dia(iso);
    return ['entreno','cardio','agua','sueno','dieta'].filter(k => d[k]).length >= 3;
  },
  diasCumplidos(){
    return Object.keys(App.estado.dias).filter(f => App.diaCumplido(f)).length;
  },
  mejorRacha(){
    const fechas = Object.keys(App.estado.dias).filter(f => App.diaCumplido(f)).sort();
    let mejor = 0, actual = 0, previa = null;
    fechas.forEach(f => {
      actual = (previa && Fechas.diffDias(previa, f) === 1) ? actual + 1 : 1;
      if(actual > mejor) mejor = actual;
      previa = f;
    });
    return mejor;
  },
  rachaCumplimiento(){
    let racha = 0, f = Fechas.hoyISO();
    if(!App.diaCumplido(f)) f = Fechas.sumarDias(f, -1);
    while(App.diaCumplido(f) && racha < 500){ racha++; f = Fechas.sumarDias(f, -1); }
    return racha;
  },
  /* Cumplimiento del mes indicado, en porcentaje */
  cumplimientoMes(anio, mes){
    const dias = new Date(anio, mes + 1, 0).getDate();
    const hoy = Fechas.hoyISO();
    let posibles = 0, hechos = 0;
    for(let d = 1; d <= dias; d++){
      const iso = Fechas.aISO(new Date(anio, mes, d));
      if(iso > hoy || iso < App.estado.perfil.inicio) continue;
      posibles++;
      if(App.diaCumplido(iso)) hechos++;
    }
    return {posibles, hechos, pct: posibles ? Math.round(hechos/posibles*100) : 0};
  },

  rachaActual(){
    let racha = 0, f = Fechas.hoyISO();
    // si hoy aún no hay nada marcado, la racha se cuenta desde ayer
    const hoyD = App.dia(f);
    if(!hoyD.entreno && !hoyD.cardio) f = Fechas.sumarDias(f, -1);
    while(true){
      const d = App.dia(f);
      if(d.entreno || d.cardio){ racha++; f = Fechas.sumarDias(f, -1); }
      else break;
      if(racha > 400) break;
    }
    return racha;
  }
};

/* ---------- Avisos emergentes ---------- */
const Avisos = {
  mostrar(texto, icono = 'check-circle'){
    const cont = document.getElementById('avisos');
    if(!cont) return;
    const el = document.createElement('div');
    el.className = 'aviso';
    el.innerHTML = `<i class="bi bi-${icono}"></i><span>${texto}</span>`;
    cont.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .4s'; }, 2600);
    setTimeout(() => el.remove(), 3100);
  }
};

/* ---------- Navegación ---------- */
const SECCIONES = [
  {id:'inicio',      etq:'Inicio',      ico:'house'},
  {id:'entrenamiento',etq:'Entrenamiento',ico:'activity'},
  {id:'cardio',      etq:'Cardio',      ico:'stopwatch'},
  {id:'alimentacion',etq:'Alimentación',ico:'egg-fried'},
  {id:'mercado',     etq:'Mercado',     ico:'basket'},
  {id:'recetas',     etq:'Recetas',     ico:'journal-richtext'},
  {id:'suplementos', etq:'Suplementos', ico:'capsule'},
  {id:'calculadoras',etq:'Calculadoras',ico:'calculator'},
  {id:'seguimiento', etq:'Seguimiento', ico:'graph-up-arrow'},
  {id:'calendario',  etq:'Calendario',  ico:'calendar3'},
  {id:'estadisticas',etq:'Estadísticas',ico:'bar-chart-line'},
  {id:'configuracion',etq:'Ajustes',    ico:'gear'}
];

const Nav = {
  actual:'inicio',

  construir(){
    const cont = document.getElementById('nav-pestanas');
    cont.innerHTML = SECCIONES.map(s => `
      <button class="pestana" data-seccion="${s.id}" role="tab" aria-selected="false">
        <i class="bi bi-${s.ico}"></i><span>${s.etq}</span>
      </button>`).join('');
    cont.addEventListener('click', e => {
      const b = e.target.closest('.pestana');
      if(b) Nav.ir(b.dataset.seccion);
    });
  },

  ir(id){
    Nav.actual = id;
    document.querySelectorAll('.seccion').forEach(s => s.classList.toggle('visible', s.id === 'sec-' + id));
    document.querySelectorAll('.pestana').forEach(p => {
      const activa = p.dataset.seccion === id;
      p.classList.toggle('activa', activa);
      p.setAttribute('aria-selected', activa);
      if(activa) p.scrollIntoView({block:'nearest', inline:'center', behavior:'smooth'});
    });
    window.scrollTo({top:0, behavior:'smooth'});
    location.hash = id;
    if(Vistas.alEntrar[id]) Vistas.alEntrar[id]();
  }
};

/* ---------- Utilidades varias ---------- */
const U = {
  n(v, dec = 1){ return Number(v).toFixed(dec).replace(/\.0$/, ''); },
  cop(v){ return '$' + Math.round(v).toLocaleString('es-CO'); },
  el(html){ const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; },
  esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); },
  vacio(icono, titulo, texto){
    return `<div class="vacio"><i class="bi bi-${icono}"></i><strong>${titulo}</strong><p>${texto}</p></div>`;
  }
};
