/* ============================================================
   plan.js
   Genera el plan completo a partir de los datos del asistente:
   duración, periodización, plan de carrera y reparto de comidas.
   Los objetos globales SEMANAS, CARDIO y DIAS se reconstruyen
   aquí, de modo que el resto de la aplicación sigue igual.
   ============================================================ */

/* ---------- Bloques adicionales para el modo de ganancia muscular ---------- */
Object.assign(BLOQUES, {
  adapt:    {nombre:'Adaptación',  color:'#4CC5F5', rir:'3–2', desc:'Reaprender el patrón y acumular volumen tolerable. Tempo controlado en todo.'},
  hiper:    {nombre:'Hipertrofia', color:'#2BE08A', rir:'2–1', desc:'El bloque que más músculo construye: volumen alto y series cerca del fallo.'},
  fuerzaMax:{nombre:'Fuerza',      color:'#FFB13D', rir:'2–1', desc:'Menos repeticiones y variantes más difíciles. Subir fuerza es lo que permite crecer después.'},
  bombeo:   {nombre:'Metabólico',  color:'#FF6B6B', rir:'1–0', desc:'Repeticiones altas y descansos cortos. Mucho estrés metabólico con poca carga articular.'}
});

Object.assign(REGLAS_BLOQUE, {
  adapt:['Extremo bajo del rango de repeticiones, técnica por encima de todo.','RIR 3–2 en cada serie.','Tempo 3-1-1 en los básicos.','Objetivo: llegar al bloque siguiente sin molestias y con la técnica automática.'],
  hiper:['Extremo alto del rango de repeticiones.','RIR 2–1 en básicos y RIR 0 en el último aislamiento de cada grupo.','Añade una serie al ejercicio principal cada semana.','Objetivo: máximo volumen que puedas recuperar.'],
  fuerzaMax:['Baja al extremo bajo del rango con la variante más difícil que domines.','Descansos completos: 2–3 min en básicos.','RIR 2–1, nunca fallo técnico.','Objetivo: subir la carga que después usarás en hipertrofia.'],
  bombeo:['Sube las repeticiones un 30 % y baja los descansos a 45–60 s.','Superseries y myo-reps en todo lo que sea aislamiento.','RIR 1–0 en accesorios.','Objetivo: estrés metabólico y densidad sin castigar articulaciones.']
});

/* ---------- Semana tipo del modo ganancia muscular ---------- */
const DIAS_MUSCULO = [
  {id:1, corto:'Lun', nombre:'Lunes', titulo:'Pecho y tríceps',
   tipo:'fuerza', duracion:'50–60 min', musculos:'Pectoral · Tríceps · Hombro anterior · Core',
   calentamiento:'5 min: círculos de brazos, 12 flexiones fáciles, rotaciones de hombro con la barra vacía.',
   ejercicios:['press_piso','flexiones','aperturas_suelo','fondos_silla','extension_triceps','plancha_lastrada'],
   notas:'El press del suelo es tu ejercicio de referencia: anota siempre su mejor serie. Si sube, el plan funciona.'},

  {id:2, corto:'Mar', nombre:'Martes', titulo:'Espalda y bíceps',
   tipo:'fuerza', duracion:'55–65 min', musculos:'Dorsal · Trapecio · Bíceps · Antebrazo',
   calentamiento:'5 min: 15 remos con barra vacía, 10 pájaros ligeros, colgarse 20 s si tienes barra.',
   ejercicios:['remo_barra','remo_invertido','remo_unilateral','pullover','curl_barra','curl_martillo','paseo_granjero'],
   notas:'La espalda tolera mucho volumen y es lo que más ensancha la espalda alta. Es el día con más series de la semana.'},

  {id:3, corto:'Mié', nombre:'Miércoles', titulo:'Piernas (cuádriceps)',
   tipo:'fuerza', duracion:'55–65 min', musculos:'Cuádriceps · Glúteo · Gemelo · Abdomen',
   calentamiento:'5 min: 20 sentadillas al aire, 10 zancadas por pierna, movilidad de tobillo.',
   ejercicios:['sentadilla_goblet','bulgara','zancadas','sissy','step_up','gemelo_una_pierna','elevacion_piernas'],
   notas:'Con mancuernas limitadas, el trabajo unilateral y el tempo lento son los que hacen crecer la pierna. No corras las series.'},

  {id:4, corto:'Jue', nombre:'Jueves', titulo:'Hombros y core',
   tipo:'fuerza', duracion:'45–55 min', musculos:'Deltoides · Trapecio · Core',
   calentamiento:'5 min: rotaciones de hombro, 15 pájaros muy ligeros, plancha 30 s.',
   ejercicios:['press_militar','elevaciones_laterales','pajaros','antirrotacion','circuito_core'],
   notas:'Los hombros anchos son lo que más cambia la silueta en V. Aquí el peso ligero y las repeticiones altas mandan.'},

  {id:5, corto:'Vie', nombre:'Viernes', titulo:'Cadena posterior y brazos',
   tipo:'fuerza', duracion:'55–65 min', musculos:'Isquiotibiales · Glúteo · Bíceps · Tríceps',
   calentamiento:'5 min: 10 puentes de glúteo, 10 bisagras sin peso, 15 elevaciones de talón.',
   ejercicios:['peso_muerto_rumano','hip_thrust','curl_nordico','buenos_dias','gemelo_sentado','curl_barra','extension_triceps'],
   notas:'El nórdico y el rumano son los que más protegen la rodilla y el isquio. No los saltes aunque queden al final.'},

  {id:6, corto:'Sáb', nombre:'Sábado', titulo:'Torso completo y puntos débiles',
   tipo:'fuerza', duracion:'45–55 min', musculos:'Pecho · Espalda · Hombro · Brazo',
   calentamiento:'5 min de movilidad general y 10 flexiones suaves.',
   ejercicios:['flexiones','remo_unilateral','elevaciones_laterales','pullover','curl_martillo','fondos_silla'],
   notas:'Sesión de repaso: añade una serie extra al grupo que sientas más atrasado. Si vienes muy cansado, hazla ligera.'},

  {id:7, corto:'Dom', nombre:'Domingo', titulo:'Descanso y movilidad',
   tipo:'descanso', duracion:'20–30 min', musculos:'Recuperación · Movilidad',
   calentamiento:'Camina 10 min antes de estirar: nunca estires en frío.',
   ejercicios:['movilidad_domingo'],
   notas:'El músculo crece hoy, no ayer. Duerme, come y camina. Si añades cardio, que sea suave y corto.'}
];

/* ============================================================
   Plan: cálculo de duración, bloques, carrera y semana tipo
   ============================================================ */
const Plan = {

  /* --- Duración en semanas a partir de los meses elegidos --- */
  totalSemanas(){
    const m = Number(App.estado.perfil.meses) || 4;
    return Math.round(m * 4.345);
  },

  esMusculo(){ return App.estado.perfil.objetivo === 'musculo'; },

  /* --- Periodización: 4 semanas de carga + 1 de descarga --- */
  semanas(){
    const total = Plan.totalSemanas();
    const ciclo = Plan.esMusculo()
      ? ['adapt','hiper','fuerzaMax','hiper']
      : ['base','inten','densi','pico'];
    const out = [];
    let i = 0;
    for(let n = 1; n <= total; n++){
      if(n % 5 === 0){ out.push({n, bloque:'descarga'}); }
      else { out.push({n, bloque: ciclo[Math.floor(i/4) % ciclo.length]}); i++; }
    }
    /* Las dos últimas semanas siempre cierran en el bloque de pico o metabólico */
    const cierre = Plan.esMusculo() ? 'bombeo' : 'pico';
    out.slice(-2).forEach(s => { if(s.bloque !== 'descarga') s.bloque = cierre; });
    return out;
  },

  /* --- Plan de carrera semana a semana --- */
  cardio(){
    const total = Plan.totalSemanas();
    const p = App.estado.perfil;
    const out = [];

    if(Plan.esMusculo()){
      /* En volumen el cardio es salud cardiovascular, no gasto: poco y suave */
      for(let n = 1; n <= total; n++){
        const desc = n % 5 === 0;
        const km = desc ? 2.5 : 3.5;
        out.push({n, mar:[km,'suave'], jue:[0,'suave'], sab:[km,'suave'], dom:[0,'suave']});
      }
      return out;
    }

    /* En pérdida de grasa: progresión del 8 % semanal con descargas */
    const base = {1.2:10, 1.375:12, 1.55:15, 1.725:18}[p.actividad] || 12;
    const tope = 36;
    let semanal = base;
    for(let n = 1; n <= total; n++){
      const desc = n % 5 === 0;
      const km = desc ? semanal * 0.68 : semanal;
      const r = v => Math.round(v * 2) / 2;
      /* Los intervalos entran cuando ya hay base aeróbica */
      const tipoJue = n >= 8 ? 'int' : (n >= 4 ? 'tempo' : 'suave');
      const tipoSab = n >= 11 ? 'tempo' : 'suave';
      out.push({
        n,
        mar:[r(km * 0.20), 'suave'],
        jue:[r(km * 0.20), desc ? 'suave' : tipoJue],
        sab:[r(km * 0.22), desc ? 'suave' : tipoSab],
        dom:[r(km * 0.38), 'largo']
      });
      if(!desc) semanal = Math.min(tope, semanal * 1.08);
    }
    return out;
  },

  /* --- Semana tipo según el objetivo --- */
  dias(){ return Plan.esMusculo() ? DIAS_MUSCULO : DIAS_DEFECTO; },

  /* --- Aplica todo: reconstruye los globales que usan las vistas --- */
  aplicar(){
    SEMANAS = Plan.semanas();
    CARDIO  = Plan.cardio();
    DIAS    = Plan.dias();
  },

  /* --- Sesión de HIIT opcional (solo en pérdida de grasa) --- */
  hiit:{
    nombre:'HIIT opcional (20 min)',
    cuando:'Como máximo una vez por semana, y nunca el día antes ni después de la tirada larga.',
    formato:'5 min de calentamiento · 8 rondas de 20 s a tope y 40 s muy suave · 5 min de vuelta a la calma.',
    variantes:['Sprints en cuesta o en plano','Saltar lazo','Burpees','Sentadilla con salto alternando con zancadas'],
    aviso:'Gasta menos calorías de lo que la gente cree y cansa mucho más que el trote suave. Es un complemento, no un sustituto del cardio de base ni del déficit.'
  }
};

/* ============================================================
   Nutri: calorías y macros para los dos objetivos
   ============================================================ */
const Nutri = {

  /* Devuelve el paquete nutricional completo del usuario */
  plan(pesoManual){
    const p = App.estado.perfil;
    const peso = pesoManual || App.pesoActual();
    const bmr = Calc.bmr(peso, p.altura, p.edad, p.sexo);
    const tdee = Math.round(bmr * p.actividad);

    if(p.objetivo === 'musculo') return Nutri.volumen(peso, bmr, tdee, p);
    return Nutri.definicion(peso, bmr, tdee, p);
  },

  /* --- Pérdida de grasa --- */
  definicion(peso, bmr, tdee, p){
    const semanas = Plan.totalSemanas();
    const aPerder = Math.max(0, p.pesoInicial - p.pesoObjetivo);
    /* Ritmo que exige la meta del usuario */
    const ritmoPedido = aPerder / semanas;
    const deficitPedido = ritmoPedido * 7700 / 7;

    /* Límites de seguridad: como mucho el 1 % del peso por semana
       y nunca por debajo del metabolismo basal más un 5 % */
    const ritmoMax = peso * 0.01;
    const suelo = Math.round(bmr * 1.05);
    let ritmo = Math.min(ritmoPedido, ritmoMax);
    let objetivo = Math.round(tdee - ritmo * 7700 / 7);
    let ajustado = false;
    if(objetivo < suelo){ objetivo = suelo; ajustado = true; ritmo = (tdee - objetivo) * 7 / 7700; }

    const realista = ritmoPedido <= ritmoMax * 1.02;
    const semanasNecesarias = ritmo > 0 ? Math.ceil(aPerder / ritmo) : semanas;

    const proteina = Math.round(p.pesoObjetivo * 2.0);
    const grasa = Math.round(peso * 0.8);
    const carbo = Math.max(0, Math.round((objetivo - proteina*4 - grasa*9) / 4));

    return {
      modo:'definicion', peso, bmr:Math.round(bmr), tdee, objetivo,
      diferencia: tdee - objetivo, proteina, grasa, carbo,
      ritmo, pctSemanal: ritmo/peso*100, ajustado, realista,
      semanas, semanasNecesarias, aPerder,
      pesoFinal: peso - ritmo * Math.max(0, semanas - App.semanaActual() + 1),
      agua: Calc.agua(peso, 60)
    };
  },

  /* --- Ganancia muscular --- */
  volumen(peso, bmr, tdee, p){
    const semanas = Plan.totalSemanas();
    /* Superávit del 12 %: suficiente para construir, poco para engordar.
       Un principiante gana como mucho 0,25–0,5 % del peso por semana. */
    const superavit = Math.round(tdee * 0.12);
    const objetivo = tdee + superavit;
    const ritmo = Math.min(peso * 0.004, superavit * 7 / 7700 * 0.55);

    const proteina = Math.round(peso * 2.0);
    const grasa = Math.round(peso * 0.9);
    const carbo = Math.max(0, Math.round((objetivo - proteina*4 - grasa*9) / 4));

    return {
      modo:'volumen', peso, bmr:Math.round(bmr), tdee, objetivo,
      diferencia: superavit, superavit, proteina, grasa, carbo,
      ritmo, pctSemanal: ritmo/peso*100, ajustado:false, realista:true,
      semanas, ganancia: ritmo * semanas,
      pesoFinal: peso + ritmo * Math.max(0, semanas - App.semanaActual() + 1),
      agua: Calc.agua(peso, 60)
    };
  },

  /* Texto honesto sobre lo que cabe esperar */
  expectativa(){
    const n = Nutri.plan(), p = App.estado.perfil;
    if(n.modo === 'volumen'){
      return {
        titulo:'Qué esperar en ' + p.meses + ' meses de volumen',
        color:'aviso',
        texto:`Un hombre o mujer sin esteroides construye entre <b>0,2 y 0,5 kg de músculo al mes</b> si ya
        lleva tiempo entrenando, y hasta el doble en el primer año. En ${p.meses} meses eso son
        <b class="verde">${U.n(n.ganancia,1)} kg</b> de peso, de los cuales una parte será grasa: es inevitable
        y es normal. Los físicos que te gustan se construyen en años, no en meses, y casi siempre con
        varios ciclos de volumen y definición encadenados.
        <br><br>El superávit está en un <b>12 %</b> sobre tu mantenimiento a propósito. Comer 1.000 kcal de más
        no construye músculo más rápido: el techo lo pone tu capacidad de recuperación, no el plato.
        Todo lo que sobre de ese techo se acumula como grasa y te obliga a una definición más larga después.`
      };
    }
    const kg = U.n(n.aPerder,1);
    return {
      titulo:'Qué esperar en ' + p.meses + ' meses',
      color: n.realista ? 'acento' : 'aviso',
      texto: n.realista
        ? `Tu meta son <b>${kg} kg en ${n.semanas} semanas</b>, es decir ${U.n(n.ritmo,2)} kg por semana
          (${U.n(n.pctSemanal,2)} % del peso corporal). Está dentro del rango donde se pierde grasa rápido
          conservando músculo: por debajo del 1 % semanal. Con la proteína alta y el entrenamiento de fuerza
          hecho, la mayor parte de lo que baje la báscula será grasa.`
        : `Tu meta son <b>${kg} kg en ${n.semanas} semanas</b>, lo que exige ${U.n(n.aPerder/n.semanas,2)} kg
          por semana: más del 1 % de tu peso corporal cada semana. Por encima de ese umbral sostenido sube
          claramente la proporción de músculo que se pierde junto con la grasa, y con ella caen la fuerza y
          el rendimiento. El plan usa un ritmo seguro de <b class="verde">${U.n(n.ritmo,2)} kg por semana</b>,
          con el que llegarías a tu peso objetivo en <b>${n.semanasNecesarias} semanas</b>
          (${U.n(n.semanasNecesarias/4.345,1)} meses).
          <br><br>Es la misma meta: lo que cambia es el calendario, no el destino. Puedes seguir con el plan
          tal cual y extenderlo unas semanas al final, que es lo más sensato, o apretar el déficit a sabiendas
          de que sacrificas músculo por velocidad.`
    };
  }
};
