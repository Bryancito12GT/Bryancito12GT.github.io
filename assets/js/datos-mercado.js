/* ============================================================
   datos-mercado.js
   Tres listas de mercado y un banco de recetas que se filtran
   según el presupuesto mensual y el objetivo del usuario.
   Precios de referencia en pesos colombianos, editables en la app.
   ============================================================ */

/* ---------- Mercado de presupuesto medio ---------- */
const MERCADO_MEDIO = [
  {id:'m_huevos', prod:'Huevos AA (panal × 30)', cat:'Proteína', cant:'4 panales (120 und)',
   precio:70000, prot:756, kcal:8640, dur:'Todo el mes · 4 al día',
   nota:'Sigue siendo la proteína más versátil por peso. Con más presupuesto no hay razón para bajar de 3–4 diarios.'},
  {id:'m_pollo', prod:'Pechuga de pollo', cat:'Proteína', cant:'5 kg',
   precio:79500, prot:1150, kcal:5500, dur:'5 comidas por semana',
   nota:'Congélala porcionada y adobada el mismo día de la compra.'},
  {id:'m_res', prod:'Carne de res magra (posta o muchacho)', cat:'Proteína', cant:'2 kg',
   precio:56000, prot:420, kcal:4400, dur:'2 comidas por semana',
   nota:'Aporta hierro hemo, zinc y creatina natural, cosa que el pollo da en menor cantidad. Vale la rotación.'},
  {id:'m_yogur', prod:'Yogur griego natural sin azúcar', cat:'Proteína', cant:'2 kg',
   precio:36000, prot:200, kcal:1200, dur:'Todo el mes',
   nota:'Revisa la etiqueta: muchos "griegos" del supermercado llevan azúcar y casi la misma proteína que un yogur normal.'},
  {id:'m_queso', prod:'Queso bajo en grasa', cat:'Proteína', cant:'1 kg',
   precio:26000, prot:240, kcal:2500, dur:'Todo el mes',
   nota:'Sube mucho el sabor de comidas sosas por pocas calorías. Cuida la sal si tienes tensión alta.'},
  {id:'m_atun', prod:'Atún en agua', cat:'Proteína', cant:'8 latas',
   precio:30400, prot:192, kcal:880, dur:'Cenas rápidas',
   nota:'Resuelve una cena completa en cuatro minutos los días que llegas sin energía para cocinar.'},
  {id:'m_legumbres', prod:'Lentejas y fríjol', cat:'Proteína', cant:'2 kg',
   precio:19000, prot:460, kcal:7000, dur:'Todo el mes',
   nota:'No las quites al subir de presupuesto: son la principal fuente de fibra del plan.'},
  {id:'m_leche', prod:'Leche', cat:'Proteína', cant:'8 L',
   precio:31200, prot:256, kcal:5120, dur:'Todo el mes',
   nota:'Con el desayuno y en los batidos. Deslactosada si te cae pesada.'},
  {id:'m_avena', prod:'Avena en hojuelas', cat:'Carbohidrato', cant:'2 kg',
   precio:11000, prot:260, kcal:7780, dur:'Todo el mes',
   nota:'Base de los desayunos y del batido de después de entrenar.'},
  {id:'m_arroz', prod:'Arroz', cat:'Carbohidrato', cant:'3 kg',
   precio:11700, prot:210, kcal:10800, dur:'Todo el mes',
   nota:'Fácil de digerir antes de entrenar y la palanca más barata para subir o bajar calorías.'},
  {id:'m_tuberculos', prod:'Papa, yuca y plátano', cat:'Carbohidrato', cant:'5 kg',
   precio:15000, prot:90, kcal:5000, dur:'Todo el mes',
   nota:'La papa cocida y enfriada está entre los alimentos que más sacian por caloría.'},
  {id:'m_verduras', prod:'Verduras variadas', cat:'Verdura', cant:'~8 kg surtidos',
   precio:32000, prot:50, kcal:1600, dur:'Compra fresca semanal',
   nota:'Medio plato en almuerzo y cena. Es lo que hace que un déficit se aguante sin pasar hambre.'},
  {id:'m_frutas', prod:'Frutas variadas', cat:'Fruta', cant:'~6 kg',
   precio:30000, prot:30, kcal:3000, dur:'Compra fresca semanal',
   nota:'Banano antes de entrenar, cítricos y papaya el resto del día. Fruta entera, no en jugo.'},
  {id:'m_secos', prod:'Frutos secos (maní o almendras)', cat:'Grasa', cant:'500 g',
   precio:22000, prot:110, kcal:2900, dur:'Todo el mes',
   nota:'Pésalos: un puñado generoso son 200 kcal. Buenísimos como snack, peligrosos comiendo del paquete.'},
  {id:'m_aceites', prod:'Aceite de oliva 500 ml + girasol 1 L', cat:'Grasa', cant:'1,5 L',
   precio:28000, prot:0, kcal:12800, dur:'Todo el mes',
   nota:'Oliva en crudo para ensaladas, girasol para la sartén. Siempre medido con cuchara.'},
  {id:'m_semillas', prod:'Linaza y chía', cat:'Grasa · fibra', cant:'700 g',
   precio:13000, prot:120, kcal:3500, dur:'2 meses',
   nota:'Una cucharada al día en el desayuno para llegar a los 30–35 g de fibra.'},
  {id:'m_varios', prod:'Café, condimentos y vinagres', cat:'Otros', cant:'Surtido',
   precio:15000, prot:0, kcal:400, dur:'Todo el mes',
   nota:'La comida sosa se abandona en tres semanas. Condimentar bien es estrategia, no capricho.'}
];

/* ---------- Mercado de presupuesto alto ---------- */
const MERCADO_ALTO = [
  {id:'a_pollo', prod:'Pechuga de pollo', cat:'Proteína', cant:'5 kg',
   precio:79500, prot:1150, kcal:5500, dur:'4–5 comidas por semana',
   nota:'Sigue siendo la base: ninguna proteína cara la supera en relación proteína/calorías.'},
  {id:'a_res', prod:'Res magra (lomo o punta de anca)', cat:'Proteína', cant:'3 kg',
   precio:105000, prot:630, kcal:6600, dur:'3 comidas por semana',
   nota:'Hierro, zinc, creatina y B12 en cantidades que el pollo no da. Dos o tres veces por semana basta.'},
  {id:'a_salmon', prod:'Salmón', cat:'Proteína', cant:'1,5 kg',
   precio:105000, prot:300, kcal:3100, dur:'2 comidas por semana',
   nota:'La única fuente de la lista con EPA y DHA de verdad. Dos raciones semanales cubren el omega-3 sin cápsulas.'},
  {id:'a_camarones', prod:'Camarones', cat:'Proteína', cant:'1 kg',
   precio:55000, prot:240, kcal:990, dur:'2 cenas por semana',
   nota:'Casi pura proteína: 24 g por 100 g con menos de 100 kcal. Ideal para cenas en déficit.'},
  {id:'a_huevos', prod:'Huevos AA (panal × 30)', cat:'Proteína', cant:'4 panales',
   precio:70000, prot:756, kcal:8640, dur:'Todo el mes',
   nota:'No los quites por comprar cosas más caras: siguen siendo de lo mejor por peso y micronutriente.'},
  {id:'a_yogur', prod:'Yogur griego natural', cat:'Proteína', cant:'3 kg',
   precio:54000, prot:300, kcal:1800, dur:'Todo el mes',
   nota:'Base de desayunos y snacks. Sin azúcar añadido; endulza con fruta.'},
  {id:'a_queso', prod:'Queso bajo en grasa', cat:'Proteína', cant:'1 kg',
   precio:26000, prot:240, kcal:2500, dur:'Todo el mes', nota:'Para sumar proteína y sabor a ensaladas y revueltos.'},
  {id:'a_proteina', prod:'Proteína en polvo (opcional)', cat:'Proteína', cant:'1 kg',
   precio:110000, prot:750, kcal:4000, dur:'Todo el mes',
   nota:'Aquí sí tiene sentido: con este presupuesto no compite con la comida, la complementa cuando falta tiempo.'},
  {id:'a_cereales', prod:'Avena y arroz integral', cat:'Carbohidrato', cant:'4 kg',
   precio:26000, prot:400, kcal:14500, dur:'Todo el mes', nota:'El integral aporta fibra y sacia más; el blanco va mejor justo antes de entrenar.'},
  {id:'a_quinua', prod:'Quinua', cat:'Carbohidrato', cant:'1 kg',
   precio:22000, prot:140, kcal:3680, dur:'Todo el mes',
   nota:'Carbohidrato con perfil de aminoácidos completo. Buena, no mágica: cuesta seis veces más que el arroz.'},
  {id:'a_tuberculos', prod:'Papa, camote y plátano', cat:'Carbohidrato', cant:'5 kg',
   precio:18000, prot:90, kcal:5000, dur:'Todo el mes', nota:'El camote aporta más fibra y vitamina A que la papa por caloría similar.'},
  {id:'a_verduras', prod:'Verduras variadas', cat:'Verdura', cant:'~10 kg',
   precio:45000, prot:60, kcal:2000, dur:'Compra fresca semanal', nota:'Brócoli, espárragos, espinaca, pimentón. Cuanto más color, mejor.'},
  {id:'a_frutos_rojos', prod:'Frutos rojos y fruta variada', cat:'Fruta', cant:'~8 kg',
   precio:65000, prot:40, kcal:3500, dur:'Compra fresca semanal',
   nota:'Los congelados cuestan la mitad y conservan casi todo. Comprarlos así es de las mejores decisiones del mercado.'},
  {id:'a_aguacate', prod:'Aguacate', cat:'Grasa', cant:'3 kg',
   precio:24000, prot:60, kcal:4800, dur:'Todo el mes', nota:'Medio aguacate son unas 160 kcal. Excelente, pero se cuenta como grasa del día.'},
  {id:'a_oliva', prod:'Aceite de oliva extra virgen', cat:'Grasa', cant:'1 L',
   precio:45000, prot:0, kcal:8800, dur:'Todo el mes', nota:'En crudo, sobre el plato ya servido. Calentarlo mucho desperdicia justo lo que lo hace caro.'},
  {id:'a_secos', prod:'Almendras y nueces', cat:'Grasa', cant:'1 kg',
   precio:55000, prot:210, kcal:6000, dur:'Todo el mes', nota:'Porción de 25–30 g pesada. Las nueces son la mejor fuente vegetal de omega-3 de la lista.'},
  {id:'a_leche', prod:'Leche o bebida vegetal', cat:'Proteína', cant:'8 L',
   precio:35000, prot:256, kcal:5120, dur:'Todo el mes', nota:'Si eliges bebida vegetal, revisa que sea sin azúcar y que aporte proteína, o compénsala en otro lado.'},
  {id:'a_varios', prod:'Café de origen, especias y vinagres', cat:'Otros', cant:'Surtido',
   precio:30000, prot:0, kcal:400, dur:'Todo el mes', nota:'Aquí es donde una dieta cara deja de saber a dieta.'}
];

/* ---------- Notas por presupuesto ---------- */
const NOTAS_PRESUPUESTO = {
  bajo:{
    titulo:'Comer bien con presupuesto ajustado',
    texto:`Con un presupuesto bajo el techo real está en torno a <b>110–130 g de proteína al día</b>:
    la proteína concentrada es lo más caro del supermercado. Tres formas de estirarlo, en orden de
    rentabilidad: <b>carne de soya texturizada</b> (~22 COP por gramo de proteína), <b>lentejas</b> (~38)
    y <b>huevos</b> (~93). Con 30.000 COP más al mes se suman unos 20 g diarios de proteína.
    <br><br>Lo que no cambia con el presupuesto: la adherencia, dormir, y entrenar cerca del fallo.
    Un plan barato bien ejecutado gana por goleada a un plan caro a medias.`
  },
  medio:{
    titulo:'El punto dulce de la relación precio-resultado',
    texto:`Con presupuesto medio llegas cómodamente a <b>150 g o más de proteína al día</b> y añades lo que
    de verdad aporta: carne roja magra por el hierro y el zinc, yogur griego, frutos secos y mucha más
    fruta y verdura. Aquí ya no compras proteína, compras <b>variedad y micronutrientes</b>.
    <br><br>El error típico en este rango es gastar en suplementos de moda en vez de en comida. La creatina
    monohidratada sigue siendo el único suplemento con evidencia sólida que vale cada peso.`
  },
  alto:{
    titulo:'Optimizar sin desperdiciar dinero',
    texto:`Con presupuesto alto la nutrición deja de ser el factor limitante: <b>180 g o más de proteína</b>,
    omega-3 de pescado real, grasas de calidad y toda la fruta y verdura que quieras.
    <br><br>El riesgo aquí es otro: pagar de más por cosas que no mueven la aguja. Los frutos rojos congelados
    cuestan la mitad y valen casi lo mismo; la quinua cuesta seis veces más que el arroz por una ventaja
    marginal; y ningún alimento premium compensa saltarse sesiones. Gasta en <b>pescado graso, carne magra,
    verdura y fruta</b>, y ahorra en el resto.`
  }
};

/* ---------- Banco de recetas adicionales ---------- */
/* pres: presupuesto mínimo necesario · obj: para qué objetivo encaja mejor */
const RECETAS_EXTRA = [
  /* ===== MEDIO ===== */
  {id:'md1', tipo:'Desayuno', pres:'medio', obj:'ambos', nombre:'Yogur griego con avena, fruta y frutos secos', tiempo:'5 min',
   ing:[['Yogur griego natural','200 g'],['Avena en hojuelas','50 g'],['Fruta (banano o fresas)','150 g'],['Almendras o maní','20 g'],['Canela','al gusto']],
   prep:['Mezcla el yogur con la avena y deja reposar 5 minutos, o toda la noche en la nevera.',
     'Añade la fruta troceada y los frutos secos justo antes de comer.',
     'La canela ayuda a que no eches de menos el azúcar.'],
   kcal:560, p:33, c:62, g:20, f:9,
   nota:'Se prepara la noche anterior y se lleva en tarro. El desayuno que menos excusas admite.'},

  {id:'md2', tipo:'Desayuno', pres:'medio', obj:'ambos', nombre:'Revuelto de huevo y queso con avena y fruta', tiempo:'12 min',
   ing:[['Huevos','2'],['Claras','3'],['Queso bajo en grasa','40 g'],['Avena','40 g'],['Leche','150 ml'],['Fruta','1 pieza']],
   prep:['Cocina la avena con la leche 4 minutos.',
     'Bate los huevos con las claras y cuájalos a fuego bajo, añadiendo el queso al final.',
     'Sirve con la fruta entera aparte.'],
   kcal:520, p:45, c:42, g:20, f:6,
   nota:'45 g de proteína en el desayuno: la forma más simple de no ir corriendo detrás del objetivo por la noche.'},

  {id:'ma1', tipo:'Almuerzo', pres:'medio', obj:'ambos', nombre:'Res magra salteada con arroz y verduras', tiempo:'20 min',
   ing:[['Carne de res magra','180 g'],['Arroz cocido','150 g'],['Verduras variadas','250 g'],['Aceite de oliva','1 cda'],['Ajo, pimienta, soya','al gusto']],
   prep:['Corta la carne en tiras finas contra la fibra y sécala con papel: así dora en vez de hervir.',
     'Sartén bien caliente, carne 2 minutos por lado, retira y reserva.',
     'Saltea las verduras 4 minutos, devuelve la carne y sirve con el arroz.'],
   kcal:690, p:55, c:62, g:22, f:8,
   nota:'La carne roja magra dos veces por semana cubre el hierro y el zinc que el pollo no da.'},

  {id:'ma2', tipo:'Almuerzo', pres:'medio', obj:'ambos', nombre:'Pollo al horno con papa y ensalada grande', tiempo:'35 min',
   ing:[['Pechuga de pollo','200 g'],['Papa','250 g'],['Ensalada variada','200 g'],['Aceite de oliva','1 cda'],['Limón, ajo, orégano','al gusto']],
   prep:['Adoba el pollo y la papa en cubos con ajo, orégano y media cucharada de aceite.',
     'Horno a 200 °C, 25–30 minutos en la misma bandeja.',
     'Monta la ensalada con el resto del aceite y limón.'],
   kcal:660, p:60, c:55, g:20, f:9,
   nota:'Una sola bandeja, cero platos sucios y sale doble ración si horneas para dos días.'},

  {id:'mc1', tipo:'Cena', pres:'medio', obj:'grasa', nombre:'Bowl de atún con arroz, huevo y verduras', tiempo:'12 min',
   ing:[['Atún en agua','1 lata'],['Huevo','1'],['Arroz cocido','120 g'],['Verduras crudas y cocidas','200 g'],['Aceite de oliva','1 cdta'],['Vinagre y pimienta','al gusto']],
   prep:['Cuece el huevo 8 minutos.','Monta el bowl con el arroz de base, las verduras alrededor y el atún encima.',
     'Corona con el huevo partido, aceite y vinagre.'],
   kcal:480, p:40, c:45, g:14, f:7,
   nota:'Cena de cinco minutos con 40 g de proteína. Funciona igual de bien fría al día siguiente.'},

  {id:'mc2', tipo:'Cena', pres:'medio', obj:'ambos', nombre:'Revuelto de res con verduras y queso', tiempo:'15 min',
   ing:[['Carne de res magra','150 g'],['Verduras (pimentón, cebolla, calabacín)','250 g'],['Queso bajo en grasa','30 g'],['Aceite de oliva','1 cdta'],['Comino y ajo','al gusto']],
   prep:['Dora la carne picada a fuego alto 3 minutos.',
     'Añade las verduras en cubos y saltea 5 minutos más.',
     'Apaga, añade el queso rallado y tapa 1 minuto para que funda.'],
   kcal:430, p:45, c:14, g:20, f:6,
   nota:'Cena baja en carbohidrato para los días de descanso, cuando el combustible extra no hace falta.'},

  /* ===== ALTO ===== */
  {id:'ad1', tipo:'Desayuno', pres:'alto', obj:'ambos', nombre:'Bowl de yogur griego con frutos rojos y almendras', tiempo:'5 min',
   ing:[['Yogur griego natural','250 g'],['Frutos rojos','150 g'],['Almendras','30 g'],['Chía','1 cda'],['Avena','40 g']],
   prep:['Mezcla el yogur con la chía y la avena la noche anterior.',
     'Por la mañana añade los frutos rojos y las almendras troceadas.',
     'Si usas frutos rojos congelados, sácalos la noche anterior a la nevera.'],
   kcal:640, p:40, c:55, g:28, f:14,
   nota:'14 g de fibra y 40 g de proteína antes de las ocho de la mañana. Difícil de mejorar.'},

  {id:'ad2', tipo:'Desayuno', pres:'alto', obj:'ambos', nombre:'Huevos revueltos con aguacate y salmón', tiempo:'12 min',
   ing:[['Huevos','3'],['Salmón','80 g'],['Aguacate','1/2'],['Pan integral','1 rebanada'],['Limón y pimienta','al gusto']],
   prep:['Cuaja los huevos a fuego muy bajo, removiendo: quedan cremosos, no secos.',
     'Sirve con el salmón, el aguacate en láminas y la tostada.',
     'Limón y pimienta por encima.'],
   kcal:620, p:42, c:22, g:42, f:9,
   nota:'Alto en grasa a propósito: si desayunas así, el resto del día va con menos aceite y más carbohidrato.'},

  {id:'aa1', tipo:'Almuerzo', pres:'alto', obj:'ambos', nombre:'Salmón al horno con quinua y brócoli', tiempo:'25 min',
   ing:[['Salmón','180 g'],['Quinua cocida','150 g'],['Brócoli y espárragos','250 g'],['Aceite de oliva','1 cda'],['Limón, ajo, eneldo','al gusto']],
   prep:['Horno a 200 °C. Salmón con limón y ajo, 12–14 minutos: debe quedar jugoso por dentro.',
     'Cuece la quinua 15 minutos y el brócoli al vapor 5.',
     'Monta el plato y termina con el aceite en crudo.'],
   kcal:720, p:48, c:52, g:32, f:10,
   nota:'Dos raciones de pescado graso a la semana cubren el omega-3 mejor que cualquier cápsula.'},

  {id:'aa2', tipo:'Almuerzo', pres:'alto', obj:'musculo', nombre:'Lomo de res con camote y ensalada de aguacate', tiempo:'30 min',
   ing:[['Lomo de res','180 g'],['Camote','250 g'],['Hojas verdes','100 g'],['Aguacate','1/2'],['Aceite de oliva','1 cda'],['Sal en escamas, pimienta','al gusto']],
   prep:['Camote en cubos al horno 25 minutos a 200 °C.',
     'Sella el lomo 3 minutos por lado y déjalo reposar 5 minutos antes de cortar.',
     'Ensalada con el aguacate, aceite y limón.'],
   kcal:750, p:52, c:60, g:30, f:12,
   nota:'Plato de día de pierna: carbohidrato alto para reponer y proteína suficiente para reconstruir.'},

  {id:'ac1', tipo:'Cena', pres:'alto', obj:'grasa', nombre:'Camarones salteados con verduras y arroz integral', tiempo:'15 min',
   ing:[['Camarones','200 g'],['Arroz integral cocido','120 g'],['Verduras (pimentón, brócoli, cebolla)','250 g'],['Aceite de oliva','1 cdta'],['Ajo, jengibre, soya','al gusto']],
   prep:['Sartén muy caliente: los camarones se hacen en 3 minutos, ni uno más.',
     'Retíralos, saltea las verduras 4 minutos con ajo y jengibre.',
     'Devuelve los camarones, añade el arroz y mezcla 1 minuto.'],
   kcal:520, p:48, c:48, g:14, f:8,
   nota:'48 g de proteína por 520 kcal: de lo mejor que existe para cenar en déficit.'},

  {id:'ac2', tipo:'Cena', pres:'alto', obj:'ambos', nombre:'Ensalada tibia de pollo, aguacate y nueces', tiempo:'15 min',
   ing:[['Pechuga de pollo','180 g'],['Hojas verdes','120 g'],['Aguacate','1/2'],['Nueces','20 g'],['Aceite de oliva','1 cdta'],['Mostaza, limón','al gusto']],
   prep:['Plancha el pollo en tiras y déjalo templar 2 minutos.',
     'Monta las hojas con el aguacate y las nueces.',
     'Aliña con aceite, mostaza y limón, y coloca el pollo tibio encima.'],
   kcal:560, p:50, c:16, g:34, f:11,
   nota:'Cena ligera en carbohidrato para las noches sin entrenamiento.'},

  /* ===== SNACKS ===== */
  {id:'sb1', tipo:'Snack', pres:'bajo', obj:'ambos', nombre:'Huevos cocidos con banano', tiempo:'10 min',
   ing:[['Huevos','2'],['Banano','1']],
   prep:['Cuece los huevos 9 minutos y pásalos por agua fría.','Guárdalos pelados en la nevera para toda la semana.'],
   kcal:250, p:14, c:28, g:10, f:3,
   nota:'El snack más barato que existe con proteína real. Diez minutos el domingo resuelven la semana.'},

  {id:'sb2', tipo:'Snack', pres:'bajo', obj:'musculo', nombre:'Batido de avena, leche y maní', tiempo:'5 min',
   ing:[['Avena','60 g'],['Leche','350 ml'],['Banano','1'],['Maní','20 g'],['Panela o miel','1 cdta']],
   prep:['Licúa todo 40 segundos.','Tómalo justo después de entrenar o entre comidas.'],
   kcal:620, p:24, c:78, g:23, f:8,
   nota:'La forma más barata de sumar 600 kcal de calidad cuando comer sólido se hace cuesta arriba en volumen.'},

  {id:'sm1', tipo:'Snack', pres:'medio', obj:'ambos', nombre:'Yogur griego con frutos secos', tiempo:'2 min',
   ing:[['Yogur griego natural','170 g'],['Almendras o maní','20 g'],['Canela','al gusto']],
   prep:['Mezcla y listo. Pesa los frutos secos: comer del paquete es el error clásico.'],
   kcal:260, p:20, c:12, g:14, f:3,
   nota:'20 g de proteína en dos minutos. Perfecto a media tarde, que es cuando se rompen las dietas.'},

  {id:'sm2', tipo:'Snack', pres:'medio', obj:'ambos', nombre:'Sándwich de pollo y queso', tiempo:'6 min',
   ing:[['Pan integral','2 rebanadas'],['Pollo cocido','60 g'],['Queso bajo en grasa','40 g'],['Tomate y lechuga','al gusto']],
   prep:['Usa el pollo que ya tienes cocido del almuerzo.','Tuesta el pan y monta con tomate y lechuga.'],
   kcal:340, p:30, c:32, g:10, f:5,
   nota:'Aprovecha el pollo cocinado por lotes: cero tiempo extra de cocina.'},

  {id:'sa1', tipo:'Snack', pres:'alto', obj:'ambos', nombre:'Batido de proteína con almendras y frutos rojos', tiempo:'3 min',
   ing:[['Proteína en polvo','30 g'],['Leche','250 ml'],['Frutos rojos','100 g'],['Almendras','20 g']],
   prep:['Licúa todo con hielo.','Si lo tomas después de entrenar, añade medio banano.'],
   kcal:400, p:38, c:26, g:17, f:6,
   nota:'Con presupuesto alto el polvo sí tiene sentido: no reemplaza comida, cubre los huecos del día.'},

  {id:'sa2', tipo:'Snack', pres:'alto', obj:'ambos', nombre:'Tostada de aguacate con huevo', tiempo:'8 min',
   ing:[['Pan integral','1 rebanada'],['Aguacate','1/2'],['Huevo','1'],['Limón, sal en escamas, chile','al gusto']],
   prep:['Tuesta el pan y machaca el aguacate con limón y sal.','Huevo a la plancha o pochado encima.'],
   kcal:330, p:14, c:26, g:20, f:8,
   nota:'Saciante y con grasa de calidad. Cuidado con la porción: el aguacate entero duplica las calorías.'},

  /* ===== Plato denso para volumen (cualquier presupuesto) ===== */
  {id:'mu1', tipo:'Almuerzo', pres:'bajo', obj:'musculo', nombre:'Arroz con pollo, huevo y aceite de oliva', tiempo:'25 min',
   ing:[['Pechuga de pollo','200 g'],['Arroz seco','100 g'],['Huevos','2'],['Verduras','200 g'],['Aceite','2 cdas'],['Ajo y color','al gusto']],
   prep:['Dora el pollo en cubos con una cucharada de aceite.',
     'Añade el arroz, las verduras y 250 ml de agua; tapa 18 minutos.',
     'Cuaja los huevos aparte y sírvelos encima con el aceite restante en crudo.'],
   kcal:950, p:62, c:100, g:32, f:8,
   nota:'Plato de volumen: casi 1.000 kcal en un solo plato para los días en que el superávit cuesta trabajo.'}
];

/* ============================================================
   Presupuesto: clasifica y aplica la lista y las recetas
   ============================================================ */
const Presupuesto = {

  NIVELES:{
    bajo: {etq:'Bajo',  rango:'Hasta 350.000 COP', color:'#4CC5F5'},
    medio:{etq:'Medio', rango:'350.000 – 700.000 COP', color:'#2BE08A'},
    alto: {etq:'Alto',  rango:'Más de 700.000 COP', color:'#FFB13D'}
  },

  /* Clasifica un monto mensual en pesos colombianos */
  nivel(cop){
    const v = Number(cop) || 0;
    if(v <= 350000) return 'bajo';
    if(v <= 700000) return 'medio';
    return 'alto';
  },

  actual(){ return App.estado.perfil.presupuesto || 'bajo'; },

  /* Recetas disponibles: las de su nivel y las de niveles inferiores */
  recetas(){
    const orden = {bajo:0, medio:1, alto:2};
    const nivel = orden[Presupuesto.actual()];
    const obj = App.estado.perfil.objetivo === 'musculo' ? 'musculo' : 'grasa';
    const base = RECETAS_BASE.map(r => Object.assign({pres:'bajo', obj:'ambos'}, r));
    return base.concat(RECETAS_EXTRA)
      .filter(r => orden[r.pres] <= nivel)
      .filter(r => r.obj === 'ambos' || r.obj === obj);
  },

  /* Reconstruye los globales que usan las vistas */
  aplicar(){
    const n = Presupuesto.actual();
    MERCADO = n === 'alto' ? MERCADO_ALTO : n === 'medio' ? MERCADO_MEDIO : MERCADO_BAJO;
    RECETAS = Presupuesto.recetas();
    NOTA_PRESUPUESTO = NOTAS_PRESUPUESTO[n];
  },

  /* Menú del día: elige comidas y calcula el factor de porción
     necesario para acercarse a las calorías objetivo */
  menuDelDia(semilla){
    const objetivo = Nutri.plan().objetivo;
    const pool = Presupuesto.recetas();
    const s = semilla === undefined ? Math.floor(Date.now() / 86400000) : semilla;
    const elegir = (tipo, desfase) => {
      const lista = pool.filter(r => r.tipo === tipo);
      if(!lista.length) return null;
      return lista[(s + desfase) % lista.length];
    };
    const comidas = [elegir('Desayuno',0), elegir('Almuerzo',1), elegir('Cena',2), elegir('Snack',3)]
      .filter(Boolean);
    const kcal = comidas.reduce((a,r) => a + r.kcal, 0);
    const factor = kcal ? objetivo / kcal : 1;
    return {
      comidas, factor,
      total:{
        kcal: Math.round(kcal * factor),
        p: Math.round(comidas.reduce((a,r) => a + r.p, 0) * factor),
        c: Math.round(comidas.reduce((a,r) => a + r.c, 0) * factor),
        g: Math.round(comidas.reduce((a,r) => a + r.g, 0) * factor),
        f: Math.round(comidas.reduce((a,r) => a + r.f, 0) * factor)
      }
    };
  }
};

/* ---------- Reglas de alimentación para ganancia muscular ---------- */
const REGLAS_COMIDA_MUSCULO = [
  {t:'El superávit es pequeño a propósito', d:'Comer 1.000 kcal de más no construye músculo más rápido: el techo lo pone tu recuperación. Todo lo que sobra se acumula como grasa y alarga la definición posterior.'},
  {t:'Proteína repartida en 4 tomas', d:'Unos 0,4 g por kg en cada comida estimula la síntesis de proteína muscular varias veces al día, en lugar de una sola.'},
  {t:'Carbohidrato alrededor del entrenamiento', d:'Es el combustible que permite hacer las series que de verdad estimulan. Concentra arroz, papa y avena en la comida anterior y posterior a entrenar.'},
  {t:'Si la báscula no sube en 3 semanas, come más', d:'Sube 150 kcal y vuelve a medir. Si sube más de 0,5 % de tu peso por semana durante un mes, baja 150: eso ya es más grasa que músculo.'},
  {t:'Come volumen cuando cueste', d:'En superávit el problema no es el hambre, es la saciedad. Batidos de avena, leche y maní resuelven 600 kcal sin sentarte a comer otro plato.'},
  {t:'No uses el volumen como excusa', d:'Comer sin control durante meses obliga después a una definición larga que se lleva por delante parte de lo ganado. Volumen limpio es el camino más corto.'},
  {t:'Duerme como si fuera parte del plan', d:'Porque lo es. El músculo se construye durmiendo, no entrenando. Menos de 7 h reduce la síntesis proteica y la recuperación entre sesiones.'}
];
