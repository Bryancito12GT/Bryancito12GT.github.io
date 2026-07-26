/* ============================================================
   herramientas.js
   Calculadoras · cronómetros y temporizadores · logros
   ============================================================ */

/* ==========================================================
   1. CALCULADORAS
   ========================================================== */
const Calc = {

  /* --- Fórmulas --- */
  imc(peso, altura){ return peso / Math.pow(altura/100, 2); },

  clasificaImc(v){
    if(v < 18.5) return ['Bajo peso','ambar'];
    if(v < 25)   return ['Peso normal','verde'];
    if(v < 30)   return ['Sobrepeso','ambar'];
    if(v < 35)   return ['Obesidad grado I','rojo'];
    return ['Obesidad grado II o más','rojo'];
  },

  /* Método de la Marina de EE. UU. (perímetros, en cm) */
  grasaNavy(sexo, cintura, cuello, altura, cadera){
    if(!cintura || !cuello || !altura) return null;
    let v;
    if(sexo === 'h'){
      if(cintura - cuello <= 0) return null;
      v = 495 / (1.0324 - 0.19077*Math.log10(cintura - cuello) + 0.15456*Math.log10(altura)) - 450;
    }else{
      if(!cadera || cintura + cadera - cuello <= 0) return null;
      v = 495 / (1.29579 - 0.35004*Math.log10(cintura + cadera - cuello) + 0.22100*Math.log10(altura)) - 450;
    }
    return (v > 2 && v < 65) ? v : null;
  },

  /* Deurenberg, a partir del IMC: sirve como segunda opinión */
  grasaImc(imc, edad, sexo){
    return 1.20*imc + 0.23*edad - 10.8*(sexo === 'h' ? 1 : 0) - 5.4;
  },

  /* Mifflin-St Jeor: la más fiable sin medir composición corporal */
  bmr(peso, altura, edad, sexo){
    return 10*peso + 6.25*altura - 5*edad + (sexo === 'h' ? 5 : -161);
  },

  tdee(peso, altura, edad, sexo, factor){
    return Calc.bmr(peso, altura, edad, sexo) * factor;
  },

  /* Gasto de una actividad concreta: METs × kg × horas */
  gastoActividad(met, peso, minutos){ return met * peso * (minutos/60); },

  agua(peso, minEntreno){ return peso*0.035 + (minEntreno/60)*0.6; },

  /* Paquete completo: lo resuelve Nutri según el objetivo del usuario */
  completo(pesoManual){
    const n = Nutri.plan(pesoManual);
    return Object.assign({}, n, {deficit: n.diferencia});
  },

  /* --- Interfaz --- */
  pintar(){
    const p = App.estado.perfil;
    const musculo = App.esMusculo();
    const p_def = musculo ? (App.estado.ajustes.superavit || 0.12) : (App.estado.ajustes.deficit || 0.22);
    const opciones = musculo
      ? [[0.08,'Conservador — 8 %'],[0.12,'Estándar — 12 %'],[0.18,'Agresivo — 18 %']]
      : [[0.15,'Suave — 15 %'],[0.22,'Estándar — 22 %'],[0.27,'Agresivo — 27 %'],[0.32,'Muy agresivo — 32 %']];
    const selAjuste = `<label class="form-label">${musculo ? 'Tamaño del superávit' : 'Agresividad del déficit'}</label>
      <select class="form-select" id="c-deficit">${opciones.map(([v,t]) =>
        `<option value="${v}" ${p_def == v ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
    const peso = App.pesoActual();
    document.getElementById('sec-calculadoras').innerHTML = `
      <div class="titulo-seccion">
        <div>
          <div class="eyebrow">Todo se recalcula solo</div>
          <h2>Calculadoras</h2>
          <p>Cambia cualquier dato y el resto se actualiza al instante.</p>
        </div>
      </div>

      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-person-lines-fill"></i><h3>Tus datos</h3></div>
        <div class="row g-3" id="calc-datos">
          <div class="col-6 col-md-3">
            <label class="form-label">Peso actual (kg)</label>
            <input class="form-control" type="number" step="0.1" id="c-peso" value="${U.n(peso)}">
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Altura (cm)</label>
            <input class="form-control" type="number" id="c-altura" value="${p.altura}">
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Edad</label>
            <input class="form-control" type="number" id="c-edad" value="${p.edad}">
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Sexo</label>
            <select class="form-select" id="c-sexo">
              <option value="h" ${p.sexo === 'h' ? 'selected' : ''}>Hombre</option>
              <option value="m" ${p.sexo === 'm' ? 'selected' : ''}>Mujer</option>
            </select>
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Cintura (cm)</label>
            <input class="form-control" type="number" step="0.5" id="c-cintura" value="${p.cintura}">
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Cuello (cm)</label>
            <input class="form-control" type="number" step="0.5" id="c-cuello" value="${p.cuello}">
          </div>
          <div class="col-12 col-md-3">${selAjuste}</div>
          <div class="col-12 col-md-3">
            <label class="form-label">Nivel de actividad</label>
            <select class="form-select" id="c-actividad">
              <option value="1.375" ${p.actividad == 1.375 ? 'selected' : ''}>Ligero — trabajo sentado, poco movimiento</option>
              <option value="1.55"  ${p.actividad == 1.55  ? 'selected' : ''}>Moderado — este plan con trabajo sentado</option>
              <option value="1.725" ${p.actividad == 1.725 ? 'selected' : ''}>Alto — este plan con trabajo de pie o físico</option>
              <option value="1.9"   ${p.actividad == 1.9   ? 'selected' : ''}>Muy alto — trabajo físico pesado</option>
            </select>
          </div>
        </div>
        <div class="tenue mt-2" style="font-size:.78rem">
          Mide la cintura a la altura del ombligo, en ayunas y sin meter el estómago. El cuello, justo debajo
          de la nuez. Siempre a la misma hora y el mismo día de la semana.
        </div>
      </div>

      <div id="calc-resultados"></div>

      <div class="tarjeta mt-3">
        <div class="tarjeta__cab"><i class="bi bi-fire"></i><h3>Gasto calórico de una sesión</h3></div>
        <div class="row g-3 align-items-end">
          <div class="col-6 col-md-4">
            <label class="form-label">Actividad</label>
            <select class="form-select" id="c-met">
              <option value="3.5">Caminar rápido (5,5 km/h)</option>
              <option value="8.3" selected>Trotar (8 km/h)</option>
              <option value="9.8">Correr (9,7 km/h)</option>
              <option value="11.5">Intervalos de carrera</option>
              <option value="6">Fuerza intensa (este programa)</option>
              <option value="2.8">Movilidad y estiramiento</option>
              <option value="7.5">Bicicleta (20 km/h)</option>
              <option value="8">Saltar lazo</option>
            </select>
          </div>
          <div class="col-6 col-md-3">
            <label class="form-label">Minutos</label>
            <input class="form-control" type="number" id="c-min" value="45">
          </div>
          <div class="col-12 col-md-5">
            <div class="tarjeta" style="background:var(--fondo-2);padding:.7rem .9rem">
              <div class="metrica__etq">Gasto estimado</div>
              <div class="metrica__valor verde" id="c-gasto">—</div>
            </div>
          </div>
        </div>
        <div class="tenue mt-2" style="font-size:.78rem">
          Es una estimación por METs, no una medida. Los relojes y las máquinas suelen sobrestimar entre
          un 15 y un 30 %: no te comas las calorías que crees haber quemado.
        </div>
      </div>`;

    ['c-peso','c-altura','c-edad','c-sexo','c-cintura','c-cuello','c-actividad','c-deficit'].forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('input', Calc.actualizar);
      el.addEventListener('change', Calc.actualizar);
    });
    ['c-met','c-min'].forEach(id => {
      document.getElementById(id).addEventListener('input', Calc.actualizarGasto);
      document.getElementById(id).addEventListener('change', Calc.actualizarGasto);
    });
    Calc.actualizar();
    Calc.actualizarGasto();
  },

  actualizar(){
    const v = id => document.getElementById(id).value;
    const peso = Number(v('c-peso')) || 80;
    const altura = Number(v('c-altura')) || 175;
    const edad = Number(v('c-edad')) || 28;
    const sexo = v('c-sexo');
    const cintura = Number(v('c-cintura'));
    const cuello = Number(v('c-cuello'));
    const act = Number(v('c-actividad'));
    const ajuste = Number(v('c-deficit'));
    const musculo = App.esMusculo();

    /* Guarda los cambios en el perfil */
    Object.assign(App.estado.perfil, {altura, edad, sexo, cintura, cuello, actividad: act});
    if(musculo) App.estado.ajustes.superavit = ajuste;
    else App.estado.ajustes.deficit = ajuste;
    App.guardar();

    const imc = Calc.imc(peso, altura);
    const [clase, colorImc] = Calc.clasificaImc(imc);
    const gNavy = Calc.grasaNavy(sexo, cintura, cuello, altura);
    const gImc = Calc.grasaImc(imc, edad, sexo);
    const bmr = Calc.bmr(peso, altura, edad, sexo);
    const tdee = bmr * act;
    const magra = gNavy ? peso * (1 - gNavy/100) : null;
    const semanas = Plan.totalSemanas();

    let objetivo, diferencia, ritmo, ajustado = false;
    if(musculo){
      diferencia = Math.round(tdee * ajuste);
      objetivo = Math.round(tdee) + diferencia;
      ritmo = Math.min(peso * 0.004, diferencia * 7 / 7700 * 0.55);
    }else{
      objetivo = Math.round(tdee * (1 - ajuste));
      const suelo = Math.round(bmr * 1.05);
      if(objetivo < suelo){ objetivo = suelo; ajustado = true; }
      diferencia = Math.round(tdee - objetivo);
      ritmo = diferencia * 7 / 7700;
    }
    const pct = ritmo/peso*100;
    const proteina = Math.round((musculo ? peso : App.estado.perfil.pesoObjetivo) * 2.0);
    const grasa = Math.round(peso * (musculo ? 0.9 : 0.8));
    const carbo = Math.max(0, Math.round((objetivo - proteina*4 - grasa*9)/4));
    const agua = Calc.agua(peso, 60);

    let juicio, colorRitmo;
    if(musculo){
      if(pct > 0.6){ juicio = 'Demasiado rápido para ser músculo: buena parte de esa subida será grasa.'; colorRitmo = 'ambar'; }
      else if(pct >= 0.2){ juicio = 'Rango correcto: se construye músculo con poca grasa acompañante.'; colorRitmo = 'verde'; }
      else { juicio = 'Muy conservador. Si la báscula no se mueve en tres semanas, sube 150 kcal.'; colorRitmo = 'azul'; }
    }else{
      if(pct > 1.2){ juicio = 'Demasiado rápido: a este ritmo se pierde músculo con la grasa.'; colorRitmo = 'rojo'; }
      else if(pct > 1.0){ juicio = 'En el límite alto. Sostenible unas semanas, no varios meses.'; colorRitmo = 'ambar'; }
      else if(pct >= 0.5){ juicio = 'Rango correcto: rápido pero defendible con la proteína alta.'; colorRitmo = 'verde'; }
      else { juicio = 'Conservador. Puedes apretar un poco más el déficit.'; colorRitmo = 'azul'; }
    }

    document.getElementById('calc-resultados').innerHTML = `
      <div class="row g-3">
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">IMC</div>
          <div class="metrica__valor ${colorImc}">${U.n(imc)}</div>
          <div class="tenue mt-1" style="font-size:.76rem">${clase}</div>
          <div class="tenue mt-2" style="font-size:.72rem">No distingue músculo de grasa: úsalo solo como referencia gruesa.</div>
        </div></div>

        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Grasa corporal</div>
          <div class="metrica__valor azul">${gNavy ? U.n(gNavy) + '<span class="metrica__unidad">%</span>' : '—'}</div>
          <div class="tenue mt-1" style="font-size:.76rem">Método Navy (perímetros)</div>
          <div class="tenue mt-2" style="font-size:.72rem">Segunda estimación por IMC: ${U.n(gImc)} %.
            ${magra ? `Masa magra ≈ <b class="tenue-2">${U.n(magra)} kg</b>.` : ''}</div>
        </div></div>

        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Mantenimiento (TDEE)</div>
          <div class="metrica__valor">${Math.round(tdee)}<span class="metrica__unidad">kcal</span></div>
          <div class="tenue mt-1" style="font-size:.76rem">Metabolismo basal: ${Math.round(bmr)} kcal</div>
          <div class="tenue mt-2" style="font-size:.72rem">Es una estimación: la báscula de las próximas 2 semanas manda sobre esta cifra.</div>
        </div></div>

        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Objetivo diario</div>
          <div class="metrica__valor verde">${objetivo}<span class="metrica__unidad">kcal</span></div>
          <div class="tenue mt-1" style="font-size:.76rem">
            ${musculo ? 'Superávit' : 'Déficit'} de ${diferencia} kcal (${Math.round(ajuste*100)} %)</div>
          ${ajustado ? `<div class="ambar mt-2" style="font-size:.72rem">Ajustado al mínimo de seguridad: bajar más no acelera la grasa, solo hunde el rendimiento.</div>` : ''}
        </div></div>
      </div>

      <div class="row g-3 mt-0">
        <div class="col-12 col-lg-7"><div class="tarjeta h-100">
          <div class="tarjeta__cab"><i class="bi bi-pie-chart"></i><h3>Reparto de macronutrientes</h3></div>
          <div class="row g-2">
            <div class="col-4"><div class="tarjeta" style="background:var(--fondo-2);padding:.7rem">
              <div class="metrica__etq">Proteína</div>
              <div class="metrica__valor verde" style="font-size:1.8rem">${proteina}<span class="metrica__unidad">g</span></div>
              <div class="tenue" style="font-size:.72rem">${proteina*4} kcal · ${U.n(proteina/peso,1)} g/kg</div></div></div>
            <div class="col-4"><div class="tarjeta" style="background:var(--fondo-2);padding:.7rem">
              <div class="metrica__etq">Grasa</div>
              <div class="metrica__valor azul" style="font-size:1.8rem">${grasa}<span class="metrica__unidad">g</span></div>
              <div class="tenue" style="font-size:.72rem">${grasa*9} kcal · ${musculo ? 'apoyo hormonal' : 'mínimo hormonal'}</div></div></div>
            <div class="col-4"><div class="tarjeta" style="background:var(--fondo-2);padding:.7rem">
              <div class="metrica__etq">Carbohidrato</div>
              <div class="metrica__valor" style="font-size:1.8rem">${carbo}<span class="metrica__unidad">g</span></div>
              <div class="tenue" style="font-size:.72rem">${carbo*4} kcal · el resto</div></div></div>
          </div>
          <div class="divisor"></div>
          <div class="tenue" style="font-size:.82rem">
            ${musculo
              ? `La proteína se calcula sobre tu peso actual (${U.n(peso)} kg × 2,0 g). Por encima de 2,2 g/kg
                 no hay beneficio adicional demostrado: lo que sobra son calorías, no músculo.`
              : `La proteína se calcula sobre tu <b class="tenue-2">peso objetivo</b>
                 (${App.estado.perfil.pesoObjetivo} kg × 2,0 g), que es la forma más razonable de fijarla
                 cuando hay grasa que perder. Es intocable: si un día te pasas de calorías, recorta grasa o carbohidrato.`}
          </div>
        </div></div>

        <div class="col-12 col-lg-5">
          <div class="tarjeta mb-3">
            <div class="tarjeta__cab"><i class="bi bi-speedometer"></i><h3>Ritmo de ${musculo ? 'ganancia' : 'pérdida'}</h3></div>
            <div class="metrica__valor ${colorRitmo}">${musculo ? '+' : '−'}${U.n(ritmo,2)}<span class="metrica__unidad">kg / semana</span></div>
            <div class="tenue-2 mt-1" style="font-size:.82rem">${U.n(pct,2)} % del peso corporal por semana</div>
            <div class="divisor"></div>
            <div class="${colorRitmo}" style="font-size:.84rem">${juicio}</div>
            <div class="tenue mt-2" style="font-size:.78rem">
              En ${semanas} semanas: <b class="tenue-2">${musculo ? '+' : '−'}${U.n(ritmo*semanas,1)} kg</b> → terminarías cerca de
              <b class="tenue-2">${U.n(musculo ? peso + ritmo*semanas : peso - ritmo*semanas,1)} kg</b>.
            </div>
          </div>
          <div class="tarjeta">
            <div class="tarjeta__cab"><i class="bi bi-droplet"></i><h3>Agua diaria</h3></div>
            <div class="metrica__valor azul">${U.n(agua,1)}<span class="metrica__unidad">L</span></div>
            <div class="tenue mt-2" style="font-size:.8rem">
              35 ml por kg (${U.n(peso*0.035,1)} L) más 600 ml por cada hora de entrenamiento.
            </div>
          </div>
        </div>
      </div>`;
  },

  actualizarGasto(){
    const met = Number(document.getElementById('c-met').value);
    const min = Number(document.getElementById('c-min').value) || 0;
    const peso = Number(document.getElementById('c-peso').value) || 80;
    const kcal = Calc.gastoActividad(met, peso, min);
    document.getElementById('c-gasto').innerHTML =
      `${Math.round(kcal)}<span class="metrica__unidad">kcal</span>`;
  }
};

/* ==========================================================
   2. CRONÓMETROS Y TEMPORIZADORES
   ========================================================== */
const Cronos = {
  crono:{t:0, corriendo:false, id:null, vueltas:[]},
  descanso:{restante:0, id:null, total:90},
  inter:{id:null, fase:'', restante:0, ronda:0, config:{cal:600, fuerte:60, suave:120, rondas:8, enf:600}, activo:false},

  /* --- Sonido: un pitido corto generado sin archivos --- */
  pitido(freq = 880, ms = 180){
    if(!App.estado.ajustes.sonido) return;
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(), gan = ctx.createGain();
      osc.frequency.value = freq; osc.type = 'sine';
      gan.gain.setValueAtTime(0.001, ctx.currentTime);
      gan.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
      gan.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ms/1000);
      osc.connect(gan); gan.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + ms/1000 + 0.05);
      if(navigator.vibrate) navigator.vibrate(120);
    }catch(e){ /* sin audio disponible */ }
  },

  fmt(seg){
    seg = Math.max(0, Math.round(seg));
    const m = Math.floor(seg/60), s = seg%60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  },
  fmtLargo(cent){
    const seg = Math.floor(cent/100), c = cent%100;
    const m = Math.floor(seg/60), s = seg%60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}<span style="font-size:.45em">.${String(c).padStart(2,'0')}</span>`;
  },

  modal(titulo, cuerpo){
    let m = document.getElementById('modal-crono');
    if(!m){
      m = U.el(`<div class="modal fade" id="modal-crono" tabindex="-1"><div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="background:var(--tarjeta);border:1px solid var(--linea);border-radius:var(--r-l)">
          <div class="modal-header" style="border-color:var(--linea-suave)">
            <h5 class="modal-title display" id="modal-crono-t" style="text-transform:uppercase;letter-spacing:.06em"></h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body text-center" id="modal-crono-b"></div>
        </div></div></div>`);
      document.body.appendChild(m);
      m.addEventListener('hidden.bs.modal', () => Cronos.detenerTodo());
    }
    document.getElementById('modal-crono-t').textContent = titulo;
    document.getElementById('modal-crono-b').innerHTML = cuerpo;
    bootstrap.Modal.getOrCreateInstance(m).show();
  },

  detenerTodo(){
    clearInterval(Cronos.crono.id); Cronos.crono.corriendo = false;
    clearInterval(Cronos.descanso.id);
    clearInterval(Cronos.inter.id); Cronos.inter.activo = false;
  },

  /* --- Cronómetro ascendente --- */
  abrirCrono(){
    Cronos.crono = {t:0, corriendo:false, id:null, vueltas:[]};
    Cronos.modal('Cronómetro', `
      <div class="reloj reloj--xl" id="crono-pantalla">00:00<span style="font-size:.45em">.00</span></div>
      <div class="d-flex gap-2 justify-content-center mt-3 flex-wrap">
        <button class="btn btn-verde px-4" id="crono-btn" onclick="Cronos.alternarCrono()"><i class="bi bi-play-fill"></i> Iniciar</button>
        <button class="btn btn-linea" onclick="Cronos.vuelta()"><i class="bi bi-flag"></i> Vuelta</button>
        <button class="btn btn-linea" onclick="Cronos.resetCrono()"><i class="bi bi-arrow-counterclockwise"></i></button>
      </div>
      <div id="crono-vueltas" class="mt-3 text-start"></div>`);
  },
  alternarCrono(){
    const c = Cronos.crono, btn = document.getElementById('crono-btn');
    if(c.corriendo){
      clearInterval(c.id); c.corriendo = false;
      btn.innerHTML = '<i class="bi bi-play-fill"></i> Seguir';
      btn.className = 'btn btn-verde px-4';
      document.getElementById('crono-pantalla').classList.remove('reloj--corriendo');
    }else{
      c.corriendo = true;
      const t0 = Date.now() - c.t*10;
      c.id = setInterval(() => {
        c.t = Math.floor((Date.now() - t0)/10);
        const p = document.getElementById('crono-pantalla');
        if(p) p.innerHTML = Cronos.fmtLargo(c.t);
      }, 33);
      btn.innerHTML = '<i class="bi bi-pause-fill"></i> Pausa';
      btn.className = 'btn btn-linea px-4';
      document.getElementById('crono-pantalla').classList.add('reloj--corriendo');
    }
  },
  vuelta(){
    const c = Cronos.crono;
    if(!c.t) return;
    const prev = c.vueltas.length ? c.vueltas[c.vueltas.length-1].bruto : 0;
    c.vueltas.push({bruto:c.t, parcial:c.t - prev});
    Cronos.pitido(660, 90);
    document.getElementById('crono-vueltas').innerHTML = `<table class="tabla">
      <thead><tr><th>#</th><th class="num">Parcial</th><th class="num">Total</th></tr></thead>
      <tbody>${c.vueltas.map((v,i) => `<tr><td>${i+1}</td>
        <td class="num">${Cronos.fmtLargo(v.parcial)}</td>
        <td class="num tenue">${Cronos.fmtLargo(v.bruto)}</td></tr>`).reverse().join('')}</tbody></table>`;
  },
  resetCrono(){
    clearInterval(Cronos.crono.id);
    Cronos.crono = {t:0, corriendo:false, id:null, vueltas:[]};
    document.getElementById('crono-pantalla').innerHTML = '00:00<span style="font-size:.45em">.00</span>';
    document.getElementById('crono-vueltas').innerHTML = '';
    const b = document.getElementById('crono-btn');
    b.innerHTML = '<i class="bi bi-play-fill"></i> Iniciar'; b.className = 'btn btn-verde px-4';
  },

  /* --- Temporizador de descanso --- */
  abrirDescanso(){
    const d = App.estado.ajustes.descanso || 90;
    Cronos.modal('Descanso entre series', `
      <div class="reloj reloj--xl" id="desc-pantalla">${Cronos.fmt(d)}</div>
      <div class="chips-rapidos justify-content-center mt-3">
        ${[45,60,75,90,120,150,180].map(s =>
          `<button class="btn btn-linea btn-sm" onclick="Cronos.iniciarDescanso(${s})">${s < 60 ? s+' s' : (s/60)+' min'}</button>`).join('')}
      </div>
      <div class="d-flex gap-2 justify-content-center mt-3">
        <button class="btn btn-verde px-4" onclick="Cronos.iniciarDescanso(${d})"><i class="bi bi-play-fill"></i> Iniciar ${Cronos.fmt(d)}</button>
        <button class="btn btn-linea" onclick="Cronos.pararDescanso()"><i class="bi bi-stop-fill"></i></button>
      </div>
      <div class="tenue mt-3" style="font-size:.8rem">
        Básicos y series pesadas: 2–3 min. Aislamientos: 60–90 s. En el bloque de densidad, recorta 15 s cada semana.
      </div>`);
  },
  iniciarDescanso(seg){
    clearInterval(Cronos.descanso.id);
    Cronos.descanso.restante = seg; Cronos.descanso.total = seg;
    const p = document.getElementById('desc-pantalla');
    p.classList.add('reloj--corriendo'); p.classList.remove('reloj--alerta');
    p.textContent = Cronos.fmt(seg);
    const fin = Date.now() + seg*1000;
    Cronos.descanso.id = setInterval(() => {
      const r = (fin - Date.now())/1000;
      Cronos.descanso.restante = r;
      const el = document.getElementById('desc-pantalla');
      if(!el){ clearInterval(Cronos.descanso.id); return; }
      el.textContent = Cronos.fmt(r);
      if(r <= 3 && r > 0) el.classList.add('reloj--alerta');
      if(r <= 0){
        clearInterval(Cronos.descanso.id);
        el.textContent = '¡VA!'; el.classList.remove('reloj--alerta');
        Cronos.pitido(880, 260);
        setTimeout(() => Cronos.pitido(1180, 320), 300);
      }
    }, 100);
  },
  pararDescanso(){
    clearInterval(Cronos.descanso.id);
    const el = document.getElementById('desc-pantalla');
    if(el){ el.classList.remove('reloj--corriendo','reloj--alerta'); el.textContent = Cronos.fmt(Cronos.descanso.total); }
  },

  /* --- Temporizador de carrera / intervalos --- */
  abrirIntervalos(){
    const c = Cronos.inter.config;
    Cronos.modal('Temporizador de carrera', `
      <div class="eyebrow mb-1" id="int-fase">Listo para empezar</div>
      <div class="reloj reloj--xl" id="int-pantalla">${Cronos.fmt(c.cal)}</div>
      <div class="tenue mb-3" id="int-ronda">Calentamiento · ${c.rondas} rondas programadas</div>
      <div class="row g-2 text-start">
        <div class="col-6 col-md-4"><label class="form-label">Calentamiento (min)</label>
          <input class="form-control form-control-sm" type="number" id="int-cal" value="${c.cal/60}"></div>
        <div class="col-6 col-md-4"><label class="form-label">Tramo fuerte (s)</label>
          <input class="form-control form-control-sm" type="number" id="int-fuerte" value="${c.fuerte}"></div>
        <div class="col-6 col-md-4"><label class="form-label">Trote suave (s)</label>
          <input class="form-control form-control-sm" type="number" id="int-suave" value="${c.suave}"></div>
        <div class="col-6 col-md-4"><label class="form-label">Rondas</label>
          <input class="form-control form-control-sm" type="number" id="int-rondas" value="${c.rondas}"></div>
        <div class="col-6 col-md-4"><label class="form-label">Enfriamiento (min)</label>
          <input class="form-control form-control-sm" type="number" id="int-enf" value="${c.enf/60}"></div>
      </div>
      <div class="d-flex gap-2 justify-content-center mt-3">
        <button class="btn btn-verde px-4" onclick="Cronos.iniciarIntervalos()"><i class="bi bi-play-fill"></i> Iniciar</button>
        <button class="btn btn-linea" onclick="Cronos.pararIntervalos()"><i class="bi bi-stop-fill"></i> Parar</button>
      </div>
      <div class="tenue mt-3" style="font-size:.8rem">
        Configuración por defecto de la sesión de intervalos del jueves: 10 min suaves, 8 × (1 min fuerte /
        2 min suave) y 10 min de enfriamiento.
      </div>`);
  },
  iniciarIntervalos(){
    const num = id => Number(document.getElementById(id).value);
    const c = Cronos.inter.config = {
      cal: num('int-cal')*60, fuerte: num('int-fuerte'),
      suave: num('int-suave'), rondas: num('int-rondas'), enf: num('int-enf')*60
    };
    /* Construye la lista de tramos */
    const fases = [{n:'Calentamiento suave', s:c.cal, color:'azul'}];
    for(let i = 1; i <= c.rondas; i++){
      fases.push({n:`Fuerte · ronda ${i} de ${c.rondas}`, s:c.fuerte, color:'verde'});
      fases.push({n:`Recuperación · ronda ${i}`, s:c.suave, color:'azul'});
    }
    fases.push({n:'Enfriamiento', s:c.enf, color:'azul'});

    clearInterval(Cronos.inter.id);
    Cronos.inter.activo = true;
    let idx = 0, fin = Date.now() + fases[0].s*1000;
    const pintar = () => {
      const f = fases[idx];
      document.getElementById('int-fase').textContent = f.n;
      document.getElementById('int-ronda').textContent =
        `Tramo ${idx+1} de ${fases.length} · quedan ${fases.slice(idx+1).reduce((s,x) => s+x.s, 0)/60 | 0} min de sesión`;
      const p = document.getElementById('int-pantalla');
      p.className = 'reloj reloj--xl ' + (f.color === 'verde' ? 'verde' : 'azul');
    };
    pintar();
    Cronos.inter.id = setInterval(() => {
      const r = (fin - Date.now())/1000;
      const p = document.getElementById('int-pantalla');
      if(!p){ clearInterval(Cronos.inter.id); return; }
      p.textContent = Cronos.fmt(r);
      if(r <= 3 && r > 0 && Math.abs(r - Math.round(r)) < 0.06) Cronos.pitido(700, 90);
      if(r <= 0){
        idx++;
        if(idx >= fases.length){
          clearInterval(Cronos.inter.id);
          document.getElementById('int-fase').textContent = 'Sesión terminada';
          p.textContent = '¡LISTO!';
          Cronos.pitido(980, 400);
          return;
        }
        fin = Date.now() + fases[idx].s*1000;
        Cronos.pitido(fases[idx].color === 'verde' ? 1100 : 620, 300);
        pintar();
      }
    }, 100);
  },
  pararIntervalos(){
    clearInterval(Cronos.inter.id);
    Cronos.inter.activo = false;
    const p = document.getElementById('int-pantalla');
    if(p){ p.textContent = '00:00'; document.getElementById('int-fase').textContent = 'Detenido'; }
  }
};

/* ==========================================================
   3. LOGROS E INSIGNIAS
   ========================================================== */
const LOGROS = [
  {id:'arranque',  ico:'flag-fill',        t:'En marcha',            d:'Primer registro de peso guardado.',
   ok:e => e.registros.length >= 1},
  {id:'semana1',   ico:'calendar-check',   t:'Semana 1 cerrada',     d:'Adherencia del 80 % o más en la primera semana.',
   ok:() => App.adherenciaSemana(1) >= 80},
  {id:'racha7',    ico:'fire',             t:'Siete seguidos',       d:'7 días consecutivos entrenando o corriendo.',
   ok:() => App.rachaActual() >= 7},
  {id:'racha21',   ico:'lightning-charge-fill', t:'Tres semanas sin fallar', d:'21 días consecutivos de actividad.',
   ok:() => App.rachaActual() >= 21},
  {id:'km50',      ico:'signpost-2',       t:'50 km',                d:'50 kilómetros acumulados.',
   ok:() => App.kmTotales() >= 50},
  {id:'km150',     ico:'signpost-split',   t:'150 km',               d:'150 kilómetros acumulados.',
   ok:() => App.kmTotales() >= 150},
  {id:'km300',     ico:'globe-americas',   t:'300 km',               d:'300 kilómetros acumulados.',
   ok:() => App.kmTotales() >= 300},
  {id:'km500',     ico:'trophy-fill',      t:'500 km',               d:'500 kilómetros: el volumen de un maratoniano aficionado.',
   ok:() => App.kmTotales() >= 500},
  {id:'fuerza20',  ico:'activity',         t:'20 sesiones',          d:'20 entrenamientos de fuerza marcados.',
   ok:() => App.sesionesFuerza() >= 20},
  {id:'fuerza50',  ico:'shield-fill-check',t:'50 sesiones',          d:'50 entrenamientos de fuerza marcados.',
   ok:() => App.sesionesFuerza() >= 50},
  {id:'kg3',       ico:'graph-up-arrow',   t:'Primeros 3 kg',        d:'3 kg de cambio respecto al peso inicial.',
   ok:e => Math.abs(App.pesoActual() - e.perfil.pesoInicial) >= 3},
  {id:'kg8',       ico:'graph-up-arrow',   t:'8 kg de cambio',       d:'Ocho kilos de diferencia con el punto de partida.',
   ok:e => Math.abs(App.pesoActual() - e.perfil.pesoInicial) >= 8},
  {id:'kg15',      ico:'stars',            t:'15 kg de cambio',      d:'Transformación visible para cualquiera.',
   ok:e => Math.abs(App.pesoActual() - e.perfil.pesoInicial) >= 15},
  {id:'meta',      ico:'award-fill',       t:'Meta alcanzada',       d:'Llegaste al peso que te propusiste.',
   ok:e => App.esMusculo() ? App.pesoActual() >= e.perfil.pesoObjetivo
                           : App.pesoActual() <= e.perfil.pesoObjetivo},
  {id:'fotos4',    ico:'camera-fill',      t:'Cuatro fotos',         d:'4 fotos de progreso guardadas.',
   ok:e => e.fotos.length >= 4},
  {id:'registro10',ico:'journal-check',    t:'Diez semanas medidas', d:'10 registros semanales completos.',
   ok:e => e.registros.length >= 10},
  {id:'fuerzaLog', ico:'bar-chart-steps',  t:'Registro de cargas',   d:'25 series de fuerza anotadas.',
   ok:e => e.fuerza.length >= 25},
  {id:'bloque1',   ico:'1-circle-fill',    t:'Bloque base completo', d:'Semanas 1 a 5 terminadas.',
   ok:() => App.semanaActual() > 5},
  {id:'mitad',     ico:'hourglass-split',  t:'Mitad del camino',     d:'Semana 9 alcanzada.',
   ok:() => App.semanaActual() >= 9},
  {id:'final',     ico:'patch-check-fill', t:'17 semanas',           d:'Completaste el programa entero.',
   ok:() => App.semanaActual() >= 17}
];

const Logros = {
  revisar(){
    const e = App.estado;
    let nuevos = 0;
    LOGROS.forEach(l => {
      if(!e.logros.includes(l.id)){
        let ok = false;
        try{ ok = l.ok(e); }catch(err){ ok = false; }
        if(ok){ e.logros.push(l.id); nuevos++; Avisos.mostrar(`Insignia desbloqueada: ${l.t}`, 'award-fill'); }
      }
    });
    if(nuevos){ App.guardar(); Logros.pintar(); }
    return nuevos;
  },

  pintar(){
    const cont = document.getElementById('rejilla-logros');
    if(!cont) return;
    const g = App.estado.logros;
    cont.innerHTML = LOGROS.map(l => `
      <div class="col-12 col-md-6 col-xl-4">
        <div class="insignia ${g.includes(l.id) ? 'ganada' : ''}">
          <div class="insignia__ico"><i class="bi bi-${l.ico}"></i></div>
          <div><div class="insignia__t">${l.t}</div><div class="insignia__d">${l.d}</div></div>
        </div>
      </div>`).join('');
    const c = document.getElementById('conteo-logros');
    if(c) c.textContent = `${g.length} de ${LOGROS.length} desbloqueadas`;
  }
};
