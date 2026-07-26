/* ============================================================
   vistas.js
   Dibuja las secciones de contenido: inicio, entrenamiento,
   cardio, alimentación, mercado, recetas y suplementos.
   ============================================================ */

const Vistas = {

  alEntrar:{},   // se rellena al final del archivo

  /* ==========================================================
     INICIO
     ========================================================== */
  inicio(){
    const e = App.estado, sem = App.semanaActual(), total = App.totalSemanas();
    const bloque = App.bloqueDeSemana(sem);
    const hoyISO = Fechas.hoyISO();
    const diaHoy = DIAS[Fechas.diaSemana(hoyISO) - 1];
    const musculo = App.esMusculo();
    const peso = App.pesoActual();
    const delta = peso - e.perfil.pesoInicial;
    const meta = e.perfil.pesoObjetivo;
    const recorrido = Math.abs(meta - e.perfil.pesoInicial) || 1;
    const avance = Math.max(0, Math.min(100, Math.abs(delta) / recorrido * 100));
    const pctTiempo = Math.min(100, App.diaDelPlan() / App.totalDias() * 100);
    const diasRestantes = Math.max(0, App.totalDias() - App.diaDelPlan());
    const adh = App.adherencia(Fechas.sumarDias(hoyISO, -6), hoyISO);
    const frase = FRASES[App.diaDelPlan() % FRASES.length];
    const cardioHoy = Vistas._cardioDeHoy(sem, hoyISO);
    const exp = Nutri.expectativa();
    const n = Nutri.plan();
    const imc = Calc.imc(peso, e.perfil.altura);
    const falta = musculo ? 0 : Math.max(0, peso - meta);

    document.getElementById('sec-inicio').innerHTML = `
      <div class="titulo-seccion">
        <div>
          <div class="eyebrow">Semana ${sem} de ${total} · ${bloque.nombre} · ${musculo ? 'Ganancia muscular' : 'Pérdida de grasa'}</div>
          <h2>${diaHoy.titulo}</h2>
          <p>${Fechas.larga(hoyISO)} · ${diaHoy.duracion} · ${diaHoy.musculos}</p>
        </div>
      </div>

      <!-- Panel de cifras -->
      <div class="row g-3 mb-3">
        <div class="col-6 col-lg-3">
          <div class="tarjeta tarjeta--sube h-100">
            <div class="metrica__etq">Peso actual</div>
            <div class="metrica__valor">${U.n(peso)}<span class="metrica__unidad">kg</span></div>
            <div class="mt-2 barra"><div class="barra__int" style="width:${avance}%"></div></div>
            <div class="tenue mt-1" style="font-size:.75rem">
              ${delta === 0 ? 'Sin cambios todavía'
                : (delta < 0 ? `−${U.n(-delta)} kg desde el inicio` : `+${U.n(delta)} kg desde el inicio`)}
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="tarjeta tarjeta--sube h-100">
            <div class="metrica__etq">${musculo ? 'Ganado' : 'Faltan'}</div>
            <div class="metrica__valor azul">${musculo ? U.n(Math.max(0, delta)) : U.n(falta)}<span class="metrica__unidad">kg</span></div>
            <div class="tenue mt-2" style="font-size:.75rem">${musculo ? `Previsto: +${U.n(n.ganancia,1)} kg` : `Meta: ${U.n(meta)} kg`}</div>
            <div class="tenue" style="font-size:.75rem">Quedan ${diasRestantes} días</div>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="tarjeta tarjeta--sube h-100 d-flex align-items-center gap-3">
            <div class="anillo" style="--p:${adh}">
              <div class="anillo__int">
                <div>
                  <div class="cifra" style="font-size:1.5rem">${adh}<span style="font-size:.8rem">%</span></div>
                  <div class="metrica__etq" style="font-size:.55rem">7 días</div>
                </div>
              </div>
            </div>
            <div>
              <div class="metrica__etq">Adherencia</div>
              <div class="tenue-2" style="font-size:.78rem">${Vistas._juicioAdherencia(adh)}</div>
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="tarjeta tarjeta--sube h-100">
            <div class="metrica__etq">Racha</div>
            <div class="metrica__valor verde">${App.rachaCumplimiento()}<span class="metrica__unidad">días</span></div>
            <div class="tenue mt-2" style="font-size:.75rem">Mejor racha: ${App.mejorRacha()} días</div>
            <div class="tenue" style="font-size:.75rem">${App.diasCumplidos()} días cumplidos</div>
          </div>
        </div>
      </div>

      <!-- Panel de progreso -->
      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-clipboard-data"></i><h3>Panel de progreso</h3>
          <button class="btn btn-linea btn-sm ms-auto" onclick="Nav.ir('seguimiento')">Registrar</button></div>
        <div class="panel-red">
          <div class="panel-dato"><div class="panel-dato__e">Peso inicial</div>
            <div class="panel-dato__v">${U.n(e.perfil.pesoInicial)}<span class="metrica__unidad">kg</span></div></div>
          <div class="panel-dato"><div class="panel-dato__e">Peso actual</div>
            <div class="panel-dato__v verde">${U.n(peso)}<span class="metrica__unidad">kg</span></div></div>
          <div class="panel-dato"><div class="panel-dato__e">${musculo ? 'Peso previsto' : 'Peso objetivo'}</div>
            <div class="panel-dato__v azul">${U.n(meta)}<span class="metrica__unidad">kg</span></div></div>
          <div class="panel-dato"><div class="panel-dato__e">${delta < 0 ? 'Perdidos' : 'Ganados'}</div>
            <div class="panel-dato__v">${U.n(Math.abs(delta))}<span class="metrica__unidad">kg</span></div>
            <div class="panel-dato__n">${U.n(avance,0)} % del recorrido</div></div>
          <div class="panel-dato"><div class="panel-dato__e">IMC</div>
            <div class="panel-dato__v">${U.n(imc)}</div>
            <div class="panel-dato__n">${Calc.clasificaImc(imc)[0]}</div></div>
          <div class="panel-dato"><div class="panel-dato__e">Calorías al día</div>
            <div class="panel-dato__v">${n.objetivo}</div>
            <div class="panel-dato__n">${musculo ? '+' : '−'}${Math.abs(n.diferencia)} sobre mantenimiento</div></div>
          <div class="panel-dato"><div class="panel-dato__e">Días cumplidos</div>
            <div class="panel-dato__v">${App.diasCumplidos()}</div>
            <div class="panel-dato__n">Racha actual: ${App.rachaCumplimiento()}</div></div>
          <div class="panel-dato"><div class="panel-dato__e">Tiempo restante</div>
            <div class="panel-dato__v">${Math.ceil(diasRestantes/7)}<span class="metrica__unidad">sem</span></div>
            <div class="panel-dato__n">${diasRestantes} días</div></div>
        </div>
      </div>

      <!-- Cinta de semanas -->
      <div class="tarjeta mb-3">
        <div class="tarjeta__cab">
          <i class="bi bi-bounding-box"></i>
          <h3>Las ${total} semanas</h3>
          <span class="ms-auto tenue" style="font-size:.75rem">La altura verde es tu adherencia de esa semana</span>
        </div>
        <div class="cinta" id="cinta-semanas"></div>
        <div class="cinta-leyenda">
          ${[...new Set(SEMANAS.map(x => x.bloque))].map(k =>
            `<span><i class="bi bi-square-fill" style="color:${BLOQUES[k].color}"></i> ${BLOQUES[k].nombre}</span>`).join('')}
        </div>
        <div class="divisor"></div>
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="metrica__etq">Progreso del plan</span>
          <span class="cifra" style="font-size:1rem">${Math.round(pctTiempo)}%</span>
        </div>
        <div class="barra barra--gruesa"><div class="barra__int barra__int--azul" style="width:${pctTiempo}%"></div></div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <div class="tarjeta h-100">
            <div class="tarjeta__cab"><i class="bi bi-check2-square"></i><h3>Checklist de hoy</h3></div>
            <div id="checklist-hoy"></div>
            <div class="divisor"></div>
            <div class="frase">${frase.t}<small>${frase.a}</small></div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="tarjeta mb-3">
            <div class="tarjeta__cab"><i class="bi bi-lightning-charge"></i><h3>Lo de hoy</h3></div>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div style="font-weight:600">${diaHoy.titulo}</div>
                  <div class="tenue" style="font-size:.78rem">${diaHoy.ejercicios.length} ejercicios · RIR ${bloque.rir}</div>
                </div>
                <button class="btn btn-linea btn-sm" onclick="Nav.ir('entrenamiento')">Ver sesión</button>
              </div>
              ${cardioHoy ? `
              <div class="divisor my-1"></div>
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div style="font-weight:600">${cardioHoy.km} km · ${TIPOS_CARDIO[cardioHoy.tipo].etq}</div>
                  <div class="tenue" style="font-size:.78rem">${TIPOS_CARDIO[cardioHoy.tipo].desc}</div>
                </div>
                <button class="btn btn-linea btn-sm flex-shrink-0" onclick="Nav.ir('cardio')">Ver plan</button>
              </div>` : `
              <div class="divisor my-1"></div>
              <div class="tenue" style="font-size:.82rem">Hoy no toca correr. Descansar también es parte del programa.</div>`}
            </div>
          </div>

          <div class="tarjeta">
            <div class="tarjeta__cab"><i class="bi bi-flag"></i><h3>Objetivos de la semana ${sem}</h3></div>
            <ul class="lista-fina">${Vistas._objetivosSemana(sem).map(o => `<li>${o}</li>`).join('')}</ul>
            <div class="divisor"></div>
            <div class="tenue" style="font-size:.8rem"><b class="tenue-2">${bloque.nombre}:</b> ${bloque.desc}</div>
          </div>
        </div>
      </div>

      <!-- Expectativas -->
      <div class="tarjeta tarjeta--${exp.color} mt-3">
        <div class="tarjeta__cab"><i class="bi bi-compass"></i><h3>${exp.titulo}</h3></div>
        <div class="tenue-2" style="font-size:.88rem">${exp.texto}</div>
      </div>

      <!-- Insignias -->
      <div class="tarjeta mt-3">
        <div class="tarjeta__cab"><i class="bi bi-award"></i><h3>Insignias</h3>
          <span class="ms-auto tenue" style="font-size:.78rem" id="conteo-logros"></span></div>
        <div class="row g-2" id="rejilla-logros"></div>
      </div>`;

    Vistas._pintarCinta();
    Vistas._pintarChecklist();
    Logros.pintar();
    App.refrescarMarca();
  },

  _juicioAdherencia(a){
    if(a >= 90) return 'Excelente. Así se ve un proceso que sí termina.';
    if(a >= 75) return 'Buen ritmo. Suficiente para ver cambios claros.';
    if(a >= 55) return 'Va, pero se está escapando trabajo. Revisa qué casilla fallas más.';
    return 'Aquí está el problema real, no en el plan. Empieza por marcar una sola cosa al día.';
  },

  _objetivosSemana(sem){
    const c = CARDIO.find(c => c.n === sem);
    const total = c ? (c.mar[0] + c.jue[0] + c.sab[0] + c.dom[0]) : 0;
    const bloque = App.claveBloque(sem);
    const musculo = App.esMusculo();
    const sesiones = DIAS.filter(d => d.tipo === 'fuerza' || d.tipo === 'mixto').length;
    const objs = [
      `Completar las <b>${sesiones} sesiones de fuerza</b> de la semana.`,
      total > 0 ? `Correr <b>${U.n(total)} km</b> repartidos en las salidas programadas.`
                : `Mantener <b>7.000–10.000 pasos</b> diarios: el cardio ligero no interfiere con el crecimiento.`,
      `Registrar <b>peso y medidas</b> el mismo día y a la misma hora.`,
      `Dormir <b>7 h o más</b> en al menos 5 noches.`,
      musculo
        ? `Superar al menos <b>una serie</b> de la semana pasada en cada ejercicio principal.`
        : `Llegar a la <b>proteína diaria</b> los 7 días: es lo que decide cuánto músculo conservas.`
    ];
    if(bloque === 'descarga') objs.push('Semana de descarga: <b>mitad de series</b> y nada al fallo. No la conviertas en semana normal.');
    if(bloque === 'inten' || bloque === 'hiper') objs.push('Añadir <b>myo-reps</b> en el último ejercicio de cada sesión.');
    if(bloque === 'densi' || bloque === 'bombeo') objs.push('Recortar <b>15 s de descanso</b> respecto a la semana anterior sin perder repeticiones.');
    if(bloque === 'pico') objs.push('Sostener las cargas: en déficit, <b>no perder fuerza ya es ganar</b>.');
    if(bloque === 'fuerzaMax') objs.push('Bajar repeticiones y <b>subir la variante</b> de los ejercicios principales.');
    if(sem % 4 === 0) objs.push('Tomar <b>fotos de progreso</b> con la misma luz y postura.');
    return objs;
  },

  _cardioDeHoy(sem, iso){
    const d = Fechas.diaSemana(iso);
    const c = CARDIO.find(c => c.n === sem);
    if(!c) return null;
    const mapa = {2:'mar', 4:'jue', 6:'sab', 7:'dom'};
    if(!mapa[d]) return null;
    const km = c[mapa[d]][0];
    if(!km) return null;
    return {km, tipo:c[mapa[d]][1]};
  },

  _pintarCinta(){
    const cont = document.getElementById('cinta-semanas');
    if(!cont) return;
    const actual = App.semanaActual();
    cont.innerHTML = SEMANAS.map(s => {
      const adh = App.adherenciaSemana(s.n);
      const b = BLOQUES[s.bloque];
      return `<div class="cinta__sem ${s.n === actual ? 'actual' : ''}" data-bloque="${s.bloque}"
                title="Semana ${s.n} · ${b.nombre} · adherencia ${adh}%">
        <div class="cinta__relleno" style="height:${adh}%;background:linear-gradient(0deg,${b.color}55,${b.color})"></div>
        <span>${s.n}</span>
      </div>`;
    }).join('');
    cont.querySelectorAll('.cinta__sem').forEach((el, i) => {
      el.addEventListener('click', () => {
        const s = SEMANAS[i], b = BLOQUES[s.bloque];
        Avisos.mostrar(`Semana ${s.n} · ${b.nombre} · adherencia ${App.adherenciaSemana(s.n)}%`, 'calendar3');
      });
    });
  },

  _pintarChecklist(){
    const cont = document.getElementById('checklist-hoy');
    if(!cont) return;
    const iso = Fechas.hoyISO(), d = App.dia(iso);
    const items = [
      ['entreno','Entrenamiento de fuerza realizado','activity'],
      ['cardio','Cardio realizado','stopwatch'],
      ['agua','Agua del día completada','droplet'],
      ['sueno','Dormí 7 horas o más','moon-stars'],
      ['dieta','Alimentación y proteína cumplidas','egg-fried']
    ];
    cont.innerHTML = items.map(([k, t, ico]) => `
      <div class="check-fila ${d[k] ? 'on' : ''}" data-campo="${k}">
        <div class="check-caja"><i class="bi bi-check-lg"></i></div>
        <i class="bi bi-${ico} tenue"></i>
        <span class="check-txt">${t}</span>
      </div>`).join('');
    cont.querySelectorAll('.check-fila').forEach(f => {
      f.addEventListener('click', () => {
        const estado = App.marcar(iso, f.dataset.campo);
        f.classList.toggle('on', estado[f.dataset.campo]);
        Vistas._pintarCinta();
        if(['entreno','cardio','agua','sueno','dieta'].every(k => estado[k]))
          Avisos.mostrar('Día perfecto. Cinco de cinco.', 'stars');
      });
    });
  },

  /* ==========================================================
     ENTRENAMIENTO
     ========================================================== */
  entrenamiento(){
    const sem = App.semanaActual();
    const bloque = App.bloqueDeSemana(sem), clave = App.claveBloque(sem);
    const hoy = Fechas.diaSemana(Fechas.hoyISO());
    Vistas._diaSel = Vistas._diaSel || hoy;

    document.getElementById('sec-entrenamiento').innerHTML = `
      <div class="titulo-seccion">
        <div>
          <div class="eyebrow">Bloque actual · ${bloque.nombre}</div>
          <h2>Entrenamiento</h2>
          <p>4 sesiones de fuerza + 3 de apoyo. RIR objetivo esta semana: <b class="verde">${bloque.rir}</b></p>
        </div>
      </div>

      <div class="tarjeta tarjeta--acento mb-3">
        <div class="tarjeta__cab"><i class="bi bi-sliders"></i><h3>Cómo se entrena en el bloque ${bloque.nombre}</h3></div>
        <ul class="lista-fina">${REGLAS_BLOQUE[clave].map(r => `<li>${r}</li>`).join('')}</ul>
      </div>

      <div class="dia-tira mb-3" id="tira-dias"></div>
      <div id="detalle-dia"></div>

      <div class="tarjeta mt-3">
        <div class="tarjeta__cab"><i class="bi bi-fire"></i><h3>Técnicas de intensidad</h3>
          <span class="ms-auto tenue" style="font-size:.75rem">Cómo progresar sin más kilos</span></div>
        <div id="lista-tecnicas"></div>
      </div>

      <div class="tarjeta mt-3">
        <div class="tarjeta__cab"><i class="bi bi-calendar3-range"></i><h3>Los 4 meses de un vistazo</h3></div>
        <div class="table-responsive"><table class="tabla">
          <thead><tr><th>Semanas</th><th>Bloque</th><th>RIR</th><th>Qué cambia</th></tr></thead>
          <tbody>
            <tr><td>1 – 4</td><td class="verde">Base técnica</td><td>3–2</td><td>${BLOQUES.base.desc}</td></tr>
            <tr><td>5</td><td class="tenue">Descarga</td><td>4–3</td><td>${BLOQUES.descarga.desc}</td></tr>
            <tr><td>6 – 9</td><td class="verde">Intensificación</td><td>2–1</td><td>${BLOQUES.inten.desc}</td></tr>
            <tr><td>10</td><td class="tenue">Descarga</td><td>4–3</td><td>Igual que la semana 5, con el cardio también reducido.</td></tr>
            <tr><td>11 – 14</td><td class="ambar">Densidad</td><td>1–0</td><td>${BLOQUES.densi.desc}</td></tr>
            <tr><td>15</td><td class="tenue">Descarga</td><td>4–3</td><td>La última recarga antes del tramo final.</td></tr>
            <tr><td>16 – 17</td><td class="rojo">Pico</td><td>1–0</td><td>${BLOQUES.pico.desc}</td></tr>
          </tbody>
        </table></div>
      </div>`;

    Vistas._pintarTiraDias();
    Vistas._pintarDia(Vistas._diaSel);
    Vistas._pintarTecnicas();
  },

  _pintarTiraDias(){
    const cont = document.getElementById('tira-dias');
    if(!cont) return;
    const hoy = Fechas.diaSemana(Fechas.hoyISO());
    cont.innerHTML = DIAS.map(d => `
      <div class="dia-chip ${d.id === Vistas._diaSel ? 'activo' : ''}" data-dia="${d.id}">
        <div class="dia-chip__d">${d.corto}${d.id === hoy ? ' <i class="bi bi-dot verde"></i>' : ''}</div>
        <div class="dia-chip__t">${d.titulo.replace(' · ', '<br>')}</div>
      </div>`).join('');
    cont.querySelectorAll('.dia-chip').forEach(c => c.addEventListener('click', () => {
      Vistas._diaSel = Number(c.dataset.dia);
      Vistas._pintarTiraDias();
      Vistas._pintarDia(Vistas._diaSel);
      document.getElementById('detalle-dia').scrollIntoView({behavior:'smooth', block:'start'});
    }));
  },

  _pintarDia(id){
    const d = DIAS.find(x => x.id === id);
    const cont = document.getElementById('detalle-dia');
    if(!d || !cont) return;
    const sem = App.semanaActual(), clave = App.claveBloque(sem);
    const esDescarga = clave === 'descarga';

    cont.innerHTML = `
      <div class="tarjeta mb-3">
        <div class="d-flex flex-wrap justify-content-between align-items-start gap-2">
          <div>
            <div class="eyebrow">${d.nombre} · ${d.duracion}</div>
            <h3 style="font-size:1.5rem">${d.titulo}</h3>
            <div class="tenue mt-1" style="font-size:.85rem">${d.musculos}</div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-linea btn-sm" onclick="Cronos.abrirDescanso()"><i class="bi bi-hourglass-split"></i> Descanso</button>
            <button class="btn btn-verde btn-sm" onclick="Cronos.abrirCrono()"><i class="bi bi-stopwatch"></i> Cronómetro</button>
          </div>
        </div>
        <div class="divisor"></div>
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <div class="metrica__etq mb-1">Calentamiento</div>
            <div class="tenue-2" style="font-size:.86rem">${d.calentamiento}</div>
          </div>
          <div class="col-12 col-md-6">
            <div class="metrica__etq mb-1">Nota del día</div>
            <div class="tenue-2" style="font-size:.86rem">${d.notas}</div>
          </div>
        </div>
        ${esDescarga ? `<div class="mt-3 tarjeta tarjeta--aviso" style="padding:.7rem .85rem">
          <b class="ambar"><i class="bi bi-info-circle"></i> Semana de descarga:</b>
          <span class="tenue-2" style="font-size:.86rem"> haz la mitad de las series de cada ejercicio, con el mismo peso y sin acercarte al fallo.</span>
        </div>` : ''}
      </div>
      ${d.ejercicios.map((id, i) => Vistas._tarjetaEjercicio(EJERCICIOS[id], i + 1, id)).join('')}`;

    cont.querySelectorAll('.ejercicio__cab').forEach(c =>
      c.addEventListener('click', () => c.parentElement.classList.toggle('abierto')));
  },

  _tarjetaEjercicio(ej, num, id){
    if(!ej) return '';
    return `
    <div class="ejercicio" id="ej-${id}">
      <div class="ejercicio__cab">
        <div class="ejercicio__num">${String(num).padStart(2,'0')}</div>
        <div class="ejercicio__t">
          <h4>${ej.nombre}</h4>
          <div class="ejercicio__meta">
            <span><b>${ej.series}</b> series</span>
            <span><b>${ej.reps}</b></span>
            <span>Descanso <b>${ej.descanso}</b></span>
            <span>RIR <b>${ej.rir}</b></span>
            <span>Tempo <b>${ej.tempo}</b></span>
          </div>
        </div>
        <i class="bi bi-chevron-down ejercicio__flecha"></i>
      </div>
      <div class="ejercicio__cuerpo">
        <div class="mov-cont mt-3">
          ${SVGEjercicios.dibujar(ej.patron)}
          <div class="mov-datos">
            <div class="mb-2">
              ${ej.principales.map(m => `<span class="etiqueta etiqueta--prim">${m}</span>`).join('')}
              ${ej.secundarios.map(m => `<span class="etiqueta etiqueta--sec">${m}</span>`).join('')}
            </div>
            <div class="metrica__etq mt-3 mb-1">Técnica correcta</div>
            <ul class="lista-fina">${ej.tecnica.map(t => `<li>${t}</li>`).join('')}</ul>
            <div class="metrica__etq mt-3 mb-1">Errores comunes</div>
            <ul class="lista-fina lista-fina--error">${ej.errores.map(t => `<li>${t}</li>`).join('')}</ul>
            <div class="metrica__etq mt-3 mb-1">Consejos</div>
            <ul class="lista-fina lista-fina--tip">${ej.tips.map(t => `<li>${t}</li>`).join('')}</ul>
            <div class="metrica__etq mt-3 mb-1">Progresión en los 4 meses</div>
            <div class="tenue-2" style="font-size:.85rem">${ej.avance}</div>
            <button class="btn btn-linea btn-sm mt-3" onclick="Seguimiento.registrarFuerzaRapido('${id}')">
              <i class="bi bi-plus-circle"></i> Registrar serie de hoy
            </button>
          </div>
        </div>
      </div>
    </div>`;
  },

  _pintarTecnicas(){
    const cont = document.getElementById('lista-tecnicas');
    if(!cont) return;
    cont.innerHTML = TECNICAS.map(t => `
      <div class="plegable">
        <div class="plegable__cab">
          <div><h4>${t.n}</h4><div class="tenue" style="font-size:.72rem">Entra en: ${t.b}</div></div>
          <i class="bi bi-chevron-down"></i>
        </div>
        <div class="plegable__cuerpo tenue-2" style="font-size:.87rem">${t.d}</div>
      </div>`).join('');
    cont.querySelectorAll('.plegable__cab').forEach(c =>
      c.addEventListener('click', () => c.parentElement.classList.toggle('abierto')));
  },

  /* ==========================================================
     CARDIO
     ========================================================== */
  cardio(){
    const sem = App.semanaActual(), total = App.totalSemanas();
    const musculo = App.esMusculo();
    const suma = x => x.mar[0] + x.jue[0] + x.sab[0] + x.dom[0];
    const cAct = CARDIO.find(c => c.n === sem);
    const primera = CARDIO[0] ? suma(CARDIO[0]) : 0;
    const maxima = CARDIO.reduce((m,c) => Math.max(m, suma(c)), 0);
    const nombres = {mar:'Martes', jue:'Jueves', sab:'Sábado', dom:'Domingo'};

    document.getElementById('sec-cardio').innerHTML = `
      <div class="titulo-seccion">
        <div>
          <div class="eyebrow">Semana ${sem} · ${U.n(cAct ? suma(cAct) : 0)} km programados</div>
          <h2>Cardio</h2>
          <p>${musculo
            ? 'Cardio de apoyo: el mínimo para la salud cardiovascular sin comerse tus ganancias.'
            : `Progresión de carrera de ${U.n(primera)} a ${U.n(maxima)} km semanales en ${total} semanas.`}</p>
        </div>
      </div>

      <div class="tarjeta ${musculo ? 'tarjeta--acento' : 'tarjeta--aviso'} mb-3">
        <div class="tarjeta__cab"><i class="bi bi-diagram-3"></i><h3>Cómo está construida esta progresión</h3></div>
        ${musculo ? `
          <p class="tenue-2 mb-2" style="font-size:.88rem">
            En una etapa de ganancia muscular el cardio no es la herramienta principal: cada sesión larga
            consume calorías y capacidad de recuperación que necesitas para crecer. Por eso el plan deja
            <b>dos salidas cortas y suaves por semana</b>, suficientes para mantener la salud cardiovascular,
            controlar la grasa que acompaña al superávit y llegar mejor recuperado a las sesiones de fuerza.
          </p>
          <div class="tenue" style="font-size:.83rem">
            Si notas que ganas grasa más rápido de lo previsto, la primera palanca es bajar 100–150 kcal,
            no añadir cardio. Añadir cardio en volumen suele terminar en más cansancio y menos progreso.
          </div>` : `
          <p class="tenue-2 mb-2" style="font-size:.88rem">
            El volumen arranca en <b>${U.n(primera)} km</b> y sube como máximo un <b>8 % por semana</b>, con una
            bajada del 30 % cada cuarta semana. Es la regla que menos lesiones produce: el músculo se adapta
            en semanas, pero el tendón, el hueso y la fascia tardan meses. La mayoría de las lesiones al
            empezar a correr vienen de subir kilómetros demasiado rápido, no de correr demasiado fuerte.
          </p>
          <p class="tenue-2 mb-2" style="font-size:.88rem">
            Desde la semana 8 entra una sesión de <b>intervalos</b>: mismo tiempo, más gasto calórico y mejor
            conservación de masa muscular que sumar kilómetros lentos. El resto de las salidas se mantienen
            suaves a propósito, porque ahí es donde se construye la base que permite todo lo demás.
          </p>
          <div class="tenue" style="font-size:.83rem">
            Si tu punto de partida es más alto de lo que marca el plan, ajusta tu nivel de actividad en
            Calculadoras y la progresión se recalcula sola.
          </div>`}
      </div>

      <div class="row g-3 mb-3">
        ${cAct ? ['mar','jue','sab','dom'].filter(k => cAct[k][0] > 0).map(k => {
          const [km, tipo] = cAct[k];
          const t = TIPOS_CARDIO[tipo];
          return `<div class="col-6 col-lg-3">
            <div class="tarjeta tarjeta--sube h-100">
              <div class="metrica__etq">${nombres[k]}</div>
              <div class="metrica__valor">${U.n(km)}<span class="metrica__unidad">km</span></div>
              <span class="etiqueta mt-2" style="border-color:${t.color};color:${t.color}">${t.etq}</span>
              <div class="tenue mt-1" style="font-size:.75rem;line-height:1.35">${t.desc}</div>
            </div>
          </div>`;
        }).join('') : ''}
      </div>

      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-graph-up"></i><h3>Volumen semanal</h3></div>
        <div class="lienzo-envoltura"><canvas id="graf-cardio"></canvas></div>
      </div>

      ${musculo ? '' : `
      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-lightning"></i><h3>${Plan.hiit.nombre}</h3>
          <span class="etiqueta etiqueta--tec ms-auto">Opcional</span></div>
        <p class="tenue-2 mb-2" style="font-size:.88rem"><b>Formato:</b> ${Plan.hiit.formato}</p>
        <p class="tenue-2 mb-2" style="font-size:.88rem"><b>Cuándo:</b> ${Plan.hiit.cuando}</p>
        <div class="mb-2">${Plan.hiit.variantes.map(v => `<span class="etiqueta">${v}</span>`).join('')}</div>
        <div class="tenue" style="font-size:.83rem"><i class="bi bi-info-circle"></i> ${Plan.hiit.aviso}</div>
        <button class="btn btn-linea btn-sm mt-3" onclick="Cronos.abrirIntervalos()">
          <i class="bi bi-play-fill"></i> Abrir temporizador de intervalos</button>
      </div>`}

      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-table"></i><h3>Plan completo</h3></div>
        <div class="table-responsive"><table class="tabla">
          <thead><tr><th>Sem</th><th>Martes</th><th>Jueves</th><th>Sábado</th><th>Domingo</th><th class="num">Total</th></tr></thead>
          <tbody>${CARDIO.map(c => {
            const cel = ([km,t]) => km ? `${U.n(km)} km <span class="tenue" style="font-size:.72rem">${TIPOS_CARDIO[t].etq}</span>`
                                       : '<span class="tenue">—</span>';
            const bl = App.claveBloque(c.n);
            return `<tr style="${c.n === sem ? 'background:rgba(43,224,138,.07)' : ''}">
              <td><b>${c.n}</b>${bl === 'descarga' ? ' <span class="tenue" style="font-size:.7rem">desc.</span>' : ''}</td>
              <td>${cel(c.mar)}</td><td>${cel(c.jue)}</td><td>${cel(c.sab)}</td><td>${cel(c.dom)}</td>
              <td class="num"><b>${U.n(suma(c))}</b></td></tr>`;
          }).join('')}</tbody>
        </table></div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <div class="tarjeta h-100">
            <div class="tarjeta__cab"><i class="bi bi-speedometer2"></i><h3>Cómo saber si vas al ritmo correcto</h3></div>
            <ul class="lista-fina">
              <li><b>Suave:</b> puedes decir una frase completa sin quedarte sin aire. Si no puedes, vas rápido.</li>
              <li><b>Tempo:</b> respondes con tres o cuatro palabras. Incómodo pero sostenible.</li>
              <li><b>Intervalos:</b> en el tramo fuerte no puedes hablar; en el trote de recuperación sí.</li>
              <li>El 80 % de tus kilómetros deben ser suaves. Correr todo a medio gas es el error clásico: cansa como lo duro y adapta como lo fácil.</li>
            </ul>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="tarjeta h-100">
            <div class="tarjeta__cab"><i class="bi bi-shield-check"></i><h3>Señales para frenar</h3></div>
            <ul class="lista-fina lista-fina--error">
              <li>Dolor puntual en la espinilla, la rodilla o el talón que aparece antes del kilómetro 2: cambia esa sesión por caminata rápida o bici.</li>
              <li>Dolor que empeora mientras corres, en vez de calentarse y ceder: para.</li>
              <li>Pulso en reposo 8–10 latidos por encima de lo normal varios días seguidos: te estás pasando.</li>
              <li>Sueño que empeora, hambre extrema y fuerza que cae dos semanas seguidas: sube calorías o baja volumen.</li>
              <li>Cambia las zapatillas cada 600–800 km. Es el gasto que más lesiones evita.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="tarjeta mt-3">
        <div class="tarjeta__cab"><i class="bi bi-stopwatch"></i><h3>Temporizador de carrera</h3></div>
        <p class="tenue mb-3" style="font-size:.85rem">Para las sesiones por tramos y para controlar el tiempo total de la salida.</p>
        <button class="btn btn-verde" onclick="Cronos.abrirIntervalos()"><i class="bi bi-play-fill"></i> Abrir temporizador</button>
      </div>`;

    Graficas.cardio();
  },

  /* ==========================================================
     ALIMENTACIÓN
     ========================================================== */
  alimentacion(){
    const n = Calc.completo();
    const peso = n.peso;
    const musculo = App.esMusculo();
    const reglas = musculo ? REGLAS_COMIDA_MUSCULO : REGLAS_COMIDA;
    const nivel = Presupuesto.actual();

    document.getElementById('sec-alimentacion').innerHTML = `
      <div class="titulo-seccion">
        <div>
          <div class="eyebrow">${musculo ? 'Superávit controlado' : 'Déficit sostenible'} · presupuesto ${Presupuesto.NIVELES[nivel].etq.toLowerCase()}</div>
          <h2>Alimentación</h2>
          <p>Objetivos calculados con tu peso actual de ${U.n(peso)} kg.</p>
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Calorías objetivo</div>
          <div class="metrica__valor">${n.objetivo}<span class="metrica__unidad">kcal</span></div>
          <div class="tenue mt-1" style="font-size:.75rem">Mantenimiento: ${n.tdee} kcal
            (${musculo ? '+' : '−'}${Math.abs(n.diferencia)})</div></div></div>
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Proteína</div>
          <div class="metrica__valor verde">${n.proteina}<span class="metrica__unidad">g</span></div>
          <div class="tenue mt-1" style="font-size:.75rem">${U.n(n.proteina/peso,1)} g por kg</div></div></div>
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Grasa</div>
          <div class="metrica__valor azul">${n.grasa}<span class="metrica__unidad">g</span></div>
          <div class="tenue mt-1" style="font-size:.75rem">${musculo ? 'Apoyo hormonal' : 'Mínimo hormonal'}</div></div></div>
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Carbohidrato</div>
          <div class="metrica__valor">${n.carbo}<span class="metrica__unidad">g</span></div>
          <div class="tenue mt-1" style="font-size:.75rem">Lo que sobra: es tu combustible</div></div></div>
      </div>

      <div class="tarjeta tarjeta--aviso mb-3">
        <div class="tarjeta__cab"><i class="bi bi-cash-coin ambar"></i><h3>${NOTA_PRESUPUESTO.titulo}</h3>
          <button class="btn btn-linea btn-sm ms-auto" onclick="Nav.ir('mercado')">Ver lista</button></div>
        <div class="tenue-2" style="font-size:.88rem">${NOTA_PRESUPUESTO.texto}</div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-7">
          <div class="tarjeta h-100">
            <div class="tarjeta__cab"><i class="bi bi-list-check"></i><h3>Las reglas del plan</h3></div>
            ${reglas.map(r => `
              <div class="mb-3">
                <div style="font-weight:600;font-size:.92rem">${r.t}</div>
                <div class="tenue-2" style="font-size:.85rem">${r.d}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="col-12 col-lg-5">
          <div class="tarjeta mb-3">
            <div class="tarjeta__cab"><i class="bi bi-droplet"></i><h3>Agua</h3></div>
            <div class="metrica__valor azul">${U.n(n.agua,1)}<span class="metrica__unidad">L / día</span></div>
            <div class="tenue mt-2" style="font-size:.82rem">
              35 ml por kg más 600 ml por cada hora de entrenamiento. Los días de sesión larga,
              súmale medio litro y una pizca de sal si sudas mucho.
            </div>
          </div>
          <div class="tarjeta mb-3">
            <div class="tarjeta__cab"><i class="bi bi-arrow-repeat"></i><h3>Cómo repartir la proteína</h3></div>
            <div class="tenue-2 mb-2" style="font-size:.86rem">
              Reparte los ${n.proteina} g en 4 tomas de unos ${Math.round(n.proteina/4)} g.
              Así se estimula la síntesis de proteína muscular varias veces al día en lugar de una sola.
            </div>
            <div class="divisor"></div>
            <div class="tenue" style="font-size:.82rem">
              ${musculo
                ? 'Una de esas tomas debe caer en las 2 h siguientes al entrenamiento, junto con carbohidrato.'
                : 'Si un día te quedas corto de calorías, recorta grasa o carbohidrato: la proteína no se toca.'}
            </div>
          </div>
          <div class="tarjeta">
            <div class="tarjeta__cab"><i class="bi bi-shuffle"></i><h3>Menú de hoy</h3></div>
            <p class="tenue mb-3" style="font-size:.84rem">
              Las recetas rotan solas cada día para que no comas siempre lo mismo.</p>
            <button class="btn btn-verde w-100" onclick="Nav.ir('recetas')">
              <i class="bi bi-journal-richtext"></i> Ver menú y recetas</button>
          </div>
        </div>
      </div>`;
  },

  /* ==========================================================
     MERCADO
     ========================================================== */
  mercado(){
    const precios = App.estado.precios;
    const nivel = Presupuesto.actual();
    const presu = App.estado.perfil.presupuestoCOP || 250000;
    const precio = m => precios[m.id] !== undefined ? precios[m.id] : m.precio;
    const total = MERCADO.reduce((s,m) => s + precio(m), 0);
    const prot = MERCADO.reduce((s,m) => s + m.prot, 0);
    const kcal = MERCADO.reduce((s,m) => s + m.kcal, 0);
    const pctPresu = Math.min(100, total / presu * 100);
    const n = Calc.completo();
    const cubre = Math.round(prot/30 / n.proteina * 100);

    document.getElementById('sec-mercado').innerHTML = `
      <div class="titulo-seccion">
        <div>
          <div class="eyebrow">Presupuesto ${Presupuesto.NIVELES[nivel].etq.toLowerCase()} · ${Presupuesto.NIVELES[nivel].rango}</div>
          <h2>Lista de mercado</h2>
          <p>Compra mensual para una persona. Toca cualquier precio para ajustarlo al de tu ciudad.</p>
        </div>
      </div>

      <div class="tarjeta mb-3">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <div class="metrica__etq mb-1">Cambiar nivel de presupuesto</div>
            <div class="selector-presu">
              ${Object.entries(Presupuesto.NIVELES).map(([k,v]) =>
                `<button class="${nivel === k ? 'sel' : ''}" data-nivel="${k}">${v.etq}</button>`).join('')}
            </div>
          </div>
          <div class="text-end">
            <div class="metrica__etq">Tu presupuesto</div>
            <div class="cifra" style="font-size:1.4rem">${U.cop(presu)}</div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Total del mes</div>
          <div class="metrica__valor ${total > presu ? 'ambar' : 'verde'}">${U.cop(total)}</div>
          <div class="mt-2 barra"><div class="barra__int" style="width:${pctPresu}%"></div></div>
          <div class="tenue mt-1" style="font-size:.74rem">${total > presu
            ? `Se pasa ${U.cop(total - presu)} de tu presupuesto` : `Te sobran ${U.cop(presu - total)}`}</div></div></div>
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Proteína diaria</div>
          <div class="metrica__valor">${Math.round(prot/30)}<span class="metrica__unidad">g</span></div>
          <div class="tenue mt-1" style="font-size:.74rem">Cubre el ${cubre} % de tus ${n.proteina} g objetivo</div></div></div>
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Calorías diarias</div>
          <div class="metrica__valor">${Math.round(kcal/30)}</div>
          <div class="tenue mt-1" style="font-size:.74rem">Objetivo: ${n.objetivo} kcal</div></div></div>
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Costo por día</div>
          <div class="metrica__valor azul">${U.cop(total/30)}</div>
          <div class="tenue mt-1" style="font-size:.74rem">${U.cop(total/90)} por comida</div></div></div>
      </div>

      ${Math.abs(kcal/30 - n.objetivo) > 350 ? `
        <div class="tarjeta tarjeta--aviso mb-3">
          <div class="tenue-2" style="font-size:.87rem">
            <b class="ambar"><i class="bi bi-info-circle"></i> Ajusta las cantidades:</b>
            esta lista aporta unas ${Math.round(kcal/30)} kcal diarias y tu objetivo son ${n.objetivo}.
            ${kcal/30 < n.objetivo
              ? 'Sube arroz, avena, papa y plátano, que son lo más barato por caloría.'
              : 'Baja aceite y cereales antes que proteína o verdura.'}
          </div>
        </div>` : ''}

      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-basket"></i><h3>Lista completa</h3>
          <button class="btn btn-linea btn-sm ms-auto" onclick="Vistas._restaurarPrecios()">Restaurar precios</button></div>
        <div class="table-responsive"><table class="tabla">
          <thead><tr>
            <th>Producto</th><th>Cantidad</th><th class="num">Precio</th>
            <th class="num">Proteína total</th><th>Duración</th>
          </tr></thead>
          <tbody>${MERCADO.map(m => `
            <tr>
              <td><div style="font-weight:600">${m.prod}</div>
                  <div class="tenue" style="font-size:.72rem">${m.cat}</div></td>
              <td class="tenue-2">${m.cant}</td>
              <td class="num"><input class="form-control form-control-sm text-end precio-input"
                   style="max-width:110px;display:inline-block" type="number" step="500"
                   value="${precio(m)}" data-id="${m.id}"></td>
              <td class="num verde">${m.prot} g</td>
              <td class="tenue" style="font-size:.78rem">${m.dur}</td>
            </tr>
            <tr><td colspan="5" class="tenue" style="font-size:.78rem;padding-top:0;border-bottom:1px solid var(--linea)">
              ${m.nota}</td></tr>`).join('')}
          </tbody>
          <tfoot><tr><th colspan="2">Total</th>
            <th class="num" style="font-size:1rem">${U.cop(total)}</th>
            <th class="num verde">${Math.round(prot)} g</th><th></th></tr></tfoot>
        </table></div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-6"><div class="tarjeta h-100">
          <div class="tarjeta__cab"><i class="bi bi-trophy"></i><h3>Proteína más barata por peso</h3></div>
          <div class="table-responsive"><table class="tabla">
            <thead><tr><th>Alimento</th><th class="num">COP por gramo de proteína</th></tr></thead>
            <tbody>
              <tr><td>Carne de soya texturizada</td><td class="num verde"><b>~22</b></td></tr>
              <tr><td>Lentejas</td><td class="num verde"><b>~38</b></td></tr>
              <tr><td>Avena</td><td class="num">~42</td></tr>
              <tr><td>Pechuga de pollo</td><td class="num">~69</td></tr>
              <tr><td>Huevos</td><td class="num">~93</td></tr>
              <tr><td>Leche</td><td class="num">~122</td></tr>
              <tr><td>Carne de res magra</td><td class="num">~133</td></tr>
              <tr><td>Proteína en polvo</td><td class="num ambar">~147</td></tr>
              <tr><td>Atún en lata</td><td class="num ambar">~158</td></tr>
              <tr><td>Salmón</td><td class="num rojo">~350</td></tr>
            </tbody></table></div>
          <div class="tenue mt-2" style="font-size:.78rem">
            Los alimentos caros no son peores ni mejores: aportan micronutrientes y variedad.
            Pero si el presupuesto aprieta, la proteína se construye con las tres primeras filas.
          </div>
        </div></div>

        <div class="col-12 col-lg-6"><div class="tarjeta h-100">
          <div class="tarjeta__cab"><i class="bi bi-lightbulb"></i><h3>Cómo comprar</h3></div>
          <ul class="lista-fina">
            <li>Compra la proteína fresca y las verduras <b>cada semana</b>; el resto, una sola vez al mes.</li>
            <li>Congela la carne <b>el mismo día</b>, ya porcionada y adobada: quita la excusa de "no tengo nada listo".</li>
            <li>Los congelados (verdura, frutos rojos, pescado) cuestan bastante menos y conservan casi todo.</li>
            <li>Revisa el precio por kilo, no el del paquete: es donde más se diferencian las tiendas.</li>
            <li>No compres con hambre y lleva la lista. Es literalmente lo que decide el mes.</li>
            <li>Cocina por lotes un día a la semana. El plan no se rompe por falta de voluntad, se rompe por llegar con hambre sin nada preparado.</li>
          </ul>
        </div></div>
      </div>`;

    document.querySelectorAll('.precio-input').forEach(i => {
      i.addEventListener('change', () => {
        App.estado.precios[i.dataset.id] = Number(i.value) || 0;
        App.guardar();
        Vistas.mercado();
      });
    });
    document.querySelectorAll('[data-nivel]').forEach(b => {
      b.addEventListener('click', () => {
        App.estado.perfil.presupuesto = b.dataset.nivel;
        App.guardar();
        Presupuesto.aplicar();
        Vistas.mercado();
        Avisos.mostrar('Lista y recetas actualizadas al presupuesto ' + Presupuesto.NIVELES[b.dataset.nivel].etq.toLowerCase() + '.', 'basket');
      });
    });
  },

  _restaurarPrecios(){
    App.estado.precios = {};
    App.guardar();
    Vistas.mercado();
    Avisos.mostrar('Precios restaurados a los de referencia.', 'arrow-counterclockwise');
  },

  /* ==========================================================
     RECETAS
     ========================================================== */
  recetas(){
    const grupos = ['Desayuno','Almuerzo','Cena','Snack'];
    const nivel = Presupuesto.actual();
    const n = Calc.completo();
    if(Vistas._semillaMenu === undefined) Vistas._semillaMenu = Math.floor(Date.now() / 86400000);
    const menu = Presupuesto.menuDelDia(Vistas._semillaMenu);
    const pool = RECETAS;
    const f = menu.factor;

    document.getElementById('sec-recetas').innerHTML = `
      <div class="titulo-seccion">
        <div>
          <div class="eyebrow">Presupuesto ${Presupuesto.NIVELES[nivel].etq.toLowerCase()} · ${App.esMusculo() ? 'ganancia muscular' : 'pérdida de grasa'}</div>
          <h2>Recetas</h2>
          <p>${pool.length} recetas disponibles para tu presupuesto y tu objetivo. Ninguna pasa de 35 minutos.</p>
        </div>
      </div>

      <!-- Menú rotativo -->
      <div class="tarjeta tarjeta--acento mb-4">
        <div class="tarjeta__cab"><i class="bi bi-shuffle"></i><h3>Menú de hoy</h3>
          <button class="btn btn-linea btn-sm ms-auto" onclick="Vistas._otroMenu()">
            <i class="bi bi-arrow-repeat"></i> Otro menú</button></div>
        ${menu.comidas.map(r => `
          <div class="comida">
            <div style="flex:1;min-width:0">
              <div class="comida__t">${r.tipo}</div>
              <div class="comida__n">${r.nombre}</div>
              <div class="comida__m">${Math.round(r.kcal*f)} kcal · ${Math.round(r.p*f)} g de proteína · ${r.tiempo}</div>
            </div>
            <button class="btn btn-linea btn-sm flex-shrink-0" onclick="document.getElementById('rec-${r.id}').scrollIntoView({behavior:'smooth',block:'center'})">
              Ver</button>
          </div>`).join('')}
        <div class="macro-fila mt-3">
          <div class="macro"><div class="macro__v">${menu.total.kcal}</div><div class="macro__e">kcal</div></div>
          <div class="macro"><div class="macro__v verde">${menu.total.p}</div><div class="macro__e">prot</div></div>
          <div class="macro"><div class="macro__v">${menu.total.c}</div><div class="macro__e">carb</div></div>
          <div class="macro"><div class="macro__v">${menu.total.g}</div><div class="macro__e">grasa</div></div>
          <div class="macro"><div class="macro__v azul">${menu.total.f}</div><div class="macro__e">fibra</div></div>
        </div>
        <div class="tenue mt-3" style="font-size:.83rem">
          <i class="bi bi-info-circle"></i>
          Multiplica las cantidades de cada receta por <b class="verde">×${U.n(f,2)}</b> para ajustar el día a tus
          ${n.objetivo} kcal objetivo.
          ${menu.total.p < n.proteina ? `Te faltarían ${n.proteina - menu.total.p} g de proteína: añade dos huevos o un lácteo.` : ''}
        </div>
      </div>

      ${grupos.map(g => {
        const lista = pool.filter(r => r.tipo === g);
        if(!lista.length) return '';
        return `
        <div class="mb-4">
          <div class="eyebrow mb-2">${g}s · ${lista.length} opciones</div>
          <div class="row g-3">
            ${lista.map(r => `
              <div class="col-12 col-lg-4">
                <div class="tarjeta h-100 d-flex flex-column" id="rec-${r.id}">
                  <div class="d-flex justify-content-between align-items-start gap-2">
                    <h3 style="font-size:1.12rem">${r.nombre}</h3>
                    <span class="pill-dato flex-shrink-0"><i class="bi bi-clock"></i>${r.tiempo}</span>
                  </div>
                  <div class="macro-fila">
                    <div class="macro"><div class="macro__v">${r.kcal}</div><div class="macro__e">kcal</div></div>
                    <div class="macro"><div class="macro__v verde">${r.p}</div><div class="macro__e">prot</div></div>
                    <div class="macro"><div class="macro__v">${r.c}</div><div class="macro__e">carb</div></div>
                    <div class="macro"><div class="macro__v">${r.g}</div><div class="macro__e">grasa</div></div>
                    <div class="macro"><div class="macro__v azul">${r.f}</div><div class="macro__e">fibra</div></div>
                  </div>
                  <div class="metrica__etq mt-3 mb-1">Ingredientes</div>
                  <table class="tabla" style="font-size:.82rem">
                    ${r.ing.map(([i,c]) => `<tr><td>${i}</td><td class="num tenue-2">${c}</td></tr>`).join('')}
                  </table>
                  <div class="metrica__etq mt-3 mb-1">Preparación</div>
                  <ol class="lista-fina" style="padding-left:1.1rem;list-style:decimal">
                    ${r.prep.map(x => `<li style="padding-left:.2rem">${x}</li>`).join('')}
                  </ol>
                  <div class="divisor mt-auto"></div>
                  <div class="tenue" style="font-size:.8rem">${r.nota}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>`;
      }).join('')}

      <div class="tarjeta">
        <div class="tarjeta__cab"><i class="bi bi-info-circle"></i><h3>Cómo usar estas recetas</h3></div>
        <ul class="lista-fina">
          <li>Las cantidades son de <b>una ración estándar</b>. Escala con el factor del menú de hoy según tus calorías.</li>
          <li>La proteína de cada plato es lo que <b>no</b> se debe recortar al ajustar porciones: recorta aceite y guarnición.</li>
          <li>Alterna platos dentro de cada grupo: comer siempre lo mismo es la razón número uno por la que se abandona un plan.</li>
          <li>Si cambias de presupuesto en la sección Mercado, aquí aparecerán recetas nuevas automáticamente.</li>
        </ul>
      </div>`;
  },

  _otroMenu(){
    Vistas._semillaMenu = Math.floor(Math.random() * 9999);
    Vistas.recetas();
    Avisos.mostrar('Menú cambiado.', 'shuffle');
  },

  /* ==========================================================
     SUPLEMENTOS
     ========================================================== */
  suplementos(){
    const color = n => n === 'alto' ? 'verde' : n === 'medio' ? 'azul' : 'tenue';
    const etq = n => n === 'alto' ? 'Vale la pena' : n === 'medio' ? 'Opcional útil' : 'Baja prioridad';
    document.getElementById('sec-suplementos').innerHTML = `
      <div class="titulo-seccion">
        <div>
          <div class="eyebrow">Qué comprar y qué no</div>
          <h2>Suplementos</h2>
          <p>Ordenados por evidencia y por lo que rinde cada peso invertido.</p>
        </div>
      </div>

      <div class="row g-3">
        ${SUPLEMENTOS.map(s => `
          <div class="col-12 col-lg-6">
            <div class="tarjeta h-100">
              <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                <h3 style="font-size:1.15rem">${s.n}</h3>
                <span class="etiqueta ${s.nivel === 'alto' ? 'etiqueta--prim' : s.nivel === 'medio' ? 'etiqueta--sec' : ''} flex-shrink-0">
                  ${etq(s.nivel)}</span>
              </div>
              <div class="${color(s.nivel)}" style="font-weight:600;font-size:.95rem">${s.v}</div>
              <div class="divisor"></div>
              <div class="metrica__etq mb-1">Qué dice la evidencia</div>
              <div class="tenue-2" style="font-size:.86rem">${s.ev}</div>
              <div class="metrica__etq mt-3 mb-1">Dosis</div>
              <div class="tenue-2" style="font-size:.86rem">${s.dosis}</div>
              <div class="metrica__etq mt-3 mb-1">Costo</div>
              <div class="tenue-2" style="font-size:.86rem">${s.costo}</div>
              <div class="divisor"></div>
              <div class="tenue" style="font-size:.82rem"><i class="bi bi-info-circle"></i> ${s.contra}</div>
            </div>
          </div>`).join('')}
      </div>

      <div class="tarjeta mt-3 tarjeta--acento">
        <div class="tarjeta__cab"><i class="bi bi-clipboard-check"></i><h3>Si solo puedes comprar una cosa</h3></div>
        <p class="tenue-2 mb-2" style="font-size:.9rem">
          Creatina monohidratada. Unos 60.000 COP que rinden dos o tres meses y es el único suplemento
          de esta lista con evidencia sólida de más fuerza y mejor conservación de masa magra durante un déficit.
          Todo lo demás de la lista o ya es comida (avena, café, linaza) o tiene un efecto pequeño.
        </p>
        <p class="tenue mb-0" style="font-size:.85rem">
          Y un recordatorio incómodo: ningún suplemento se acerca al efecto de dormir 8 horas, comer la proteína
          diaria y no fallar sesiones. Si algo de eso está flojo, gasta ahí el esfuerzo antes que en la tienda.
        </p>
      </div>`;
  }
};

/* Hooks al entrar en cada sección */
Vistas.alEntrar = {
  inicio:        () => Vistas.inicio(),
  entrenamiento: () => Vistas.entrenamiento(),
  cardio:        () => Vistas.cardio(),
  alimentacion:  () => Vistas.alimentacion(),
  mercado:       () => Vistas.mercado(),
  recetas:       () => Vistas.recetas(),
  suplementos:   () => Vistas.suplementos(),
  calculadoras:  () => Calc.pintar(),
  seguimiento:   () => Seguimiento.pintar(),
  calendario:    () => Calendario.pintar(),
  estadisticas:  () => Estadisticas.pintar(),
  configuracion: () => Config.pintar()
};
