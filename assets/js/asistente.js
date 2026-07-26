/* ============================================================
   asistente.js
   Asistente inicial: recoge los datos del usuario y genera
   un plan personalizado antes de entrar a la aplicación.
   ============================================================ */

const Asistente = {

  paso:0,
  borrador:{},

  PASOS:['datos','objetivo','detalle','presupuesto','resumen'],

  ACTIVIDADES:[
    {v:1.2,   n:'Sedentario',  d:'Trabajo sentado y menos de 5.000 pasos al día.'},
    {v:1.375, n:'Poco activo', d:'Trabajo sentado, pero caminas o entrenas algunos días.'},
    {v:1.55,  n:'Activo',      d:'Te mueves a diario y entrenas la mayoría de días.'},
    {v:1.725, n:'Muy activo',  d:'Trabajo físico o entrenamiento intenso casi todos los días.'}
  ],

  /* --- Arranque --- */
  necesario(){ return !App.estado.perfil.configurado; },

  abrir(reconfigurar){
    const p = App.estado.perfil;
    Asistente.borrador = {
      peso: App.estado.registros.length ? App.pesoActual() : (p.pesoInicial || ''),
      altura: p.altura || '', edad: p.edad || '',
      sexo: p.sexo || 'h', actividad: p.actividad || 1.55,
      objetivo: p.objetivo || '', pesoObjetivo: p.pesoObjetivo || '',
      meses: p.meses || 4, presupuestoCOP: p.presupuestoCOP || ''
    };
    Asistente.paso = 0;
    Asistente.reconfigurando = !!reconfigurar;
    document.body.classList.add('asistente-abierto');
    let cont = document.getElementById('asistente');
    if(!cont){
      cont = U.el('<div id="asistente" class="asistente" role="dialog" aria-modal="true" aria-label="Configuración del plan"></div>');
      document.body.appendChild(cont);
    }
    cont.style.display = 'flex';
    Asistente.pintar();
  },

  cerrar(){
    const c = document.getElementById('asistente');
    if(c) c.style.display = 'none';
    document.body.classList.remove('asistente-abierto');
  },

  /* --- Navegación entre pasos --- */
  siguiente(){
    if(!Asistente.validar()) return;
    if(Asistente.paso < Asistente.PASOS.length - 1){
      Asistente.paso++;
      Asistente.pintar();
    }
  },
  atras(){
    if(Asistente.paso > 0){ Asistente.paso--; Asistente.pintar(); }
  },

  validar(){
    const b = Asistente.borrador;
    const paso = Asistente.PASOS[Asistente.paso];
    if(paso === 'datos'){
      if(!b.peso || b.peso < 30 || b.peso > 300) return Asistente.error('Escribe un peso válido en kilogramos.');
      if(!b.altura || b.altura < 120 || b.altura > 230) return Asistente.error('Escribe una estatura válida en centímetros.');
      if(!b.edad || b.edad < 14 || b.edad > 90) return Asistente.error('Escribe una edad entre 14 y 90 años.');
    }
    if(paso === 'objetivo' && !b.objetivo) return Asistente.error('Elige un objetivo para continuar.');
    if(paso === 'detalle' && b.objetivo === 'grasa'){
      if(!b.pesoObjetivo) return Asistente.error('Escribe el peso al que quieres llegar.');
      if(Number(b.pesoObjetivo) >= Number(b.peso)) return Asistente.error('Para perder grasa, el peso objetivo debe ser menor que el actual.');
      const imcFinal = b.pesoObjetivo / Math.pow(b.altura/100, 2);
      if(imcFinal < 17) return Asistente.error('Ese peso objetivo queda por debajo de un rango saludable para tu estatura. Elige uno un poco más alto.');
    }
    if(paso === 'presupuesto' && (!b.presupuestoCOP || b.presupuestoCOP < 50000))
      return Asistente.error('Escribe tu presupuesto mensual aproximado para alimentación.');
    return true;
  },

  error(msg){ Avisos.mostrar(msg, 'exclamation-circle'); return false; },

  /* --- Guardado final --- */
  finalizar(){
    const b = Asistente.borrador;
    const p = App.estado.perfil;
    Object.assign(p, {
      altura: Number(b.altura), edad: Number(b.edad), sexo: b.sexo,
      actividad: Number(b.actividad), objetivo: b.objetivo,
      pesoInicial: Number(b.peso),
      pesoObjetivo: b.objetivo === 'grasa'
        ? Number(b.pesoObjetivo)
        : Math.round((Number(b.peso) + Number(b.peso) * 0.004 * Math.round(b.meses * 4.345)) * 10) / 10,
      meses: Number(b.meses),
      presupuestoCOP: Number(b.presupuestoCOP),
      presupuesto: Presupuesto.nivel(b.presupuestoCOP),
      configurado: true
    });
    if(!Asistente.reconfigurando || !App.estado.registros.length){
      p.inicio = Fechas.hoyISO();
    }
    /* El peso indicado pasa a ser el registro de hoy, para que todos los
       cálculos partan del dato más reciente */
    const hoy = Fechas.hoyISO();
    const i = App.estado.registros.findIndex(r => r.fecha === hoy);
    if(i >= 0) App.estado.registros[i].peso = Number(b.peso);
    else App.estado.registros.push({fecha:hoy, peso:Number(b.peso), km:0, animo:4,
      notas: App.estado.registros.length ? 'Peso al rehacer el plan' : 'Punto de partida'});
    App.estado.registros.sort((a,c) => a.fecha.localeCompare(c.fecha));
    App.guardar();
    Plan.aplicar();
    Presupuesto.aplicar();
    Asistente.cerrar();
    Nav.ir('inicio');
    Logros.revisar();
    Avisos.mostrar('Plan generado. Vamos a por ello.', 'stars');
  },

  /* --- Interfaz --- */
  pintar(){
    const cont = document.getElementById('asistente');
    const paso = Asistente.PASOS[Asistente.paso];
    const pct = (Asistente.paso) / (Asistente.PASOS.length - 1) * 100;
    const ultimo = Asistente.paso === Asistente.PASOS.length - 1;

    cont.innerHTML = `
      <div class="asistente__caja">
        <div class="asistente__cab">
          <div>
            <div class="eyebrow">Paso ${Asistente.paso + 1} de ${Asistente.PASOS.length}</div>
            <h2 class="display" style="font-size:1.7rem;text-transform:uppercase">${Asistente.TITULOS[paso]}</h2>
          </div>
          ${Asistente.reconfigurando ? `<button class="btn btn-linea btn-sm" onclick="Asistente.cerrar()" aria-label="Cerrar">
            <i class="bi bi-x-lg"></i></button>` : ''}
        </div>
        <div class="barra mb-4"><div class="barra__int" style="width:${pct}%"></div></div>

        <div class="asistente__cuerpo" id="asistente-cuerpo">${Asistente['paso_' + paso]()}</div>

        <div class="asistente__pie">
          ${Asistente.paso > 0
            ? `<button class="btn btn-linea" onclick="Asistente.atras()"><i class="bi bi-arrow-left"></i> Atrás</button>`
            : '<span></span>'}
          ${ultimo
            ? `<button class="btn btn-verde px-4" onclick="Asistente.finalizar()">Generar mi plan <i class="bi bi-check-lg"></i></button>`
            : `<button class="btn btn-verde px-4" onclick="Asistente.siguiente()">Continuar <i class="bi bi-arrow-right"></i></button>`}
        </div>
      </div>`;

    Asistente.enlazar();
  },

  TITULOS:{
    datos:'Tus datos',
    objetivo:'Tu objetivo',
    detalle:'La meta',
    presupuesto:'Tu presupuesto',
    resumen:'Tu plan'
  },

  /* Paso 1: datos básicos */
  paso_datos(){
    const b = Asistente.borrador;
    return `
      <p class="tenue mb-4" style="font-size:.9rem">
        Con esto se calculan tus calorías, tus macros y el ritmo de progreso. Puedes cambiarlo cuando quieras.
      </p>
      <div class="row g-3">
        <div class="col-6"><label class="form-label">Peso actual (kg)</label>
          <input class="form-control form-control-lg" type="number" step="0.1" inputmode="decimal"
                 data-campo="peso" value="${b.peso}" placeholder="75"></div>
        <div class="col-6"><label class="form-label">Estatura (cm)</label>
          <input class="form-control form-control-lg" type="number" inputmode="numeric"
                 data-campo="altura" value="${b.altura}" placeholder="175"></div>
        <div class="col-6"><label class="form-label">Edad</label>
          <input class="form-control form-control-lg" type="number" inputmode="numeric"
                 data-campo="edad" value="${b.edad}" placeholder="28"></div>
        <div class="col-6"><label class="form-label">Sexo</label>
          <div class="d-flex gap-2">
            <button class="opcion-mini ${b.sexo === 'h' ? 'sel' : ''}" data-sexo="h">Hombre</button>
            <button class="opcion-mini ${b.sexo === 'm' ? 'sel' : ''}" data-sexo="m">Mujer</button>
          </div></div>
      </div>
      <div class="metrica__etq mt-4 mb-2">Nivel de actividad física</div>
      <div class="d-grid gap-2">
        ${Asistente.ACTIVIDADES.map(a => `
          <button class="opcion ${Number(b.actividad) === a.v ? 'sel' : ''}" data-actividad="${a.v}">
            <div class="opcion__t">${a.n}</div>
            <div class="opcion__d">${a.d}</div>
          </button>`).join('')}
      </div>`;
  },

  /* Paso 2: objetivo */
  paso_objetivo(){
    const b = Asistente.borrador;
    return `
      <p class="tenue mb-4" style="font-size:.9rem">
        El objetivo cambia todo: las calorías, los macros, la rutina y hasta el mercado.
      </p>
      <div class="d-grid gap-3">
        <button class="opcion opcion--grande ${b.objetivo === 'grasa' ? 'sel' : ''}" data-objetivo="grasa">
          <div class="opcion__ico"><i class="bi bi-fire"></i></div>
          <div>
            <div class="opcion__t">Perder grasa</div>
            <div class="opcion__d">Déficit calórico calculado, fuerza para conservar músculo, cardio progresivo
              y HIIT opcional. Terminas más liviano y más definido.</div>
          </div>
        </button>
        <button class="opcion opcion--grande ${b.objetivo === 'musculo' ? 'sel' : ''}" data-objetivo="musculo">
          <div class="opcion__ico"><i class="bi bi-graph-up-arrow"></i></div>
          <div>
            <div class="opcion__t">Ganar músculo</div>
            <div class="opcion__d">Superávit controlado, rutina dividida por grupos musculares, sobrecarga
              progresiva y cardio mínimo. Crecimiento natural y estético, sin atajos.</div>
          </div>
        </button>
      </div>`;
  },

  /* Paso 3: meta concreta */
  paso_detalle(){
    const b = Asistente.borrador;
    const meses = [3,4,5,6,7,8,9,10];
    if(b.objetivo === 'musculo'){
      const semanas = Math.round(b.meses * 4.345);
      return `
        <p class="tenue mb-4" style="font-size:.9rem">
          En ganancia muscular no se fija un peso objetivo: se fija un tiempo. El músculo tarda lo que tarda
          y forzarlo solo añade grasa.
        </p>
        <div class="metrica__etq mb-2">¿Cuánto quieres que dure esta etapa?</div>
        <div class="rejilla-meses">
          ${meses.map(m => `<button class="opcion-mini ${Number(b.meses) === m ? 'sel' : ''}" data-meses="${m}">
            ${m} meses</button>`).join('')}
        </div>
        <div class="tarjeta mt-4" style="background:var(--fondo-2)">
          <div class="metrica__etq mb-1">Lo que se puede esperar</div>
          <div class="tenue-2" style="font-size:.88rem">
            Sin esteroides se construyen entre <b>0,2 y 0,5 kg de músculo al mes</b> (más en el primer año de
            entrenamiento serio, menos cuanto más avanzado estés). En ${b.meses} meses son unos
            <b class="verde">${U.n(b.peso ? b.peso*0.004*semanas : 2,1)} kg</b> de peso, con algo de grasa incluida:
            es normal e inevitable.
          </div>
        </div>`;
    }
    const semanas = Math.round(b.meses * 4.345);
    const aPerder = b.pesoObjetivo && b.peso ? b.peso - b.pesoObjetivo : 0;
    const ritmo = aPerder ? aPerder / semanas : 0;
    const pct = b.peso ? ritmo / b.peso * 100 : 0;
    const seguro = pct <= 1;
    return `
      <p class="tenue mb-4" style="font-size:.9rem">
        Escribe hasta dónde quieres llegar y en cuánto tiempo. Si el ritmo resulta demasiado agresivo,
        te lo digo aquí mismo.
      </p>
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-5"><label class="form-label">Peso objetivo (kg)</label>
          <input class="form-control form-control-lg" type="number" step="0.1" inputmode="decimal"
                 data-campo="pesoObjetivo" value="${b.pesoObjetivo}" placeholder="${b.peso ? Math.round(b.peso*0.88) : 70}"></div>
      </div>
      <div class="metrica__etq mb-2">¿En cuánto tiempo?</div>
      <div class="rejilla-meses">
        ${meses.map(m => `<button class="opcion-mini ${Number(b.meses) === m ? 'sel' : ''}" data-meses="${m}">
          ${m} meses</button>`).join('')}
      </div>
      ${aPerder > 0 ? `
        <div class="tarjeta mt-4 ${seguro ? 'tarjeta--acento' : 'tarjeta--aviso'}">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="metrica__etq">Ritmo que exige esa meta</span>
            <span class="cifra ${seguro ? 'verde' : 'ambar'}" style="font-size:1.3rem">${U.n(ritmo,2)} kg/sem</span>
          </div>
          <div class="tenue-2" style="font-size:.87rem">
            ${seguro
              ? `Son ${U.n(aPerder,1)} kg en ${semanas} semanas, un ${U.n(pct,2)} % de tu peso por semana.
                 Está dentro del rango donde se pierde grasa conservando músculo.`
              : `Son ${U.n(aPerder,1)} kg en ${semanas} semanas: un ${U.n(pct,2)} % de tu peso por semana,
                 por encima del 1 % que se considera el límite razonable. El plan usará un ritmo seguro y
                 tardarás algunas semanas más, o puedes dar más tiempo aquí mismo.`}
          </div>
        </div>` : ''}`;
  },

  /* Paso 4: presupuesto */
  paso_presupuesto(){
    const b = Asistente.borrador;
    const nivel = b.presupuestoCOP ? Presupuesto.nivel(b.presupuestoCOP) : null;
    const atajos = [250000, 450000, 800000];
    return `
      <p class="tenue mb-4" style="font-size:.9rem">
        Con esto se arma la lista de mercado y las recetas. No hay presupuesto malo: hay estrategias distintas.
      </p>
      <label class="form-label">Presupuesto mensual para alimentación (COP)</label>
      <input class="form-control form-control-lg" type="number" step="10000" inputmode="numeric"
             data-campo="presupuestoCOP" value="${b.presupuestoCOP}" placeholder="300000">
      <div class="chips-rapidos mt-2">
        ${atajos.map(a => `<button class="btn btn-linea btn-sm" data-presu="${a}">${U.cop(a)}</button>`).join('')}
      </div>
      <div class="d-grid gap-2 mt-4">
        ${Object.entries(Presupuesto.NIVELES).map(([k,v]) => `
          <div class="opcion ${nivel === k ? 'sel' : ''}" style="cursor:default">
            <div class="opcion__t">${v.etq} <span class="tenue" style="font-weight:400;font-size:.8rem">· ${v.rango}</span></div>
            <div class="opcion__d">${Asistente.DESC_PRESU[k]}</div>
          </div>`).join('')}
      </div>`;
  },

  DESC_PRESU:{
    bajo:'Huevos, lentejas, soya texturizada, arroz, avena, papa, atún y pollo cuando se pueda. Cubre todo lo necesario sin pasar hambre.',
    medio:'Se añaden carne magra, yogur griego, queso bajo en grasa, frutos secos y mucha más fruta y verdura.',
    alto:'Salmón, res magra, camarones, aguacate, frutos rojos, aceite de oliva extra virgen y proteína en polvo si la quieres.'
  },

  /* Paso 5: resumen */
  paso_resumen(){
    const b = Asistente.borrador;
    /* Cálculo en caliente sin tocar todavía el estado guardado */
    const bmr = Calc.bmr(Number(b.peso), Number(b.altura), Number(b.edad), b.sexo);
    const tdee = Math.round(bmr * Number(b.actividad));
    const semanas = Math.round(b.meses * 4.345);
    const musculo = b.objetivo === 'musculo';

    let objetivo, dif, prot, ritmo;
    if(musculo){
      dif = Math.round(tdee * 0.12);
      objetivo = tdee + dif;
      prot = Math.round(b.peso * 2.0);
      ritmo = Math.min(b.peso * 0.004, dif * 7 / 7700 * 0.55);
    }else{
      const aPerder = Math.max(0, b.peso - b.pesoObjetivo);
      ritmo = Math.min(aPerder / semanas, b.peso * 0.01);
      objetivo = Math.max(Math.round(bmr * 1.05), Math.round(tdee - ritmo * 7700 / 7));
      dif = tdee - objetivo;
      prot = Math.round(b.pesoObjetivo * 2.0);
    }
    const grasa = Math.round(b.peso * (musculo ? 0.9 : 0.8));
    const carbo = Math.max(0, Math.round((objetivo - prot*4 - grasa*9) / 4));
    const imc = b.peso / Math.pow(b.altura/100, 2);
    const nivel = Presupuesto.nivel(b.presupuestoCOP);

    return `
      <div class="row g-2 mb-3">
        <div class="col-6 col-md-3"><div class="tarjeta" style="padding:.75rem">
          <div class="metrica__etq">Mantenimiento</div>
          <div class="metrica__valor" style="font-size:1.7rem">${tdee}<span class="metrica__unidad">kcal</span></div></div></div>
        <div class="col-6 col-md-3"><div class="tarjeta" style="padding:.75rem">
          <div class="metrica__etq">Tu objetivo</div>
          <div class="metrica__valor verde" style="font-size:1.7rem">${objetivo}<span class="metrica__unidad">kcal</span></div>
          <div class="tenue" style="font-size:.7rem">${musculo ? '+' : '−'}${Math.abs(dif)} kcal</div></div></div>
        <div class="col-6 col-md-3"><div class="tarjeta" style="padding:.75rem">
          <div class="metrica__etq">Duración</div>
          <div class="metrica__valor azul" style="font-size:1.7rem">${semanas}<span class="metrica__unidad">sem</span></div>
          <div class="tenue" style="font-size:.7rem">${b.meses} meses</div></div></div>
        <div class="col-6 col-md-3"><div class="tarjeta" style="padding:.75rem">
          <div class="metrica__etq">IMC actual</div>
          <div class="metrica__valor" style="font-size:1.7rem">${U.n(imc)}</div>
          <div class="tenue" style="font-size:.7rem">${Calc.clasificaImc(imc)[0]}</div></div></div>
      </div>

      <div class="tarjeta mb-3">
        <div class="metrica__etq mb-2">Reparto diario</div>
        <div class="row g-2">
          <div class="col-4"><div class="macro"><div class="macro__v verde">${prot}g</div><div class="macro__e">Proteína</div></div></div>
          <div class="col-4"><div class="macro"><div class="macro__v">${carbo}g</div><div class="macro__e">Carbohidrato</div></div></div>
          <div class="col-4"><div class="macro"><div class="macro__v azul">${grasa}g</div><div class="macro__e">Grasa</div></div></div>
        </div>
      </div>

      <div class="tarjeta ${musculo ? 'tarjeta--acento' : 'tarjeta--acento'} mb-3">
        <div class="metrica__etq mb-2">Lo que vas a recibir</div>
        <ul class="lista-fina mb-0">
          <li>Rutina de ${musculo ? '6 días dividida por grupos musculares' : '4 días de fuerza más cardio progresivo y HIIT opcional'},
              con ${semanas} semanas de periodización y descargas programadas.</li>
          <li>Lista de mercado y recetas de presupuesto <b>${Presupuesto.NIVELES[nivel].etq.toLowerCase()}</b>,
              con menús que rotan para que no comas siempre lo mismo.</li>
          <li>Seguimiento de peso, medidas, fotos y fuerza, con gráficas automáticas.</li>
          <li>Calendario de rachas, panel de progreso, calculadoras, cronómetros e insignias.</li>
        </ul>
      </div>

      <div class="tenue" style="font-size:.8rem">
        Esto no sustituye a un médico ni a un nutricionista. Si tienes alguna condición de salud, lesiones
        previas o tomas medicación, consulta antes de empezar.
      </div>`;
  },

  /* --- Eventos de los controles --- */
  enlazar(){
    const cont = document.getElementById('asistente');

    cont.querySelectorAll('[data-campo]').forEach(el => {
      el.addEventListener('input', () => {
        Asistente.borrador[el.dataset.campo] = el.value;
        if(['pesoObjetivo','presupuestoCOP'].includes(el.dataset.campo)) Asistente.repintarSuave();
      });
    });
    cont.querySelectorAll('[data-sexo]').forEach(b =>
      b.addEventListener('click', () => { Asistente.borrador.sexo = b.dataset.sexo; Asistente.pintar(); }));
    cont.querySelectorAll('[data-actividad]').forEach(b =>
      b.addEventListener('click', () => { Asistente.borrador.actividad = Number(b.dataset.actividad); Asistente.pintar(); }));
    cont.querySelectorAll('[data-objetivo]').forEach(b =>
      b.addEventListener('click', () => {
        Asistente.borrador.objetivo = b.dataset.objetivo;
        Asistente.pintar();
        setTimeout(() => Asistente.siguiente(), 220);
      }));
    cont.querySelectorAll('[data-meses]').forEach(b =>
      b.addEventListener('click', () => { Asistente.borrador.meses = Number(b.dataset.meses); Asistente.pintar(); }));
    cont.querySelectorAll('[data-presu]').forEach(b =>
      b.addEventListener('click', () => { Asistente.borrador.presupuestoCOP = Number(b.dataset.presu); Asistente.pintar(); }));
  },

  /* Repinta solo el cuerpo, sin perder el foco del teclado */
  repintarSuave(){
    clearTimeout(Asistente._t);
    Asistente._t = setTimeout(() => {
      const paso = Asistente.PASOS[Asistente.paso];
      const activo = document.activeElement;
      const campo = activo && activo.dataset ? activo.dataset.campo : null;
      const pos = activo && activo.selectionStart;
      document.getElementById('asistente-cuerpo').innerHTML = Asistente['paso_' + paso]();
      Asistente.enlazar();
      if(campo){
        const nuevo = document.querySelector(`#asistente [data-campo="${campo}"]`);
        if(nuevo){ nuevo.focus(); try{ nuevo.setSelectionRange(pos, pos); }catch(e){} }
      }
    }, 420);
  }
};
