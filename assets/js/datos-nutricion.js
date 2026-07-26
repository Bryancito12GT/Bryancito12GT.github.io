/* ============================================================
   datos-nutricion.js
   Mercado mensual (Ara / D1), plan de comidas y suplementos.
   Los precios son estimaciones de referencia en pesos colombianos:
   se pueden editar dentro de la app porque cambian por ciudad y mes.
   ============================================================ */

/* ---------- 1. Lista de mercado mensual ---------- */
/* prot = gramos de proteína que aporta TODA la cantidad comprada
   kcal = calorías totales de esa cantidad                        */
const MERCADO_BAJO = [
  {id:'huevos', prod:'Huevos AA (panal × 30)', cat:'Proteína', cant:'3 panales (90 und)',
   precio:52500, prot:567, kcal:6480, dur:'Todo el mes · 3 al día',
   nota:'La proteína más versátil y barata que no requiere refrigeración estricta. Come la yema: ahí está casi todo el micronutriente.'},

  {id:'pollo', prod:'Pechuga de pollo', cat:'Proteína', cant:'3 kg',
   precio:47700, prot:690, kcal:3300, dur:'3–4 almuerzos por semana',
   nota:'Congela en porciones de 150–180 g el mismo día que la compras. Es la mejor relación proteína/calorías de la lista.'},

  {id:'soya', prod:'Carne de soya texturizada', cat:'Proteína', cant:'1,5 kg',
   precio:16500, prot:750, kcal:5700, dur:'Todo el mes',
   nota:'La proteína más barata del mercado colombiano: cerca de 20 COP por gramo de proteína. Hidrátala 10 min en agua caliente con caldo y ajo.'},

  {id:'lentejas', prod:'Lentejas', cat:'Proteína', cant:'2 kg',
   precio:18000, prot:480, kcal:7060, dur:'Todo el mes',
   nota:'Proteína + 16 g de fibra por plato. Cocina 1 kg de golpe y congela en porciones.'},

  {id:'atun', prod:'Atún en agua', cat:'Proteína', cant:'3 latas',
   precio:11400, prot:72, kcal:330, dur:'Cenas rápidas',
   nota:'Caro por gramo de proteína, pero resuelve una cena en 4 minutos. Cómpralo en agua, no en aceite.'},

  {id:'leche', prod:'Leche entera en bolsa', cat:'Proteína', cant:'5 L',
   precio:19500, prot:160, kcal:3200, dur:'Todo el mes',
   nota:'Si te cae pesada, cámbiala por leche deslactosada. Aporta calcio y proteína de alta calidad.'},

  {id:'avena', prod:'Avena en hojuelas', cat:'Carbohidrato', cant:'2 kg',
   precio:11000, prot:260, kcal:7780, dur:'Todo el mes',
   nota:'Carbohidrato lento + 10 g de fibra por 100 g. Base de los tres desayunos.'},

  {id:'arroz', prod:'Arroz', cat:'Carbohidrato', cant:'2 kg',
   precio:7800, prot:140, kcal:7200, dur:'Todo el mes',
   nota:'Barato y fácil de digerir antes de correr. Es la palanca para subir calorías si bajas de peso demasiado rápido.'},

  {id:'tuberculos', prod:'Papa, yuca y plátano', cat:'Carbohidrato', cant:'4 kg',
   precio:12000, prot:70, kcal:4000, dur:'Todo el mes',
   nota:'La papa cocida y enfriada es de los alimentos que más saciedad dan por caloría.'},

  {id:'verduras', prod:'Verduras (zanahoria, cebolla, tomate, repollo, brócoli)', cat:'Verdura', cant:'~6 kg surtidos',
   precio:18000, prot:35, kcal:1100, dur:'Compra fresca cada semana',
   nota:'Volumen y fibra por muy pocas calorías: el arma principal contra el hambre en déficit. Media bandeja en cada plato.'},

  {id:'aceite', prod:'Aceite de girasol', cat:'Grasa', cant:'1 L',
   precio:8000, prot:0, kcal:8800, dur:'Todo el mes',
   nota:'Mídelo con cuchara. Una cucharada suelta son 120 kcal que nadie ve pero la báscula sí.'},

  {id:'linaza', prod:'Linaza molida', cat:'Grasa · fibra', cant:'500 g',
   precio:7000, prot:90, kcal:2670, dur:'2 meses',
   nota:'Cómprala molida o muélela: entera pasa sin digerirse. Guárdala en frasco cerrado y en la nevera.'},

  {id:'chia', prod:'Chía', cat:'Grasa · fibra', cant:'200 g',
   precio:6500, prot:33, kcal:970, dur:'2 meses',
   nota:'1 cucharada en el desayuno. Absorbe agua y aumenta la saciedad; no hace nada mágico más allá de eso.'},

  {id:'cafe', prod:'Café molido', cat:'Otros', cant:'250 g',
   precio:4500, prot:0, kcal:0, dur:'Todo el mes',
   nota:'Una taza 40 min antes de entrenar mejora el rendimiento y baja la percepción de esfuerzo.'},

  {id:'condimentos', prod:'Sal, ajo, comino, panela, vinagre', cat:'Otros', cant:'Surtido',
   precio:6000, prot:0, kcal:400, dur:'2 meses',
   nota:'Comida sosa = plan abandonado. El condimento no tiene calorías relevantes y sostiene la adherencia.'}
];

/* La lista activa la decide datos-mercado.js según el presupuesto */
let MERCADO = MERCADO_BAJO;

/* ---------- 2. Realidad del presupuesto ---------- */
let NOTA_PRESUPUESTO = {
  titulo:'Lo que 250.000 COP alcanzan de verdad',
  texto:`Esta lista suma unos 246.000 COP y rinde cerca de <b>1.950 kcal y 110–120 g de proteína al día</b>.
  Ese es el techo honesto con este presupuesto: la proteína concentrada es lo más caro del supermercado.
  Lo óptimo para no perder músculo serían 1,6–2,2 g por kg (135–180 g diarios).
  Tres formas de cerrar la brecha, en orden de rentabilidad:
  <br><br>
  <b>1.</b> Carne de soya texturizada: ~20 COP por gramo de proteína. 500 g más al mes (5.500 COP) suman ~8 g diarios.<br>
  <b>2.</b> Un panal más de huevos (17.500 COP) suma ~19 g diarios.<br>
  <b>3.</b> 1 kg más de pechuga (15.900 COP) suma ~23 g diarios.<br><br>
  Con 30.000 COP adicionales al mes llegas a 140–150 g diarios, que ya es rango óptimo.
  Si no es posible, entrena igual de duro: con 110–120 g y trabajo de fuerza cerca del fallo
  se conserva la mayor parte del músculo, solo con menos margen de error.`
};

/* ---------- 3. Plan de comidas ---------- */
const RECETAS_BASE = [
  /* ===== DESAYUNOS ===== */
  {id:'d1', tipo:'Desayuno', nombre:'Avena cocida con huevo y banano', tiempo:'12 min',
   ing:[['Avena en hojuelas','60 g'],['Leche','200 ml'],['Banano','1 mediano'],['Linaza molida','1 cda (10 g)'],['Huevos','2'],['Canela y pizca de sal','al gusto']],
   prep:['Cocina la avena con la leche y un chorrito de agua a fuego medio, 5 minutos, revolviendo.',
     'Apaga, añade la linaza, la canela y el banano en rodajas.',
     'Aparte, haz los huevos revueltos o cocidos en la misma olla enjuagada, sin aceite o con unas gotas.',
     'Come los huevos junto con la avena: la mezcla de proteína y fibra sostiene la saciedad hasta el almuerzo.'],
   kcal:665, p:30, c:78, g:26, f:12,
   nota:'Desayuno para los días de fuerza. Si entrenas en la mañana, cómelo 60–90 min antes.'},

  {id:'d2', tipo:'Desayuno', nombre:'Tortilla de tres huevos con avena salada', tiempo:'10 min',
   ing:[['Huevos','3'],['Tomate','1 mediano'],['Cebolla','1/4'],['Avena en hojuelas','40 g'],['Leche','150 ml'],['Aceite','1 cdta (5 ml)'],['Sal y comino','al gusto']],
   prep:['Sofríe la cebolla y el tomate picados con la cucharadita de aceite.',
     'Bate los huevos con sal, viértelos y cocina a fuego bajo tapado 4 minutos.',
     'Aparte, cocina la avena con la leche 4 minutos.',
     'Sirve la tortilla y la avena juntas.'],
   kcal:540, p:30, c:40, g:28, f:6,
   nota:'El más bajo en calorías de los tres. Úsalo los días de descanso o de cardio corto.'},

  {id:'d3', tipo:'Desayuno', nombre:'Batido de avena y chía + huevos cocidos', tiempo:'6 min',
   ing:[['Avena en hojuelas','50 g'],['Leche','300 ml'],['Banano','1 mediano'],['Chía','1 cda (10 g)'],['Huevos cocidos','2'],['Panela raspada','1 cdta (opcional)']],
   prep:['Deja la chía en 3 cucharadas de agua 5 minutos mientras hierves los huevos.',
     'Licúa la avena, la leche, el banano y la chía hidratada.',
     'Toma el batido con los dos huevos cocidos aparte.',
     'Si lo dejas listo la noche anterior en la nevera, espesa y queda más saciante.'],
   kcal:685, p:32, c:79, g:27, f:11,
   nota:'El desayuno del domingo: se digiere fácil antes de la tirada larga.'},

  /* ===== ALMUERZOS ===== */
  {id:'a1', tipo:'Almuerzo', nombre:'Pollo a la plancha con arroz y lentejas', tiempo:'25 min',
   ing:[['Pechuga de pollo','180 g'],['Arroz cocido','150 g (≈50 g crudo)'],['Lentejas cocidas','200 g'],['Ensalada (tomate, cebolla, repollo)','1 plato'],['Aceite','1 cdta'],['Ajo, comino, sal','al gusto']],
   prep:['Adoba el pollo con ajo, comino, sal y limón 10 minutos.',
     'Plancha a fuego medio-alto 4–5 minutos por lado, sin aceite extra.',
     'Sirve con el arroz y las lentejas que ya tienes cocidos y congelados.',
     'Ensalada abundante con la cucharadita de aceite y vinagre.'],
   kcal:700, p:65, c:88, g:11, f:19,
   nota:'El plato estrella del plan: 65 g de proteína y 19 g de fibra. Repítelo 3–4 veces por semana.'},

  {id:'a2', tipo:'Almuerzo', nombre:'Lentejas guisadas con carne de soya', tiempo:'30 min',
   ing:[['Lentejas secas','80 g'],['Carne de soya texturizada','40 g'],['Arroz cocido','150 g'],['Cebolla, tomate, zanahoria','200 g'],['Aceite','2 cdtas'],['Ajo, comino, laurel','al gusto']],
   prep:['Hidrata la soya 10 minutos en agua caliente con ajo y sal; escúrrela apretando bien.',
     'Sofríe la cebolla, el tomate y la zanahoria; añade la soya y dora 3 minutos.',
     'Agrega las lentejas ya cocidas con su caldo y cocina 10 minutos más.',
     'Sirve con arroz.'],
   kcal:757, p:44, c:110, g:14, f:25,
   nota:'El almuerzo más barato del plan: cuesta menos de 3.000 COP y aporta 25 g de fibra.'},

  {id:'a3', tipo:'Almuerzo', nombre:'Arroz con pollo y verduras en una olla', tiempo:'30 min',
   ing:[['Pechuga de pollo','150 g'],['Arroz seco','60 g'],['Zanahoria, arveja, cebolla','200 g'],['Aceite','2 cdtas'],['Ajo, color, sal','al gusto']],
   prep:['Dora el pollo en cubos con el aceite y el ajo.',
     'Añade las verduras picadas y sofríe 3 minutos.',
     'Agrega el arroz, el color y 150 ml de agua; tapa y cocina 18 minutos a fuego bajo.',
     'Reposa 5 minutos antes de servir.'],
   kcal:540, p:42, c:61, g:14, f:6,
   nota:'Una sola olla, se lleva en tarro y calienta bien al día siguiente.'},

  /* ===== CENAS ===== */
  {id:'c1', tipo:'Cena', nombre:'Tortilla de atún con verduras salteadas', tiempo:'12 min',
   ing:[['Atún en agua','1 lata'],['Huevos','2'],['Repollo y zanahoria','150 g'],['Cebolla','1/4'],['Aceite','1 cdta'],['Sal, pimienta, limón','al gusto']],
   prep:['Saltea el repollo y la zanahoria en juliana con la cucharadita de aceite, 4 minutos.',
     'Mezcla el atún escurrido con los huevos batidos y sal.',
     'Vierte sobre las verduras y cocina tapado 5 minutos a fuego bajo.',
     'Termina con limón.'],
   kcal:350, p:39, c:11, g:16, f:4,
   nota:'Cena de los días de fuerza: mucha proteína, pocas calorías, se hace en lo que se calienta la sartén.'},

  {id:'c2', tipo:'Cena', nombre:'Sopa de lentejas con pollo desmechado', tiempo:'20 min (con lentejas listas)',
   ing:[['Lentejas secas','60 g'],['Pechuga de pollo','120 g'],['Zanahoria, cebolla, cilantro','200 g'],['Aceite','1 cdta'],['Ajo y comino','al gusto']],
   prep:['Cocina el pollo en agua con ajo y sal 15 minutos; desmecha y guarda el caldo.',
     'Sofríe la cebolla y la zanahoria, añade el caldo y las lentejas cocidas.',
     'Devuelve el pollo desmechado y hierve 5 minutos.',
     'Cilantro fresco al servir.'],
   kcal:460, p:45, c:50, g:9, f:14,
   nota:'Ideal para la noche del sábado, después de la sesión doble: reponer líquido y sodio ayuda a recuperar.'},

  {id:'c3', tipo:'Cena', nombre:'Salteado de pollo con repollo y papa', tiempo:'20 min',
   ing:[['Pechuga de pollo','150 g'],['Papa cocida','200 g'],['Repollo y zanahoria','200 g'],['Aceite','1½ cdtas'],['Ajo, soya o vinagre, pimienta','al gusto']],
   prep:['Cuece las papas con cáscara y déjalas enfriar (mejora la saciedad y baja el índice glucémico).',
     'Dora el pollo en tiras a fuego alto 5 minutos.',
     'Añade las verduras y saltea 4 minutos: deben quedar crocantes.',
     'Incorpora la papa en cubos, ajo y pimienta, 2 minutos más.'],
   kcal:450, p:41, c:47, g:12, f:8,
   nota:'La cena para los domingos con tirada larga: repone glucógeno para arrancar bien el lunes.'}
];

/* El recetario activo lo decide datos-mercado.js */
let RECETAS = RECETAS_BASE;

/* ---------- 4. Suplementos ---------- */
const SUPLEMENTOS = [
  {n:'Creatina monohidratada', v:'Sí, la primera de la lista', nivel:'alto',
   costo:'55.000–75.000 COP por 300–500 g (dura 2–4 meses)',
   dosis:'3–5 g diarios, a cualquier hora, todos los días incluidos los de descanso. No hace falta fase de carga.',
   ev:'Es el suplemento deportivo con más respaldo científico que existe: decenas de ensayos controlados muestran mejoras de fuerza y de masa magra, y hay evidencia de que ayuda a conservar músculo en déficit calórico. Busca solo "monohidrato", sin mezclas ni sabores.',
   contra:'El aumento inicial de 1–2 kg es agua dentro del músculo, no grasa. Aparecerá en la báscula la primera semana: no te asustes.'},

  {n:'Cafeína (café)', v:'Sí, y ya la tienes en la lista', nivel:'alto',
   costo:'4.500 COP por 250 g',
   dosis:'3–6 mg por kg de peso, 40–60 minutos antes de entrenar. Para 85 kg: una a dos tazas cargadas.',
   ev:'Mejora el rendimiento de fuerza y de resistencia y reduce la percepción de esfuerzo, con evidencia muy consistente. Su efecto "quemagrasa" directo es pequeño y no es la razón para tomarla.',
   contra:'Evítala después de las 4 p. m.: el sueño vale más para tu resultado que cualquier suplemento.'},

  {n:'Avena', v:'Sí, pero como alimento, no como suplemento', nivel:'alto',
   costo:'11.000 COP por 2 kg',
   dosis:'40–80 g al día en el desayuno.',
   ev:'Carbohidrato de digestión lenta con beta-glucanos, la fibra soluble que se asocia a mejor perfil de colesterol y mayor saciedad. Es la base más barata y estable de tus desayunos.',
   contra:'No tiene ningún efecto adelgazante por sí misma. Adelgaza el déficit, no el alimento.'},

  {n:'Linaza molida', v:'Sí, por fibra y grasa buena', nivel:'medio',
   costo:'7.000 COP por 500 g (dura 2 meses)',
   dosis:'1–2 cucharadas al día (10–20 g).',
   ev:'Aporta fibra soluble y ALA, el omega-3 vegetal. Ayuda a llegar a los 30–35 g de fibra diarios, cosa difícil en déficit. La conversión de ALA a EPA/DHA en el cuerpo es baja, así que no reemplaza al pescado.',
   contra:'Entera pasa sin digerir: cómprala molida y guárdala tapada en la nevera para que no se ponga rancia.'},

  {n:'Chía', v:'Opcional, hace casi lo mismo que la linaza', nivel:'medio',
   costo:'6.500 COP por 200 g',
   dosis:'1 cucharada (10 g) al día.',
   ev:'Fibra soluble que gelifica y aumenta la saciedad, más algo de ALA y calcio. La evidencia de efectos sobre la pérdida de grasa por sí sola es débil: su valor es el volumen y la textura que aporta.',
   contra:'Si el presupuesto aprieta, quítala antes que la linaza: cuesta más por gramo de fibra.'},

  {n:'Multivitamínico', v:'Solo como seguro barato', nivel:'bajo',
   costo:'15.000–25.000 COP al mes',
   dosis:'Uno al día con una comida, si decides tomarlo.',
   ev:'En una dieta variada no aporta beneficio demostrado sobre rendimiento ni composición corporal. En un déficit prolongado con presupuesto limitado, sirve como red de seguridad frente a carencias. Si vas a gastar en un solo micronutriente, la vitamina D suele ser la más útil cuando hay poca exposición al sol.',
   contra:'Un multivitamínico no compensa comer mal. Prioriza siempre verduras y huevos antes que la pastilla.'},

  {n:'Proteína en polvo', v:'Útil, pero nunca es lo primero', nivel:'bajo',
   costo:'90.000–140.000 COP por kg',
   dosis:'—',
   ev:'Funciona, pero no hace nada que la comida no haga. En Colombia el gramo de proteína del whey suele costar más que el del huevo, el pollo o la soya texturizada. Con presupuesto ajustado, ese dinero rinde mucho más en comida real; con presupuesto holgado, es una forma cómoda de cubrir los huecos de los días sin tiempo.',
   contra:'Nunca es lo primero de la lista. Si no llegas a la proteína diaria, el problema suele ser de planificación o de dinero, y el polvo solo resuelve el primero.'}
];

/* ---------- 5. Reglas de alimentación del plan ---------- */
const REGLAS_COMIDA = [
  {t:'La proteína es intocable', d:'Es lo único que se mantiene fijo todos los días. Si un día vas corto de calorías, recorta grasa o carbohidrato, nunca proteína.'},
  {t:'Verdura en dos comidas', d:'Medio plato de verdura en el almuerzo y en la cena. Es el mejor recurso contra el hambre: mucho volumen por muy pocas calorías.'},
  {t:'Carbohidrato alrededor del entrenamiento', d:'Concentra el arroz, la papa y el plátano en la comida anterior y posterior a entrenar. Rinden más ahí que a media tarde.'},
  {t:'Mide el aceite', d:'Con cuchara, siempre. Es el error más común: tres chorros al ojo son 300 kcal invisibles que borran el déficit del día.'},
  {t:'Cocina por lotes', d:'Domingo: 1 kg de lentejas, 1 kg de arroz y todo el pollo en porciones. El plan no se rompe por falta de voluntad, se rompe por llegar con hambre sin nada listo.'},
  {t:'Una comida libre por semana, planeada', d:'Escógela (por ejemplo, el almuerzo del domingo) y disfrútala sin culpa. Lo que arruina el proceso no es una comida, es el fin de semana entero improvisado.'},
  {t:'Agua antes que café a media tarde', d:'Buena parte del hambre de las 4 p. m. es sed o aburrimiento. Un vaso grande de agua y 10 minutos antes de decidir.'}
];
