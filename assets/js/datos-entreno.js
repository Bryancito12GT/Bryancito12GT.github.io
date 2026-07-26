/* ============================================================
   datos-entreno.js
   Programa de fuerza + cardio para 17 semanas (4 meses) con
   equipo de casa: 2 mancuernas de 15 kg, barra de 15–20 kg,
   discos de plástico, silla y suelo.
   ============================================================ */

/* ---------- 1. Periodización: 17 semanas, 4 bloques, 3 descargas ---------- */
const BLOQUES = {
  base:   {nombre:'Base técnica',    color:'#4CC5F5', rir:'3–2', desc:'Aprender el patrón, subir volumen con control. Tempo 3-1-1 en casi todo.'},
  inten:  {nombre:'Intensificación', color:'#2BE08A', rir:'2–1', desc:'Series más cerca del fallo. Entran myo-reps y rest-pause en aislamientos.'},
  densi:  {nombre:'Densidad',        color:'#FFB13D', rir:'1–0', desc:'Mismo trabajo en menos tiempo: superseries, descansos cortos, dropsets mecánicos.'},
  pico:   {nombre:'Pico y definición',color:'#FF6B6B',rir:'1–0', desc:'Se sostiene la carga, baja el volumen accesorio. Prioridad: no perder fuerza.'},
  descarga:{nombre:'Descarga',       color:'#6C868F', rir:'4–3', desc:'Mitad de series, mismo peso, nada al fallo. Sirve para que el cuerpo asimile.'}
};

let SEMANAS = [
  {n:1,  bloque:'base'},  {n:2,  bloque:'base'},  {n:3,  bloque:'base'},  {n:4,  bloque:'base'},
  {n:5,  bloque:'descarga'},
  {n:6,  bloque:'inten'}, {n:7,  bloque:'inten'}, {n:8,  bloque:'inten'}, {n:9,  bloque:'inten'},
  {n:10, bloque:'descarga'},
  {n:11, bloque:'densi'}, {n:12, bloque:'densi'}, {n:13, bloque:'densi'}, {n:14, bloque:'densi'},
  {n:15, bloque:'descarga'},
  {n:16, bloque:'pico'},  {n:17, bloque:'pico'}
];

/* ---------- 2. Plan de carrera semana a semana (km por sesión) ---------- */
/* tipo: suave = conversar sin ahogarse (Z2) · tempo = cómodo-duro
   int = intervalos · largo = ritmo suave y constante                */
let CARDIO = [
  {n:1,  mar:[3,'suave'], jue:[3,'suave'], sab:[4,'suave'], dom:[5,'largo']},
  {n:2,  mar:[3.5,'suave'], jue:[3.5,'suave'], sab:[4.5,'suave'], dom:[6,'largo']},
  {n:3,  mar:[4,'suave'], jue:[4,'suave'], sab:[5,'suave'], dom:[7,'largo']},
  {n:4,  mar:[4,'suave'], jue:[4,'tempo'], sab:[5,'suave'], dom:[8,'largo']},
  {n:5,  mar:[3,'suave'], jue:[3,'suave'], sab:[4,'suave'], dom:[5,'largo']},
  {n:6,  mar:[5,'suave'], jue:[5,'tempo'], sab:[5,'suave'], dom:[9,'largo']},
  {n:7,  mar:[5,'suave'], jue:[5,'tempo'], sab:[5,'suave'], dom:[10,'largo']},
  {n:8,  mar:[5,'suave'], jue:[5,'int'],   sab:[6,'suave'], dom:[10,'largo']},
  {n:9,  mar:[5,'suave'], jue:[5,'int'],   sab:[6,'suave'], dom:[11,'largo']},
  {n:10, mar:[4,'suave'], jue:[4,'suave'], sab:[5,'suave'], dom:[7,'largo']},
  {n:11, mar:[6,'suave'], jue:[5,'int'],   sab:[6,'tempo'], dom:[11,'largo']},
  {n:12, mar:[6,'suave'], jue:[5,'int'],   sab:[6,'tempo'], dom:[12,'largo']},
  {n:13, mar:[7,'suave'], jue:[5,'int'],   sab:[6,'tempo'], dom:[12,'largo']},
  {n:14, mar:[7,'suave'], jue:[5,'int'],   sab:[7,'tempo'], dom:[13,'largo']},
  {n:15, mar:[5,'suave'], jue:[4,'suave'], sab:[5,'suave'], dom:[8,'largo']},
  {n:16, mar:[7,'suave'], jue:[6,'int'],   sab:[7,'tempo'], dom:[14,'largo']},
  {n:17, mar:[7,'suave'], jue:[6,'int'],   sab:[7,'tempo'], dom:[14,'largo']}
];

const TIPOS_CARDIO = {
  suave:{etq:'Suave',     color:'#4CC5F5', desc:'Ritmo en el que podrías hablar en frases completas. Aquí se quema grasa sin destrozar la recuperación.'},
  tempo:{etq:'Tempo',     color:'#2BE08A', desc:'Cómodo-duro: hablas en frases cortas. 15–25 min del total a este ritmo, el resto suave.'},
  int:  {etq:'Intervalos',color:'#FFB13D', desc:'Tras 10 min suaves: 8–10 × 1 min fuerte / 2 min trote suave. Termina con 10 min suaves.'},
  largo:{etq:'Largo',     color:'#4CC5F5', desc:'La sesión más importante de la semana para el gasto calórico. Ritmo suave de principio a fin.'}
};

/* ---------- 3. Base de ejercicios ---------- */
/* patron  -> ilustración animada (svg-ejercicios.js)
   series/reps/descanso/rir/tempo -> prescripción del bloque BASE
   avance   -> cómo hacerlo más difícil sin más kilos                */
const EJERCICIOS = {

  /* ===== LUNES · TORSO EMPUJE ===== */
  flexiones:{
    nombre:'Flexiones con progresión', patron:'flexion',
    principales:['Pectoral mayor','Tríceps'], secundarios:['Deltoides anterior','Core','Serrato'],
    series:4, reps:'8–15', descanso:'90 s', rir:2, tempo:'3-1-1',
    tecnica:['Manos a la altura del pecho, un poco más anchas que los hombros.',
      'Cuerpo en línea recta: glúteo apretado y costillas hacia abajo.',
      'Baja en 3 s hasta que el pecho quede a un puño del suelo.',
      'Codos a unos 45° del torso, no abiertos en T.'],
    errores:['Cadera hundida o levantada (se pierde la tensión del pecho).',
      'Bajar solo la cabeza y no el pecho.',
      'Rebotar abajo en vez de controlar.'],
    tips:['Si haces más de 15 repeticiones limpias, pasa a la variante siguiente en vez de sumar repeticiones.',
      'Poner una mochila con discos sobre la espalda alta es la forma más simple de añadir carga.'],
    avance:'Rodillas → normales → pies elevados en la silla → arqueras → un brazo asistido. Dentro de cada variante, sube de 8 a 15 repeticiones antes de cambiar.'
  },
  press_piso:{
    nombre:'Press de pecho en el suelo (mancuernas)', patron:'empujeHorizontal',
    principales:['Pectoral mayor'], secundarios:['Tríceps','Deltoides anterior'],
    series:4, reps:'8–12', descanso:'2 min', rir:2, tempo:'3-0-1',
    tecnica:['Tumbado, rodillas dobladas, pies en el suelo.',
      'Escápulas juntas y hundidas contra el piso.',
      'Baja hasta que el tríceps toque el suelo, pausa breve y empuja.',
      'Muñecas alineadas con el antebrazo.'],
    errores:['Rebotar los codos contra el suelo.','Sacar el pecho arqueando la zona lumbar.',
      'Juntar las mancuernas arriba perdiendo tensión.'],
    tips:['El suelo limita el recorrido y protege el hombro: es la mejor versión de press cuando no hay banco.',
      'Con 15 kg por mano y 12 repeticiones fáciles, cambia a tempo 5-2-1 o a press a una mano.'],
    avance:'Tempo 3-0-1 → 4-1-1 → pausa de 2 s en el suelo → press alterno → press a una mano (más exigencia de core).'
  },
  press_militar:{
    nombre:'Press militar de pie con barra', patron:'empujeVertical',
    principales:['Deltoides anterior','Deltoides medio'], secundarios:['Tríceps','Trapecio','Core'],
    series:4, reps:'6–10', descanso:'2 min', rir:2, tempo:'2-0-1',
    tecnica:['Barra apoyada en la parte alta del pecho, codos ligeramente por delante.',
      'Aprieta glúteo y abdomen antes de empujar.',
      'Empuja hacia arriba y lleva la cabeza un poco adelante al pasar la barra.',
      'Arriba: brazos extendidos, barra sobre la mitad del pie.'],
    errores:['Arquear mucho la lumbar (se convierte en press inclinado).',
      'Empujar hacia adelante en vez de hacia arriba.',
      'Rebotar con las piernas: eso ya es push press.'],
    tips:['Si la barra se queda corta de peso, hazlo a una mano con mancuerna: la carga relativa se duplica.',
      'Es el mejor ejercicio para medir progreso de fuerza en tren superior con poco equipo.'],
    avance:'Barra a dos manos → press con mancuernas → press a una mano de pie → press con pausa de 2 s a la altura de la frente.'
  },
  fondos_silla:{
    nombre:'Fondos entre sillas', patron:'fondo',
    principales:['Tríceps'], secundarios:['Pectoral inferior','Deltoides anterior'],
    series:3, reps:'8–15', descanso:'90 s', rir:2, tempo:'3-1-1',
    tecnica:['Manos en el borde de la silla, dedos hacia adelante.',
      'Hombros lejos de las orejas durante todo el recorrido.',
      'Baja hasta unos 90° de codo, no más.',
      'Piernas estiradas al frente para más dificultad.'],
    errores:['Bajar demasiado y forzar la cápsula del hombro.',
      'Encoger los hombros al subir.','Rebotar abajo.'],
    tips:['Añade peso poniendo un disco o mochila sobre los muslos.',
      'Si el hombro molesta, cámbialo por extensiones de tríceps.'],
    avance:'Piernas dobladas → piernas estiradas → pies elevados en otra silla → con disco en el regazo.'
  },
  aperturas_suelo:{
    nombre:'Aperturas en el suelo', patron:'empujeHorizontal',
    principales:['Pectoral mayor'], secundarios:['Deltoides anterior'],
    series:3, reps:'12–15', descanso:'75 s', rir:1, tempo:'4-1-1',
    tecnica:['Codos ligeramente doblados y fijos: el ángulo no cambia.',
      'Abre en arco amplio hasta que el brazo toque el suelo.',
      'Sube apretando el pecho, sin chocar las mancuernas arriba.'],
    errores:['Convertirlo en press doblando los codos.','Usar demasiado peso y perder el arco.'],
    tips:['Ejercicio de estiramiento bajo carga: la zona baja del recorrido es la que más estimula.',
      'Ideal para myo-reps al final de la sesión.'],
    avance:'Sube repeticiones a 20 → tempo 4-1-1 → pausa de 2 s abajo → myo-reps (una serie fuerte + 3-4 miniseries de 5).'
  },
  elevaciones_laterales:{
    nombre:'Elevaciones laterales', patron:'elevacionLateral',
    principales:['Deltoides medio'], secundarios:['Trapecio superior','Supraespinoso'],
    series:3, reps:'12–20', descanso:'60 s', rir:0, tempo:'2-1-2',
    tecnica:['Torso ligeramente inclinado hacia adelante.',
      'Sube guiando con el codo hasta la altura del hombro.',
      'Baja en 2 s sin soltar la tensión abajo.'],
    errores:['Balancear el cuerpo para subir el peso.','Subir por encima del hombro encogiendo el trapecio.',
      'Dejar caer las mancuernas.'],
    tips:['Aquí 15 kg sobran: usa 5–8 kg y busca la quemazón.',
      'Es el ejercicio que más cambia la forma del torso en fotos: hombros anchos = cintura más estrecha.'],
    avance:'Myo-reps: serie de 15 al fallo, 15 s de descanso, 5 repeticiones, repetir 4 veces. Después, dropset mecánico: laterales → laterales parciales.'
  },
  extension_triceps:{
    nombre:'Extensión de tríceps sobre la cabeza', patron:'tricepsSobreCabeza',
    principales:['Tríceps (cabeza larga)'], secundarios:['Core'],
    series:3, reps:'10–15', descanso:'75 s', rir:1, tempo:'3-1-1',
    tecnica:['Una mancuerna con las dos manos o una por mano.',
      'Codos apuntando al frente y quietos, pegados a la cabeza.',
      'Baja hasta sentir estiramiento detrás del brazo, sin dolor de codo.'],
    errores:['Abrir los codos hacia los lados.','Mover el hombro en vez del codo.','Arquear la lumbar.'],
    tips:['Hazlo sentado con la espalda apoyada para no compensar con la lumbar.',
      'La cabeza larga del tríceps solo se estira en esta posición: no la reemplaces por fondos.'],
    avance:'Dos manos → una mano → tempo 4-1-1 → rest-pause (fallo, 15 s, seguir, 15 s, seguir).'
  },
  plancha_lastrada:{
    nombre:'Plancha con carga', patron:'plancha',
    principales:['Recto abdominal','Transverso'], secundarios:['Glúteo','Deltoides','Serrato'],
    series:3, reps:'30–60 s', descanso:'60 s', rir:'—', tempo:'isométrico',
    tecnica:['Codos bajo los hombros, antebrazos paralelos.',
      'Cadera a la altura de los hombros.',
      'Aprieta glúteo y abdomen como si fueras a recibir un golpe.',
      'Respira sin soltar la tensión.'],
    errores:['Cadera arriba (descansa la espalda, no trabaja el abdomen).',
      'Aguantar la respiración.','Sostener más de 60 s sin carga: deja de ser estímulo útil.'],
    tips:['Si pasas de 60 s, ponte un disco en la espalda alta en vez de alargar el tiempo.',
      'Alterna con plancha lateral para trabajar los oblicuos.'],
    avance:'Plancha 30 s → 60 s → con disco → apoyo de 3 puntos → plancha con desplazamiento lateral.'
  },

  /* ===== MIÉRCOLES · PIERNA (CUÁDRICEPS) ===== */
  sentadilla_goblet:{
    nombre:'Sentadilla goblet', patron:'sentadilla',
    principales:['Cuádriceps','Glúteo mayor'], secundarios:['Aductores','Core','Espalda alta'],
    series:4, reps:'10–15', descanso:'2 min', rir:2, tempo:'3-1-1',
    tecnica:['Mancuerna pegada al pecho, codos dentro de las rodillas.',
      'Pies al ancho de los hombros, puntas ligeramente afuera.',
      'Baja en 3 s hasta que el muslo pase la paralela, si la movilidad lo permite.',
      'Rodillas siguiendo la línea de los pies, talones siempre en el suelo.'],
    errores:['Rodillas hacia adentro al subir.','Levantar los talones.','Perder la curva neutra de la espalda abajo.'],
    tips:['Con 15 kg esto se vuelve fácil rápido: la salida es el tempo y las pausas, no más peso.',
      'Una pausa de 3 s en el fondo multiplica la dificultad sin tocar la carga.'],
    avance:'Tempo 3-1-1 → pausa de 3 s abajo → talones elevados sobre discos (más recorrido de cuádriceps) → sentadilla a una pierna asistida.'
  },
  bulgara:{
    nombre:'Sentadilla búlgara', patron:'zancada',
    principales:['Cuádriceps','Glúteo mayor'], secundarios:['Isquiotibiales','Aductores','Core'],
    series:4, reps:'8–12 por pierna', descanso:'90 s por lado', rir:2, tempo:'3-0-1',
    tecnica:['Pie trasero sobre la silla, empeine apoyado.',
      'Pie delantero lo bastante adelante para que la rodilla no pase mucho la punta.',
      'Baja recto hasta que la rodilla trasera casi toque el suelo.',
      'Sube empujando con el talón delantero.'],
    errores:['Zancada demasiado corta (todo el peso en la rodilla).','Inclinarse a un lado.','Rebotar la rodilla en el suelo.'],
    tips:['El ejercicio unilateral más rentable con poco peso: 15 kg por mano equivalen a una sentadilla mucho más pesada.',
      'Torso vertical = cuádriceps. Torso inclinado adelante = glúteo.'],
    avance:'Sin peso → una mancuerna → dos mancuernas → tempo 4-0-1 → 1½ repeticiones (baja, sube a medio, baja, sube completo).'
  },
  zancadas:{
    nombre:'Zancadas caminando o estáticas', patron:'zancada',
    principales:['Cuádriceps','Glúteo mayor'], secundarios:['Isquiotibiales','Core'],
    series:3, reps:'10–12 por pierna', descanso:'90 s', rir:2, tempo:'2-0-1',
    tecnica:['Paso largo, torso erguido.','Baja vertical, no hacia adelante.',
      'Rodilla trasera a 2 cm del suelo.','Empuja con el talón de la pierna delantera.'],
    errores:['Paso corto que carga la rodilla.','Dejar caer la rodilla trasera de golpe.'],
    tips:['Si tienes espacio corto, hazlas estáticas o en retroceso: la versión hacia atrás cuida más la rodilla.'],
    avance:'Peso corporal → mancuernas → zancada con déficit (pie delantero sobre disco) → zancada con salto (solo si no hay molestia de rodilla).'
  },
  sissy:{
    nombre:'Sentadilla sissy asistida', patron:'sentadilla',
    principales:['Cuádriceps (recto femoral)'], secundarios:['Core'],
    series:3, reps:'8–12', descanso:'90 s', rir:1, tempo:'4-1-1',
    tecnica:['Agárrate de una puerta o silla con una mano.',
      'Rodillas van hacia adelante mientras la cadera queda extendida.',
      'Cuerpo en línea recta desde la rodilla hasta el hombro.',
      'Baja lento hasta donde controles.'],
    errores:['Doblar la cadera (se convierte en sentadilla normal).','Bajar más de lo que la rodilla tolera.'],
    tips:['Es lo más parecido a una extensión de cuádriceps sin máquina.',
      'Empieza con recorrido corto: la rodilla necesita semanas para adaptarse.'],
    avance:'Recorrido corto y muy asistido → recorrido completo → menos ayuda de la mano → con disco en el pecho.'
  },
  step_up:{
    nombre:'Subida a la silla (step-up)', patron:'zancada',
    principales:['Cuádriceps','Glúteo mayor'], secundarios:['Gemelo','Core'],
    series:3, reps:'10–12 por pierna', descanso:'75 s', rir:2, tempo:'2-0-2',
    tecnica:['Silla firme a la altura de la rodilla.',
      'Todo el pie sobre la silla, empuja con el talón.',
      'Sube sin impulso del pie de abajo.',
      'Baja en 2 s controlando, no te dejes caer.'],
    errores:['Rebotar con la pierna de abajo.','Silla demasiado alta al principio.','Bajar de golpe.'],
    tips:['La fase de bajada lenta es la que más músculo construye aquí.'],
    avance:'Silla baja → silla a la altura de la rodilla → con mancuernas → bajada a una pierna en 4 s.'
  },
  sentadilla_pared:{
    nombre:'Isometría en la pared', patron:'sentadilla',
    principales:['Cuádriceps'], secundarios:['Glúteo','Core'],
    series:3, reps:'45–75 s', descanso:'75 s', rir:'—', tempo:'isométrico',
    tecnica:['Espalda pegada a la pared, rodillas a 90°.','Peso en los talones.','Respira, no aguantes el aire.'],
    errores:['Apoyar las manos en los muslos.','Subir la cadera cuando quema.'],
    tips:['Excelente cierre de sesión: mucho estímulo metabólico y cero impacto en articulaciones.',
      'Sostén un disco en el pecho cuando pases de 75 s.'],
    avance:'45 s → 75 s → con disco → a una pierna.'
  },
  gemelo_una_pierna:{
    nombre:'Elevación de talón a una pierna', patron:'gemelo',
    principales:['Gemelos','Sóleo'], secundarios:['Tibial posterior'],
    series:4, reps:'12–20', descanso:'60 s', rir:0, tempo:'2-1-3',
    tecnica:['Punta del pie sobre un escalón o disco, talón colgando.',
      'Sube lo más alto posible, pausa 1 s.',
      'Baja en 3 s buscando el estiramiento completo.'],
    errores:['Rebotar aprovechando el tendón.','Recorrido corto.'],
    tips:['Los gemelos aguantan mucho volumen: es de los pocos músculos donde 20+ repeticiones rinden.',
      'Trabajarlos protege de lesiones al aumentar los kilómetros de trote.'],
    avance:'Dos piernas → una pierna → con mancuerna → pausa de 2 s arriba y 2 s abajo.'
  },
  elevacion_piernas:{
    nombre:'Elevación de piernas', patron:'abdomen',
    principales:['Recto abdominal (zona baja)'], secundarios:['Flexores de cadera','Oblicuos'],
    series:3, reps:'12–20', descanso:'60 s', rir:1, tempo:'2-0-3',
    tecnica:['Zona lumbar pegada al suelo todo el tiempo.',
      'Sube las piernas y despega ligeramente la cadera al final.',
      'Baja en 3 s hasta donde la lumbar siga pegada.'],
    errores:['Despegar la lumbar (trabaja el psoas, no el abdomen).','Usar impulso.'],
    tips:['Si la lumbar se despega, dobla las rodillas y acorta el recorrido.'],
    avance:'Rodillas dobladas → piernas semiestiradas → piernas rectas → con disco entre los pies.'
  },

  /* ===== VIERNES · TORSO TRACCIÓN ===== */
  remo_barra:{
    nombre:'Remo con barra', patron:'remo',
    principales:['Dorsal ancho','Romboides','Trapecio medio'], secundarios:['Bíceps','Deltoides posterior','Erectores'],
    series:4, reps:'8–12', descanso:'2 min', rir:2, tempo:'2-1-2',
    tecnica:['Cadera atrás, torso a unos 45°, espalda neutra.',
      'Barra pegada al cuerpo, jala hacia el ombligo.',
      'Aprieta 1 s arriba juntando los omóplatos.',
      'Baja en 2 s hasta extensión completa del brazo.'],
    errores:['Subir el torso con cada repetición.','Jalar con los brazos y no con la espalda.',
      'Redondear la lumbar.'],
    tips:['Piensa "llevo los codos al bolsillo trasero".',
      'Si la barra pesa poco, hazlo a una mano o con pausa de 2 s arriba.'],
    avance:'Remo normal → pausa de 2 s en contracción → remo Pendlay (desde el suelo cada repetición) → remo a una mano con mancuerna.'
  },
  remo_unilateral:{
    nombre:'Remo a una mano con mancuerna', patron:'remo',
    principales:['Dorsal ancho'], secundarios:['Romboides','Bíceps','Core antirrotación'],
    series:4, reps:'10–12 por lado', descanso:'75 s por lado', rir:2, tempo:'2-1-3',
    tecnica:['Una mano y una rodilla en la silla, espalda plana.',
      'Deja que el hombro se estire abajo, luego jala.',
      'Codo pegado al costado, sube hacia la cadera.',
      'Baja en 3 s con estiramiento completo.'],
    errores:['Girar el torso para levantar más peso.','Encoger el hombro.','Recorrido corto.'],
    tips:['Con 15 kg y bajada de 3 s, esto sigue siendo duro incluso en el mes 4.',
      'Deja el lado débil primero e iguala repeticiones con el fuerte.'],
    avance:'Tempo 2-1-3 → pausa de 2 s arriba → 1½ repeticiones → rest-pause en la última serie.'
  },
  remo_invertido:{
    nombre:'Remo invertido bajo la mesa (o dominadas)', patron:'traccionVertical',
    principales:['Dorsal ancho','Trapecio medio'], secundarios:['Bíceps','Core'],
    series:4, reps:'6–12', descanso:'2 min', rir:1, tempo:'2-1-2',
    tecnica:['Barra fija o borde de una mesa firme, cuerpo recto.',
      'Cuanto más horizontal el cuerpo, más difícil.',
      'Lleva el pecho a la barra, no la barbilla.',
      'Glúteo apretado: el cuerpo es una tabla.'],
    errores:['Cadera hundida.','Recorrido a medias.','Encoger los hombros al jalar.'],
    tips:['Si tienes barra de dominadas, sustitúyelo por dominadas negativas de 5 s.',
      'Es el ejercicio de tracción vertical más valioso cuando no hay poleas.'],
    avance:'Pies en el suelo doblados → pies estirados → pies elevados en la silla → con mochila cargada → a una mano asistido.'
  },
  pullover:{
    nombre:'Pull-over con mancuerna', patron:'empujeHorizontal',
    principales:['Dorsal ancho'], secundarios:['Pectoral','Tríceps (cabeza larga)','Serrato'],
    series:3, reps:'12–15', descanso:'75 s', rir:1, tempo:'3-1-2',
    tecnica:['Tumbado, mancuerna sostenida con las dos manos sobre el pecho.',
      'Codos levemente doblados y fijos.',
      'Lleva la mancuerna atrás hasta sentir el estiramiento en el costado.',
      'Vuelve sin pasar de la vertical para no perder tensión.'],
    errores:['Arquear mucho la lumbar.','Doblar los codos y convertirlo en extensión de tríceps.'],
    tips:['Trabaja el dorsal en estiramiento máximo, algo que el remo no da.',
      'Respira profundo abajo: también moviliza la caja torácica.'],
    avance:'Recorrido corto → completo → tempo 4-1-2 → pausa de 2 s en el estiramiento.'
  },
  pajaros:{
    nombre:'Pájaros / face pull con mancuernas', patron:'elevacionLateral',
    principales:['Deltoides posterior'], secundarios:['Trapecio medio','Romboides','Manguito rotador'],
    series:3, reps:'15–20', descanso:'60 s', rir:0, tempo:'2-1-2',
    tecnica:['Torso inclinado casi paralelo al suelo.',
      'Abre los brazos en arco, codos ligeramente doblados.',
      'Aprieta 1 s arriba, baja en 2 s.'],
    errores:['Usar impulso del torso.','Peso excesivo que convierte el gesto en remo.'],
    tips:['Peso ligero, 4–6 kg bastan.','Compensa las horas de postura adelantada y protege el hombro en los press.'],
    avance:'Sube a 20–25 repeticiones → pausa de 2 s arriba → myo-reps.'
  },
  curl_barra:{
    nombre:'Curl de bíceps con barra', patron:'curl',
    principales:['Bíceps braquial'], secundarios:['Braquial','Antebrazo'],
    series:3, reps:'8–12', descanso:'75 s', rir:1, tempo:'2-1-3',
    tecnica:['Codos pegados al costado y quietos.',
      'Sube sin balancear la espalda.',
      'Aprieta 1 s arriba y baja en 3 s.'],
    errores:['Balancear el cuerpo.','Mover los codos hacia adelante.','Soltar la bajada.'],
    tips:['La bajada lenta es la mitad del estímulo: no la desperdicies.',
      'Dropset mecánico: al fallar, pasa a curl martillo y sigue.'],
    avance:'Tempo 2-1-3 → dropset mecánico (barra → martillo) → rest-pause → 21s (7 parciales bajos, 7 altos, 7 completos).'
  },
  curl_martillo:{
    nombre:'Curl martillo', patron:'curl',
    principales:['Braquial','Braquiorradial'], secundarios:['Bíceps'],
    series:3, reps:'10–15', descanso:'60 s', rir:0, tempo:'2-0-3',
    tecnica:['Palmas enfrentadas todo el recorrido.','Codo fijo.','Baja en 3 s.'],
    errores:['Girar la muñeca.','Balancear.'],
    tips:['El braquial está debajo del bíceps: desarrollarlo hace el brazo visiblemente más grueso.'],
    avance:'Alterno → simultáneo → myo-reps → curl martillo en isometría (sostener 30 s a 90°) al final.'
  },
  paseo_granjero:{
    nombre:'Paseo del granjero + encogimientos', patron:'movilidad',
    principales:['Trapecio','Antebrazo (agarre)'], secundarios:['Core','Glúteo medio'],
    series:3, reps:'40–60 s', descanso:'75 s', rir:'—', tempo:'continuo',
    tecnica:['Una mancuerna en cada mano, hombros atrás.',
      'Camina con pasos cortos y torso erguido.',
      'Puedes añadir 10 encogimientos al final de cada recorrido.'],
    errores:['Encorvar la espalda.','Mirar al suelo.'],
    tips:['Mejora agarre, postura y gasto calórico a la vez.','Perfecto como finalizador de la sesión de tracción.'],
    avance:'40 s → 60 s → mismo tiempo con menos descanso → a una mano (trabaja oblicuos).'
  },

  /* ===== SÁBADO · CADENA POSTERIOR ===== */
  peso_muerto_rumano:{
    nombre:'Peso muerto rumano con barra', patron:'bisagra',
    principales:['Isquiotibiales','Glúteo mayor'], secundarios:['Erectores espinales','Trapecio','Agarre'],
    series:4, reps:'10–12', descanso:'2 min', rir:2, tempo:'3-1-1',
    tecnica:['Rodillas ligeramente dobladas y fijas.',
      'Lleva la cadera atrás como si cerraras una puerta con el glúteo.',
      'Barra rozando la pierna todo el recorrido.',
      'Baja hasta sentir el estiramiento del isquiotibial, no más.'],
    errores:['Convertirlo en sentadilla doblando las rodillas.','Redondear la espalda baja.',
      'Separar la barra del cuerpo.'],
    tips:['Con poco peso, la pausa de 2 s en el estiramiento es lo que lo vuelve duro.',
      'Es el ejercicio que más protege la rodilla y el isquio al correr.'],
    avance:'Dos piernas → pausa de 2 s abajo → déficit (de pie sobre discos) → a una pierna con mancuernas.'
  },
  hip_thrust:{
    nombre:'Hip thrust con apoyo en la silla', patron:'puente',
    principales:['Glúteo mayor'], secundarios:['Isquiotibiales','Core'],
    series:4, reps:'12–15', descanso:'90 s', rir:1, tempo:'2-2-2',
    tecnica:['Omóplatos apoyados en el borde de la silla.',
      'Barra o mancuerna sobre la cadera, con una toalla doblada.',
      'Empuja con los talones hasta alinear rodilla-cadera-hombro.',
      'Aprieta el glúteo 2 s arriba sin arquear la lumbar.'],
    errores:['Hiperextender la espalda arriba en vez de extender la cadera.',
      'Pies demasiado cerca (trabaja el cuádriceps).','Recorrido corto.'],
    tips:['La pausa de 2 s arriba vale más que 10 kg extra.',
      'Mete la barbilla al pecho: ayuda a no arquear la lumbar.'],
    avance:'Puente en el suelo → hip thrust en silla → con barra → a una pierna → con pausa de 3 s.'
  },
  curl_nordico:{
    nombre:'Curl nórdico asistido', patron:'bisagra',
    principales:['Isquiotibiales'], secundarios:['Glúteo','Core'],
    series:3, reps:'5–8', descanso:'2 min', rir:1, tempo:'5-0-x',
    tecnica:['Rodillas sobre una toalla, tobillos fijos bajo un mueble.',
      'Cuerpo recto de rodilla a hombro.',
      'Baja lo más lento posible, frenando con el isquiotibial.',
      'Amortigua con las manos y empújate para volver.'],
    errores:['Doblar la cadera al bajar.','Dejarse caer sin frenar.'],
    tips:['Reduce mucho el riesgo de desgarro de isquiotibial al correr: evidencia sólida.',
      'Empieza con recorrido cortísimo. La agujeta del primer día es normal.'],
    avance:'Recorrido de 20° → 45° → 70° → completo → completo sin empujar con las manos.'
  },
  buenos_dias:{
    nombre:'Buenos días con barra', patron:'bisagra',
    principales:['Isquiotibiales','Erectores espinales'], secundarios:['Glúteo'],
    series:3, reps:'12–15', descanso:'90 s', rir:2, tempo:'3-1-1',
    tecnica:['Barra sobre los trapecios, no sobre el cuello.',
      'Bisagra de cadera con espalda neutra.',
      'Baja hasta unos 45° de torso.'],
    errores:['Redondear la espalda.','Bajar con las rodillas rígidas del todo.'],
    tips:['Complemento perfecto del rumano: mismo patrón, distinta carga sobre la espalda.'],
    avance:'Sin peso → barra → pausa de 2 s abajo → con más discos.'
  },
  bulgara_gluteo:{
    nombre:'Búlgara con torso inclinado', patron:'zancada',
    principales:['Glúteo mayor'], secundarios:['Isquiotibiales','Cuádriceps'],
    series:3, reps:'10–12 por pierna', descanso:'90 s', rir:1, tempo:'3-1-1',
    tecnica:['Igual que la búlgara, pero inclinando el torso unos 30° adelante.',
      'Paso más largo.','Empuja con el talón y siente el glúteo, no el cuádriceps.'],
    errores:['Perder la neutralidad de la espalda al inclinarse.','Paso corto.'],
    tips:['La inclinación del torso cambia el músculo protagonista sin cambiar el ejercicio.'],
    avance:'Sin peso → mancuernas → pausa de 2 s abajo → 1½ repeticiones.'
  },
  puente_una_pierna:{
    nombre:'Puente de glúteo a una pierna', patron:'puente',
    principales:['Glúteo mayor'], secundarios:['Isquiotibiales','Core'],
    series:3, reps:'12–15 por lado', descanso:'60 s', rir:1, tempo:'2-2-2',
    tecnica:['Un pie en el suelo, la otra pierna estirada o con rodilla al pecho.',
      'Sube hasta alinear cadera y rodilla.','Pausa de 2 s arriba.'],
    errores:['Rotar la cadera hacia el lado libre.','Empujar con la punta del pie.'],
    tips:['Corrige desequilibrios entre lados, muy útil si un lado molesta al correr.'],
    avance:'Peso corporal → con disco en la cadera → pie elevado en la silla → pausa de 3 s.'
  },
  gemelo_sentado:{
    nombre:'Elevación de talón sentado', patron:'gemelo',
    principales:['Sóleo'], secundarios:['Gemelos'],
    series:4, reps:'15–20', descanso:'60 s', rir:0, tempo:'2-1-3',
    tecnica:['Sentado, mancuernas sobre las rodillas, punta del pie sobre un disco.',
      'Sube al máximo, pausa 1 s, baja en 3 s.'],
    errores:['Rebotar.','Recorrido corto.'],
    tips:['La versión sentada aísla el sóleo, clave para resistir kilómetros de trote.'],
    avance:'Dos piernas → una pierna → más discos → pausa de 2 s arriba y abajo.'
  },
  antirrotacion:{
    nombre:'Dead bug y plancha lateral', patron:'plancha',
    principales:['Transverso','Oblicuos'], secundarios:['Glúteo medio','Recto abdominal'],
    series:3, reps:'10 por lado / 30–45 s', descanso:'60 s', rir:'—', tempo:'controlado',
    tecnica:['Dead bug: lumbar pegada al suelo, extiende brazo y pierna contrarios lento.',
      'Plancha lateral: codo bajo el hombro, cadera alta, cuerpo en línea.'],
    errores:['Despegar la lumbar en el dead bug.','Dejar caer la cadera en la lateral.'],
    tips:['El core que sirve para correr y levantar es el que resiste el movimiento, no el que hace abdominales rápidos.'],
    avance:'Dead bug → con disco en las manos → plancha lateral 30 s → 45 s → con elevación de pierna.'
  },

  /* ===== ACCESORIOS DE DÍAS DE CARDIO ===== */
  circuito_core:{
    nombre:'Circuito de core (15 min)', patron:'plancha',
    principales:['Core completo'], secundarios:['Glúteo','Espalda baja'],
    series:3, reps:'circuito', descanso:'60 s entre vueltas', rir:2, tempo:'controlado',
    tecnica:['3 vueltas de: plancha 40 s · dead bug 10 por lado · plancha lateral 30 s por lado · puente de glúteo 15.',
      'Sin descanso entre ejercicios, 60 s entre vueltas.'],
    errores:['Ir tan rápido que se pierde la técnica.','Aguantar la respiración.'],
    tips:['Va después de correr, cuando el cuerpo ya está caliente.','Si vas muy cansado, haz 2 vueltas y ya.'],
    avance:'2 vueltas → 3 vueltas → mismos tiempos con 45 s de descanso → añadir disco a la plancha.'
  },
  bombeo_espalda:{
    nombre:'Bombeo de espalda y hombro', patron:'remo',
    principales:['Dorsal','Deltoides posterior'], secundarios:['Bíceps','Trapecio'],
    series:3, reps:'15–20', descanso:'45 s', rir:3, tempo:'2-0-2',
    tecnica:['Superserie: remo a una mano 15 + pájaros 20, sin descanso entre ellos.',
      'Peso ligero: esto no es una sesión dura, es recuperación activa con sangre.'],
    errores:['Llevarlo al fallo (interfiere con la sesión del viernes).'],
    tips:['Deja siempre 3 repeticiones en la recámara. El objetivo es recuperación, no destrucción.'],
    avance:'2 superseries → 3 → subir repeticiones antes que peso.'
  },
  movilidad_domingo:{
    nombre:'Movilidad y respiración (20 min)', patron:'movilidad',
    principales:['Cadera','Tobillo','Columna torácica'], secundarios:['Isquiotibiales','Pectoral'],
    series:1, reps:'20 min', descanso:'—', rir:'—', tempo:'lento',
    tecnica:['Estiramiento de flexor de cadera 45 s por lado.',
      'Isquiotibiales sentado 45 s por lado.',
      'Movilidad de tobillo contra la pared 20 por lado.',
      'Apertura torácica tumbado de lado 10 por lado.',
      '5 min de respiración lenta: 4 s inspirar, 6 s espirar.'],
    errores:['Estirar en frío justo después de sentarte todo el día sin caminar antes.','Rebotar.'],
    tips:['Es la sesión que hace posible sostener 17 semanas sin lesionarte.',
      'La respiración lenta baja el pulso y mejora el sueño de la noche del domingo.'],
    avance:'20 min semanales fijos. Si aparece rigidez en algún punto, súbelo a 2 sesiones por semana.'
  }
};

/* ---------- 4. Semana tipo: los 7 días ---------- */
const DIAS_DEFECTO = [
  {id:1, corto:'Lun', nombre:'Lunes', titulo:'Fuerza · Torso empuje',
   tipo:'fuerza', duracion:'55–65 min',
   musculos:'Pecho · Hombro · Tríceps · Core',
   calentamiento:'5 min: círculos de brazos, 10 flexiones fáciles, 10 rotaciones de hombro con la barra vacía, 15 sentadillas al aire.',
   ejercicios:['flexiones','press_piso','press_militar','fondos_silla','aperturas_suelo','elevaciones_laterales','extension_triceps','plancha_lastrada'],
   notas:'Superserie opcional en bloques 3 y 4: aperturas + elevaciones laterales seguidas, 45 s de descanso.'},

  {id:2, corto:'Mar', nombre:'Martes', titulo:'Cardio suave + core',
   tipo:'cardio', duracion:'35–50 min',
   musculos:'Sistema cardiovascular · Core',
   calentamiento:'5 min caminando rápido antes de arrancar a trotar.',
   ejercicios:['circuito_core'],
   notas:'El core va después de correr. Si las piernas están muy cargadas del lunes, corre más lento: el ritmo es lo de menos.'},

  {id:3, corto:'Mié', nombre:'Miércoles', titulo:'Fuerza · Pierna (cuádriceps)',
   tipo:'fuerza', duracion:'55–65 min',
   musculos:'Cuádriceps · Glúteo · Gemelo · Abdomen',
   calentamiento:'5 min: 20 sentadillas al aire, 10 zancadas por pierna, 15 elevaciones de talón, movilidad de tobillo.',
   ejercicios:['sentadilla_goblet','bulgara','zancadas','sissy','step_up','sentadilla_pared','gemelo_una_pierna','elevacion_piernas'],
   notas:'Día exigente. Si el domingo hiciste tirada larga, empieza con menos peso en la primera serie y sube.'},

  {id:4, corto:'Jue', nombre:'Jueves', titulo:'Cardio + bombeo ligero',
   tipo:'cardio', duracion:'40–55 min',
   musculos:'Cardiovascular · Espalda · Hombro posterior',
   calentamiento:'5 min caminando + movilidad de cadera.',
   ejercicios:['bombeo_espalda'],
   notas:'Nada al fallo hoy. Mañana toca tracción pesada y necesitas la espalda fresca.'},

  {id:5, corto:'Vie', nombre:'Viernes', titulo:'Fuerza · Torso tracción',
   tipo:'fuerza', duracion:'55–65 min',
   musculos:'Espalda · Bíceps · Hombro posterior · Agarre',
   calentamiento:'5 min: 15 remos con barra vacía, 10 pájaros ligeros, colgarse 20 s si hay barra.',
   ejercicios:['remo_barra','remo_unilateral','remo_invertido','pullover','pajaros','curl_barra','curl_martillo','paseo_granjero'],
   notas:'La espalda tolera mucho volumen. Es el día donde más se nota el cambio de postura y de forma del torso.'},

  {id:6, corto:'Sáb', nombre:'Sábado', titulo:'Cardio + cadena posterior',
   tipo:'mixto', duracion:'75–85 min',
   musculos:'Isquiotibiales · Glúteo · Sóleo · Core',
   calentamiento:'Corre primero. Antes de la fuerza: 10 puentes de glúteo y 10 bisagras sin peso.',
   ejercicios:['peso_muerto_rumano','hip_thrust','curl_nordico','buenos_dias','bulgara_gluteo','puente_una_pierna','gemelo_sentado','antirrotacion'],
   notas:'Corre primero y descansa 15–20 min antes de la fuerza. Si vas muy justo de tiempo, prioriza rumano, hip thrust y nórdico.'},

  {id:7, corto:'Dom', nombre:'Domingo', titulo:'Tirada larga + movilidad',
   tipo:'cardio', duracion:'60–100 min',
   musculos:'Cardiovascular · Movilidad general',
   calentamiento:'10 min de trote muy suave: la tirada larga empieza lenta siempre.',
   ejercicios:['movilidad_domingo'],
   notas:'La sesión con más gasto calórico de la semana. Lleva agua si pasas de 60 min y come algo con carbohidrato antes.'}
];

/* La semana tipo activa la decide plan.js según el objetivo */
let DIAS = DIAS_DEFECTO;

/* ---------- 5. Técnicas de intensidad y en qué bloque entran ---------- */
const TECNICAS = [
  {n:'Sobrecarga progresiva', b:'Todos', d:'Cada semana algo tiene que subir: una repetición más, 1 s más de pausa, 5 s menos de descanso o algo de peso. Regístralo o no existe.'},
  {n:'Tempo controlado', b:'Base', d:'3-1-1 significa 3 s bajando, 1 s de pausa, 1 s subiendo. Con poco peso, alargar la bajada es la palanca más potente que tienes.'},
  {n:'Series cercanas al fallo', b:'Intensificación', d:'RIR 1–2 en básicos, RIR 0 en aislamientos. Con cargas ligeras el estímulo solo llega cerca del fallo: es obligatorio, no opcional.'},
  {n:'Myo-reps', b:'Intensificación', d:'Una serie de activación hasta RIR 0-1, 15 s de descanso, 4–5 repeticiones, repetir 3–4 veces. Ideal para laterales, curl y aperturas.'},
  {n:'Rest-pause', b:'Intensificación', d:'Llegas al fallo, descansas 15–20 s y sigues hasta fallar otra vez. Dos o tres tandas. Úsalo en la última serie de un aislamiento.'},
  {n:'Dropset mecánico', b:'Densidad', d:'Al fallar, cambia a una versión más fácil del mismo movimiento (curl barra → martillo, flexión con pies elevados → normal) y sigue.'},
  {n:'Superseries', b:'Densidad', d:'Dos ejercicios seguidos sin descanso. Usa músculos opuestos (empuje/tracción) para no perder rendimiento.'},
  {n:'Isometrías', b:'Todos', d:'Pausas de 2–3 s en el punto más difícil o sostenidos de 30–60 s. Cero equipo extra, mucho estímulo, poco desgaste articular.'},
  {n:'Unilateral', b:'Todos', d:'Con 15 kg por mano, una pierna o un brazo reciben el doble de carga relativa. Es la solución central a la falta de peso.'},
  {n:'Variantes más difíciles', b:'Todos', d:'Cuando un ejercicio se vuelve fácil, no sumes repeticiones sin fin: cambia a la variante siguiente de la escalera de progresión.'}
];

/* ---------- 6. Reglas de progresión por bloque ---------- */
const REGLAS_BLOQUE = {
  base:  ['Series indicadas, extremo bajo del rango de repeticiones.','RIR 3–2: te sobran 2 o 3 repeticiones.','Tempo 3-1-1 en todos los básicos.','Descansos completos.','Objetivo: técnica impecable y tolerancia al volumen.'],
  inten: ['Mismas series, extremo alto del rango.','RIR 2–1 en básicos, RIR 0 en el último aislamiento.','Entran myo-reps y rest-pause.','Objetivo: acercarse al fallo con control.'],
  densi: ['Reduce descansos 15–20 s respecto al bloque anterior.','Dos superseries por sesión.','Un dropset mecánico por grupo muscular.','Objetivo: más trabajo en menos tiempo, alto gasto calórico.'],
  pico:  ['Baja una serie en los accesorios, mantén las de los básicos.','Sostén la carga: en déficit calórico, conservar fuerza ya es ganar.','Cero fallo en básicos, RIR 1.','Objetivo: llegar al final fuerte y sin lesiones.'],
  descarga:['La mitad de las series de cada ejercicio.','Mismo peso, RIR 4–3, nunca al fallo.','Cardio reducido un 30 %.','No la saltes: es donde el cuerpo asimila lo hecho y se reparan los tejidos.']
};

/* ---------- 7. Frases ---------- */
const FRASES = [
  {t:'La sesión que no quieres hacer es exactamente la que te separa de quien eras hace tres meses.', a:'Recordatorio del lunes'},
  {t:'La báscula mide una foto. El espejo, la ropa y la barra miden la película.', a:'Sobre el progreso'},
  {t:'Sin registro no hay sobrecarga progresiva. Anota la serie o no ocurrió.', a:'Regla de oro'},
  {t:'Comer bien seis días y arruinarlo el séptimo no es un desliz: es el 15 % de tu semana.', a:'Aritmética honesta'},
  {t:'Correr más despacio de lo que quisieras hoy es lo que te deja correr mañana.', a:'Sobre el cardio suave'},
  {t:'Con 15 kg y cinco segundos de bajada tienes más estímulo que con 40 kg y prisa.', a:'Entrenar en casa'},
  {t:'La adherencia le gana al plan perfecto. Siempre.', a:'Lo único que de verdad importa'},
  {t:'Dormir seis horas te quita la mitad de la grasa que perderías durmiendo ocho, con el mismo déficit.', a:'Sueño y composición corporal'},
  {t:'Los primeros dos kilos son agua. Los siguientes doce son tuyos.', a:'Semana 2'},
  {t:'Una descarga no es perder una semana. Es asegurar las dieciséis restantes.', a:'Semana de descarga'},
  {t:'El hambre de un déficit bien hecho es incómoda, no insoportable. Si es insoportable, el déficit está mal.', a:'Ajuste de rumbo'},
  {t:'Nadie ve las sesiones. Todos ven el resultado.', a:'Mes 3'},
  {t:'Terminar la semana al 80 % dieciséis veces gana a terminarla al 100 % cuatro veces y abandonar.', a:'Constancia'},
  {t:'El músculo que conservas hoy es el metabolismo que tendrás en enero.', a:'Por qué la proteína'}
];
