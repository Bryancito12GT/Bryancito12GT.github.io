/* ============================================================
   seguimiento.js
   Registro semanal · fotos · gráficas · calendario ·
   estadísticas · configuración
   ============================================================ */

/* ==========================================================
   1. GRÁFICAS (Chart.js con tema oscuro)
   ========================================================== */
const Graficas = {
  instancias:{},

  base(){
    const css = getComputedStyle(document.documentElement);
    return {
      texto: css.getPropertyValue('--texto-2').trim(),
      tenue: css.getPropertyValue('--texto-3').trim(),
      linea: css.getPropertyValue('--linea-suave').trim(),
      verde: css.getPropertyValue('--verde').trim(),
      azul:  css.getPropertyValue('--azul').trim(),
      ambar: css.getPropertyValue('--ambar').trim(),
      rojo:  css.getPropertyValue('--rojo').trim()
    };
  },

  opciones(extra = {}){
    const c = Graficas.base();
    return Object.assign({
      responsive:true, maintainAspectRatio:false,
      interaction:{intersect:false, mode:'index'},
      plugins:{
        legend:{labels:{color:c.texto, boxWidth:12, boxHeight:12, font:{size:11}}},
        tooltip:{
          backgroundColor:'#0F1B21', borderColor:c.linea, borderWidth:1,
          titleColor:'#E8F2F4', bodyColor:c.texto, padding:10, displayColors:true
        }
      },
      scales:{
        x:{grid:{color:c.linea, drawBorder:false}, ticks:{color:c.tenue, font:{size:10}}},
        y:{grid:{color:c.linea, drawBorder:false}, ticks:{color:c.tenue, font:{size:10}}}
      }
    }, extra);
  },

  crear(id, config){
    const cv = document.getElementById(id);
    if(!cv) return;
    if(Graficas.instancias[id]) Graficas.instancias[id].destroy();
    Graficas.instancias[id] = new Chart(cv, config);
  },

  /* Volumen de carrera programado */
  cardio(){
    const c = Graficas.base();
    const total = x => x.mar[0] + x.jue[0] + x.sab[0] + x.dom[0];
    const sem = App.semanaActual();
    Graficas.crear('graf-cardio', {
      type:'bar',
      data:{
        labels: CARDIO.map(x => 'S' + x.n),
        datasets:[{
          label:'Km programados',
          data: CARDIO.map(total),
          backgroundColor: CARDIO.map(x =>
            App.claveBloque(x.n) === 'descarga' ? c.linea :
            (x.n === sem ? c.verde : 'rgba(76,197,245,.55)')),
          borderRadius:5, borderSkipped:false
        }]
      },
      options: Graficas.opciones()
    });
  },

  /* Peso a lo largo del plan, con línea de meta y de ritmo previsto */
  peso(){
    const c = Graficas.base(), e = App.estado;
    const regs = e.registros.filter(r => r.peso).slice().sort((a,b) => a.fecha.localeCompare(b.fecha));
    const objetivo = e.perfil.pesoObjetivo;
    Graficas.crear('graf-peso', {
      type:'line',
      data:{
        labels: regs.map(r => Fechas.bonita(r.fecha)),
        datasets:[
          {label:'Peso (kg)', data: regs.map(r => r.peso),
           borderColor:c.verde, backgroundColor:'rgba(43,224,138,.14)',
           fill:true, tension:.32, pointRadius:4, pointBackgroundColor:c.verde, borderWidth:2.5},
          {label:'Meta', data: regs.map(() => objetivo),
           borderColor:c.azul, borderDash:[6,5], pointRadius:0, borderWidth:1.5, fill:false}
        ]
      },
      options: Graficas.opciones({scales:{
        x:{grid:{color:c.linea}, ticks:{color:c.tenue, font:{size:10}}},
        y:{grid:{color:c.linea}, ticks:{color:c.tenue, font:{size:10}}, suggestedMin: objetivo - 2}
      }})
    });
  },

  medidas(){
    const c = Graficas.base();
    const regs = App.estado.registros.slice().sort((a,b) => a.fecha.localeCompare(b.fecha));
    const serie = (campo, color, etq) => ({
      label:etq, data: regs.map(r => r[campo] || null),
      borderColor:color, backgroundColor:color, tension:.3,
      pointRadius:3, borderWidth:2, spanGaps:true, fill:false
    });
    Graficas.crear('graf-medidas', {
      type:'line',
      data:{
        labels: regs.map(r => Fechas.bonita(r.fecha)),
        datasets:[
          serie('cintura', c.verde, 'Cintura'),
          serie('pecho',   c.azul,  'Pecho'),
          serie('brazo',   c.ambar, 'Brazo'),
          serie('muslo',   c.rojo,  'Muslo')
        ]
      },
      options: Graficas.opciones()
    });
  },

  km(){
    const c = Graficas.base();
    const regs = App.estado.registros.slice().sort((a,b) => a.fecha.localeCompare(b.fecha));
    Graficas.crear('graf-km', {
      type:'bar',
      data:{
        labels: regs.map(r => Fechas.bonita(r.fecha)),
        datasets:[{label:'Km de la semana', data: regs.map(r => r.km || 0),
          backgroundColor:'rgba(76,197,245,.6)', borderRadius:5, borderSkipped:false}]
      },
      options: Graficas.opciones()
    });
  },

  bienestar(){
    const c = Graficas.base();
    const regs = App.estado.registros.slice().sort((a,b) => a.fecha.localeCompare(b.fecha));
    Graficas.crear('graf-bienestar', {
      type:'line',
      data:{
        labels: regs.map(r => Fechas.bonita(r.fecha)),
        datasets:[
          {label:'Sueño (h)', data: regs.map(r => r.sueno || null),
           borderColor:c.azul, backgroundColor:'rgba(76,197,245,.12)', fill:true,
           tension:.3, pointRadius:3, borderWidth:2, spanGaps:true, yAxisID:'y'},
          {label:'Ánimo (1–5)', data: regs.map(r => r.animo || null),
           borderColor:c.verde, tension:.3, pointRadius:3, borderWidth:2, spanGaps:true, yAxisID:'y1'}
        ]
      },
      options: Graficas.opciones({scales:{
        x:{grid:{color:c.linea}, ticks:{color:c.tenue, font:{size:10}}},
        y:{position:'left', grid:{color:c.linea}, ticks:{color:c.tenue, font:{size:10}}, suggestedMin:4, suggestedMax:10},
        y1:{position:'right', grid:{drawOnChartArea:false}, ticks:{color:c.tenue, font:{size:10}}, min:0, max:5}
      }})
    });
  },

  adherencia(){
    const c = Graficas.base();
    Graficas.crear('graf-adherencia', {
      type:'bar',
      data:{
        labels: SEMANAS.map(s => 'S' + s.n),
        datasets:[{label:'Adherencia (%)', data: SEMANAS.map(s => App.adherenciaSemana(s.n)),
          backgroundColor: SEMANAS.map(s => {
            const a = App.adherenciaSemana(s.n);
            return a >= 80 ? c.verde : a >= 55 ? c.ambar : a > 0 ? c.rojo : c.linea;
          }), borderRadius:5, borderSkipped:false}]
      },
      options: Graficas.opciones({scales:{
        x:{grid:{color:c.linea}, ticks:{color:c.tenue, font:{size:10}}},
        y:{grid:{color:c.linea}, ticks:{color:c.tenue, font:{size:10}}, min:0, max:100}
      }})
    });
  },

  fuerza(ejId){
    const c = Graficas.base();
    const regs = App.estado.fuerza.filter(f => f.ej === ejId)
      .slice().sort((a,b) => a.fecha.localeCompare(b.fecha));
    Graficas.crear('graf-fuerza', {
      type:'line',
      data:{
        labels: regs.map(r => Fechas.bonita(r.fecha)),
        datasets:[
          {label:'Peso (kg)', data: regs.map(r => r.peso),
           borderColor:c.verde, tension:.3, pointRadius:4, borderWidth:2.5, yAxisID:'y'},
          {label:'Repeticiones', data: regs.map(r => r.reps),
           borderColor:c.azul, borderDash:[5,4], tension:.3, pointRadius:3, borderWidth:2, yAxisID:'y1'}
        ]
      },
      options: Graficas.opciones({scales:{
        x:{grid:{color:c.linea}, ticks:{color:c.tenue, font:{size:10}}},
        y:{position:'left', grid:{color:c.linea}, ticks:{color:c.tenue, font:{size:10}}},
        y1:{position:'right', grid:{drawOnChartArea:false}, ticks:{color:c.tenue, font:{size:10}}}
      }})
    });
  }
};

/* ==========================================================
   2. SEGUIMIENTO
   ========================================================== */
const Seguimiento = {

  pintar(){
    const e = App.estado;
    const ultimo = e.registros.length ? e.registros[e.registros.length-1] : null;
    const hoy = Fechas.hoyISO();

    document.getElementById('sec-seguimiento').innerHTML = `
      <div class="titulo-seccion">
        <div>
          <div class="eyebrow">Mismo día, misma hora, en ayunas</div>
          <h2>Seguimiento</h2>
          <p>La báscula miente día a día y dice la verdad semana a semana. Mide una vez por semana, no más.</p>
        </div>
      </div>

      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-plus-circle"></i><h3>Registro semanal</h3></div>
        <div class="row g-2">
          <div class="col-6 col-md-3"><label class="form-label">Fecha</label>
            <input class="form-control" type="date" id="r-fecha" value="${hoy}"></div>
          <div class="col-6 col-md-3"><label class="form-label">Peso (kg)</label>
            <input class="form-control" type="number" step="0.1" id="r-peso" placeholder="${ultimo?.peso || ''}"></div>
          <div class="col-6 col-md-3"><label class="form-label">Cintura (cm)</label>
            <input class="form-control" type="number" step="0.5" id="r-cintura" placeholder="${ultimo?.cintura || ''}"></div>
          <div class="col-6 col-md-3"><label class="form-label">Pecho (cm)</label>
            <input class="form-control" type="number" step="0.5" id="r-pecho" placeholder="${ultimo?.pecho || ''}"></div>
          <div class="col-6 col-md-3"><label class="form-label">Brazo (cm)</label>
            <input class="form-control" type="number" step="0.5" id="r-brazo" placeholder="${ultimo?.brazo || ''}"></div>
          <div class="col-6 col-md-3"><label class="form-label">Muslo (cm)</label>
            <input class="form-control" type="number" step="0.5" id="r-muslo" placeholder="${ultimo?.muslo || ''}"></div>
          <div class="col-6 col-md-3"><label class="form-label">Km de la semana</label>
            <input class="form-control" type="number" step="0.5" id="r-km" placeholder="0"></div>
          <div class="col-6 col-md-3"><label class="form-label">Sueño medio (h)</label>
            <input class="form-control" type="number" step="0.5" id="r-sueno" placeholder="7.5"></div>
          <div class="col-12 col-md-6"><label class="form-label">Ánimo y energía</label>
            <select class="form-select" id="r-animo">
              <option value="5">5 · Con todo</option>
              <option value="4" selected>4 · Bien</option>
              <option value="3">3 · Normal</option>
              <option value="2">2 · Cansado</option>
              <option value="1">1 · Agotado</option>
            </select></div>
          <div class="col-12 col-md-6"><label class="form-label">Notas</label>
            <input class="form-control" id="r-notas" placeholder="Molestias, cambios en la ropa, lo que notes"></div>
        </div>
        <button class="btn btn-verde mt-3" onclick="Seguimiento.guardarRegistro()">
          <i class="bi bi-save"></i> Guardar registro</button>
        <div class="tenue mt-2" style="font-size:.78rem">
          Si un dato lo dejas vacío, se copia el de la semana anterior. Lo único imprescindible es el peso.
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-12 col-lg-6"><div class="tarjeta h-100">
          <div class="tarjeta__cab"><i class="bi bi-graph-down-arrow"></i><h3>Peso</h3></div>
          <div class="lienzo-envoltura">${e.registros.length ? '<canvas id="graf-peso"></canvas>' : ''}</div>
          ${e.registros.length ? '' : U.vacio('clipboard-data','Sin registros todavía','Guarda tu primer peso arriba y la gráfica aparece sola.')}
        </div></div>
        <div class="col-12 col-lg-6"><div class="tarjeta h-100">
          <div class="tarjeta__cab"><i class="bi bi-rulers"></i><h3>Medidas</h3></div>
          <div class="lienzo-envoltura">${e.registros.length ? '<canvas id="graf-medidas"></canvas>' : ''}</div>
          ${e.registros.length ? '<div class="tenue mt-2" style="font-size:.78rem">La cintura bajando con el brazo y el pecho estables es exactamente lo que buscas: eso es perder grasa conservando músculo.</div>' : U.vacio('rulers','Sin medidas','Cintura y brazo cuentan la historia que la báscula esconde.')}
        </div></div>
      </div>

      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-table"></i><h3>Historial</h3>
          ${e.registros.length ? `<span class="ms-auto tenue" style="font-size:.78rem">${e.registros.length} registros</span>` : ''}</div>
        <div class="table-responsive" id="tabla-registros"></div>
      </div>

      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-bar-chart-steps"></i><h3>Fuerza</h3></div>
        <div class="row g-2 align-items-end mb-3">
          <div class="col-12 col-md-4"><label class="form-label">Ejercicio</label>
            <select class="form-select" id="f-ej">
              ${Object.entries(EJERCICIOS).map(([id, x]) => `<option value="${id}">${x.nombre}</option>`).join('')}
            </select></div>
          <div class="col-4 col-md-2"><label class="form-label">Peso (kg)</label>
            <input class="form-control" type="number" step="0.5" id="f-peso"></div>
          <div class="col-4 col-md-2"><label class="form-label">Reps</label>
            <input class="form-control" type="number" id="f-reps"></div>
          <div class="col-4 col-md-4">
            <button class="btn btn-verde w-100" onclick="Seguimiento.guardarFuerza()">
              <i class="bi bi-plus-lg"></i> Anotar serie</button></div>
        </div>
        <div class="lienzo-envoltura"><canvas id="graf-fuerza"></canvas></div>
        <div class="tenue mt-2" style="font-size:.78rem">
          Anota la mejor serie de cada ejercicio en cada sesión. Sin este registro no existe la sobrecarga
          progresiva: es la diferencia entre entrenar y hacer ejercicio.
        </div>
        <div id="lista-fuerza" class="mt-3"></div>
      </div>

      <div class="tarjeta">
        <div class="tarjeta__cab"><i class="bi bi-camera"></i><h3>Fotos de progreso</h3></div>
        <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
          <label class="btn btn-linea mb-0"><i class="bi bi-upload"></i> Añadir foto
            <input type="file" accept="image/*" id="f-foto" hidden></label>
          <span class="tenue" style="font-size:.78rem">
            Se guardan solo en este teléfono, comprimidas. Nunca salen del dispositivo.</span>
        </div>
        <div class="foto-red" id="rejilla-fotos"></div>
        <div class="divisor"></div>
        <div class="tenue" style="font-size:.8rem">
          Cada 4 semanas, misma hora, misma luz, misma pose y sin bombear: de frente, de lado y de espaldas.
          En cuatro meses estas fotos te van a decir más que la báscula.
        </div>
      </div>`;

    Seguimiento.pintarTabla();
    Seguimiento.pintarFotos();
    Seguimiento.pintarListaFuerza();
    if(e.registros.length){ Graficas.peso(); Graficas.medidas(); }
    Graficas.fuerza(document.getElementById('f-ej').value);
    document.getElementById('f-ej').addEventListener('change', ev => {
      Graficas.fuerza(ev.target.value);
      Seguimiento.pintarListaFuerza();
    });
    document.getElementById('f-foto').addEventListener('change', Seguimiento.subirFoto);
  },

  guardarRegistro(){
    const v = id => document.getElementById(id).value;
    const num = id => v(id) === '' ? null : Number(v(id));
    const fecha = v('r-fecha') || Fechas.hoyISO();
    const e = App.estado;
    const previo = e.registros.length ? e.registros[e.registros.length-1] : {};

    if(num('r-peso') === null && !previo.peso){
      Avisos.mostrar('Escribe al menos el peso para guardar el registro.', 'exclamation-circle');
      return;
    }
    const reg = {
      fecha,
      peso:    num('r-peso')    ?? previo.peso    ?? null,
      cintura: num('r-cintura') ?? previo.cintura ?? null,
      pecho:   num('r-pecho')   ?? previo.pecho   ?? null,
      brazo:   num('r-brazo')   ?? previo.brazo   ?? null,
      muslo:   num('r-muslo')   ?? previo.muslo   ?? null,
      km:      num('r-km')      ?? 0,
      sueno:   num('r-sueno')   ?? previo.sueno   ?? null,
      animo:   Number(v('r-animo')),
      notas:   v('r-notas')
    };
    const i = e.registros.findIndex(r => r.fecha === fecha);
    if(i >= 0) e.registros[i] = reg; else e.registros.push(reg);
    e.registros.sort((a,b) => a.fecha.localeCompare(b.fecha));

    /* sincroniza el perfil con la última medida de cintura */
    if(reg.cintura) e.perfil.cintura = reg.cintura;
    App.guardar();
    Logros.revisar();
    Avisos.mostrar('Registro guardado.', 'check-circle');
    Seguimiento.pintar();
  },

  pintarTabla(){
    const cont = document.getElementById('tabla-registros');
    const regs = App.estado.registros.slice().reverse();
    if(!regs.length){
      cont.innerHTML = U.vacio('journal','Historial vacío','Tu primer registro es el punto de partida de todo lo demás.');
      return;
    }
    cont.innerHTML = `<table class="tabla">
      <thead><tr><th>Fecha</th><th class="num">Peso</th><th class="num">Δ</th><th class="num">Cintura</th>
        <th class="num">Pecho</th><th class="num">Brazo</th><th class="num">Muslo</th>
        <th class="num">Km</th><th class="num">Sueño</th><th class="num">Ánimo</th><th></th></tr></thead>
      <tbody>${regs.map((r, i) => {
        const prev = regs[i+1];
        const d = prev && r.peso && prev.peso ? r.peso - prev.peso : null;
        return `<tr>
          <td>${Fechas.bonita(r.fecha)}</td>
          <td class="num"><b>${r.peso ? U.n(r.peso) : '—'}</b></td>
          <td class="num ${d === null ? 'tenue' : d < 0 ? 'verde' : d > 0 ? 'ambar' : 'tenue'}">
            ${d === null ? '—' : (d > 0 ? '+' : '') + U.n(d,1)}</td>
          <td class="num">${r.cintura ?? '—'}</td><td class="num">${r.pecho ?? '—'}</td>
          <td class="num">${r.brazo ?? '—'}</td><td class="num">${r.muslo ?? '—'}</td>
          <td class="num">${r.km ? U.n(r.km) : '—'}</td><td class="num">${r.sueno ?? '—'}</td>
          <td class="num">${r.animo ?? '—'}</td>
          <td class="num"><button class="btn btn-linea btn-sm" onclick="Seguimiento.borrarRegistro('${r.fecha}')"
              aria-label="Borrar registro"><i class="bi bi-trash"></i></button></td>
        </tr>${r.notas ? `<tr><td colspan="11" class="tenue" style="font-size:.76rem;padding-top:0">${U.esc(r.notas)}</td></tr>` : ''}`;
      }).join('')}</tbody></table>`;
  },

  borrarRegistro(fecha){
    App.estado.registros = App.estado.registros.filter(r => r.fecha !== fecha);
    App.guardar();
    Seguimiento.pintar();
    Avisos.mostrar('Registro borrado.', 'trash');
  },

  guardarFuerza(){
    const ej = document.getElementById('f-ej').value;
    const peso = Number(document.getElementById('f-peso').value);
    const reps = Number(document.getElementById('f-reps').value);
    if(!reps){ Avisos.mostrar('Falta el número de repeticiones.', 'exclamation-circle'); return; }
    App.estado.fuerza.push({fecha:Fechas.hoyISO(), ej, peso:peso || 0, reps});
    App.guardar();
    Logros.revisar();
    document.getElementById('f-peso').value = '';
    document.getElementById('f-reps').value = '';
    Graficas.fuerza(ej);
    Seguimiento.pintarListaFuerza();
    Avisos.mostrar('Serie anotada.', 'check-circle');
  },

  /* Botón que aparece dentro de cada ejercicio */
  registrarFuerzaRapido(id){
    Nav.ir('seguimiento');
    setTimeout(() => {
      const sel = document.getElementById('f-ej');
      if(sel){
        sel.value = id;
        sel.dispatchEvent(new Event('change'));
        document.getElementById('f-peso').focus();
        sel.closest('.tarjeta').scrollIntoView({behavior:'smooth', block:'center'});
      }
    }, 120);
  },

  pintarListaFuerza(){
    const cont = document.getElementById('lista-fuerza');
    if(!cont) return;
    const ej = document.getElementById('f-ej').value;
    const regs = App.estado.fuerza.filter(f => f.ej === ej).slice().reverse().slice(0, 8);
    if(!regs.length){
      cont.innerHTML = `<div class="tenue" style="font-size:.8rem">Sin series anotadas para este ejercicio.</div>`;
      return;
    }
    cont.innerHTML = `<div class="d-flex flex-wrap gap-2">${regs.map(r =>
      `<span class="pill-dato">${Fechas.bonita(r.fecha)} · <b>${r.peso ? U.n(r.peso)+' kg' : 'peso corporal'}</b> × ${r.reps}</span>`
    ).join('')}</div>`;
  },

  /* --- Fotos: se comprimen antes de guardarse --- */
  subirFoto(ev){
    const file = ev.target.files[0];
    if(!file) return;
    const lector = new FileReader();
    lector.onload = e => {
      const img = new Image();
      img.onload = () => {
        const max = 520;
        const esc = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement('canvas');
        cv.width = Math.round(img.width * esc);
        cv.height = Math.round(img.height * esc);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        const datos = cv.toDataURL('image/jpeg', 0.62);
        App.estado.fotos.push({fecha:Fechas.hoyISO(), img:datos});
        if(App.guardar()){
          Logros.revisar();
          Seguimiento.pintarFotos();
          Avisos.mostrar('Foto guardada en este dispositivo.', 'camera');
        }else{
          App.estado.fotos.pop();
        }
      };
      img.src = e.target.result;
    };
    lector.readAsDataURL(file);
    ev.target.value = '';
  },

  pintarFotos(){
    const cont = document.getElementById('rejilla-fotos');
    if(!cont) return;
    const f = App.estado.fotos;
    if(!f.length){
      cont.innerHTML = U.vacio('camera','Sin fotos todavía','La foto de hoy es la que vas a querer tener en la semana 17.');
      return;
    }
    cont.innerHTML = f.map((x, i) => `
      <div class="foto-item">
        <img src="${x.img}" alt="Foto de progreso del ${Fechas.bonita(x.fecha)}" loading="lazy">
        <button class="foto-item__x" onclick="Seguimiento.borrarFoto(${i})" aria-label="Borrar foto">
          <i class="bi bi-x-lg"></i></button>
        <div class="foto-item__f">${Fechas.bonita(x.fecha)}</div>
      </div>`).join('');
  },

  borrarFoto(i){
    App.estado.fotos.splice(i, 1);
    App.guardar();
    Seguimiento.pintarFotos();
  }
};

/* ==========================================================
   3. CALENDARIO
   ========================================================== */
const Calendario = {
  mes: new Date().getMonth(),
  anio: new Date().getFullYear(),

  pintar(){
    document.getElementById('sec-calendario').innerHTML = `
      <div class="titulo-seccion">
        <div>
          <div class="eyebrow">Cinco casillas al día · 3 de 5 cuentan como día cumplido</div>
          <h2>Calendario y rachas</h2>
          <p>Marcar es lo que convierte un plan en un hábito. Toca un día para abrirlo.</p>
        </div>
      </div>

      <div class="tarjeta mb-3" id="cal-rachas"></div>

      <div class="tarjeta mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <button class="btn btn-linea btn-sm" onclick="Calendario.mover(-1)" aria-label="Mes anterior"><i class="bi bi-chevron-left"></i></button>
          <h3 id="cal-titulo" style="font-size:1.3rem;text-transform:uppercase"></h3>
          <button class="btn btn-linea btn-sm" onclick="Calendario.mover(1)" aria-label="Mes siguiente"><i class="bi bi-chevron-right"></i></button>
        </div>
        <div class="cal-red mb-1">
          ${['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => `<div class="cal-cab">${d}</div>`).join('')}
        </div>
        <div class="cal-red" id="cal-red"></div>
        <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
          <div class="cinta-leyenda mb-0">
            <span class="tenue">Intensidad del color = casillas marcadas ese día</span>
          </div>
          <div class="d-flex align-items-center gap-1">
            <span class="tenue" style="font-size:.72rem">menos</span>
            ${[1,2,3,4,5].map(i => `<span class="cal-dia n${i}" style="width:16px;height:16px;min-height:0;border-radius:4px;padding:0"></span>`).join('')}
            <span class="tenue" style="font-size:.72rem">más</span>
          </div>
        </div>
      </div>

      <div class="tarjeta" id="cal-detalle"></div>`;
    Calendario.dibujar();
    Calendario.detalle(Fechas.hoyISO());
  },

  mover(n){
    Calendario.mes += n;
    if(Calendario.mes > 11){ Calendario.mes = 0; Calendario.anio++; }
    if(Calendario.mes < 0){ Calendario.mes = 11; Calendario.anio--; }
    Calendario.dibujar();
  },

  /* Mensaje que acompaña a la racha */
  mensajeRacha(r){
    if(r === 0) return ['Marca las casillas de hoy y arranca la racha. El primer día es el único difícil.', 'flag'];
    if(r < 3)   return [`${r} ${r === 1 ? 'día' : 'días'} seguidos. Todavía es frágil: lo que decide es mañana.`, 'play-circle'];
    if(r < 7)   return [`${r} días seguidos. Ya no estás empezando, estás sosteniendo.`, 'fire'];
    if(r < 14)  return [`${r} días seguidos. Una semana completa cambia lo que te crees capaz de hacer.`, 'fire'];
    if(r < 30)  return [`${r} días seguidos. A partir de aquí cuesta más romperla que mantenerla.`, 'lightning-charge-fill'];
    if(r < 60)  return [`${r} días seguidos. Esto ya no es motivación, es identidad.`, 'stars'];
    return [`${r} días seguidos. Muy poca gente llega hasta aquí. Sigue.`, 'trophy-fill'];
  },

  panelRachas(){
    const cont = document.getElementById('cal-rachas');
    if(!cont) return;
    const racha = App.rachaCumplimiento();
    const mejor = App.mejorRacha();
    const mes = App.cumplimientoMes(Calendario.anio, Calendario.mes);
    const [msg, ico] = Calendario.mensajeRacha(racha);
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    cont.innerHTML = `
      <div class="tarjeta__cab"><i class="bi bi-fire"></i><h3>Tus rachas</h3></div>
      <div class="racha-panel">
        <div class="racha-caja ${racha > 0 ? 'racha-caja--viva' : ''}">
          <div class="metrica__etq">Racha actual</div>
          <div class="racha-caja__v ${racha > 0 ? 'verde' : 'tenue'}">${racha}</div>
          <div class="tenue" style="font-size:.72rem">días seguidos</div>
        </div>
        <div class="racha-caja">
          <div class="metrica__etq">Mejor racha</div>
          <div class="racha-caja__v azul">${mejor}</div>
          <div class="tenue" style="font-size:.72rem">tu récord</div>
        </div>
        <div class="racha-caja">
          <div class="metrica__etq">Cumplimiento de ${meses[Calendario.mes]}</div>
          <div class="racha-caja__v ${mes.pct >= 80 ? 'verde' : mes.pct >= 50 ? 'ambar' : 'rojo'}">${mes.pct}<span style="font-size:.5em">%</span></div>
          <div class="tenue" style="font-size:.72rem">${mes.hechos} de ${mes.posibles} días</div>
        </div>
        <div class="racha-caja">
          <div class="metrica__etq">Días cumplidos</div>
          <div class="racha-caja__v">${App.diasCumplidos()}</div>
          <div class="tenue" style="font-size:.72rem">en todo el plan</div>
        </div>
      </div>
      <div class="mt-2 barra"><div class="barra__int" style="width:${mes.pct}%"></div></div>
      <div class="mensaje-racha"><i class="bi bi-${ico}"></i><span>${msg}</span></div>`;
  },

  dibujar(){
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    document.getElementById('cal-titulo').textContent = `${meses[Calendario.mes]} ${Calendario.anio}`;
    const primero = new Date(Calendario.anio, Calendario.mes, 1);
    const dias = new Date(Calendario.anio, Calendario.mes + 1, 0).getDate();
    let inicio = primero.getDay(); inicio = inicio === 0 ? 6 : inicio - 1;  // lunes primero
    const hoy = Fechas.hoyISO();
    let html = '';
    for(let i = 0; i < inicio; i++) html += '<div class="cal-dia vacio"></div>';
    for(let d = 1; d <= dias; d++){
      const iso = Fechas.aISO(new Date(Calendario.anio, Calendario.mes, d));
      const m = App.dia(iso);
      const claves = ['entreno','cardio','agua','sueno','dieta'];
      const n = claves.filter(k => m[k]).length;
      const puntos = claves.map(k => `<span class="cal-punto ${m[k] ? 'on' : ''}"></span>`).join('');
      html += `<div class="cal-dia n${n} ${iso === hoy ? 'hoy' : ''} ${iso === Calendario.sel ? 'sel' : ''}"
                    data-iso="${iso}" title="${n} de 5 casillas">
        ${n === 5 ? '<i class="bi bi-fire cal-dia__llama"></i>' : ''}
        <div class="cal-dia__n">${d}</div><div class="cal-puntos">${puntos}</div></div>`;
    }
    const red = document.getElementById('cal-red');
    red.innerHTML = html;
    red.querySelectorAll('.cal-dia:not(.vacio)').forEach(c =>
      c.addEventListener('click', () => {
        Calendario.sel = c.dataset.iso;
        Calendario.dibujar();
        Calendario.detalle(c.dataset.iso);
        document.getElementById('cal-detalle').scrollIntoView({behavior:'smooth', block:'center'});
      }));
    Calendario.panelRachas();
  },

  detalle(iso){
    const cont = document.getElementById('cal-detalle');
    if(!cont) return;
    Calendario.sel = iso;
    const d = App.dia(iso);
    const dia = DIAS[Fechas.diaSemana(iso) - 1];
    const items = [
      ['entreno','Entrenamiento realizado','activity'],
      ['cardio','Cardio realizado','stopwatch'],
      ['agua','Agua consumida','droplet'],
      ['sueno','Horas de sueño cumplidas','moon-stars'],
      ['dieta','Alimentación cumplida','egg-fried']
    ];
    cont.innerHTML = `
      <div class="tarjeta__cab"><i class="bi bi-calendar-day"></i><h3>${Fechas.larga(iso)}</h3></div>
      <div class="tenue mb-3" style="font-size:.85rem">Toca: <b class="tenue-2">${dia.titulo}</b> · ${dia.musculos}</div>
      <div id="cal-checks">
        ${items.map(([k, t, ico]) => `
          <div class="check-fila ${d[k] ? 'on' : ''}" data-campo="${k}">
            <div class="check-caja"><i class="bi bi-check-lg"></i></div>
            <i class="bi bi-${ico} tenue"></i><span class="check-txt">${t}</span>
          </div>`).join('')}
      </div>`;
    cont.querySelectorAll('.check-fila').forEach(f =>
      f.addEventListener('click', () => {
        const est = App.marcar(iso, f.dataset.campo);
        f.classList.toggle('on', est[f.dataset.campo]);
        const antes = App.rachaCumplimiento();
        Calendario.dibujar();
        if(App.rachaCumplimiento() > antes && App.rachaCumplimiento() % 7 === 0)
          Avisos.mostrar(`¡${App.rachaCumplimiento()} días seguidos!`, 'fire');
      }));
  }
};

/* ==========================================================
   4. ESTADÍSTICAS
   ========================================================== */
const Estadisticas = {
  pintar(){
    const e = App.estado;
    const regs = e.registros;
    const musculo = App.esMusculo();
    const peso = App.pesoActual();
    const delta = peso - e.perfil.pesoInicial;
    const semanas = Math.max(1, App.semanaActual());
    const total = App.totalSemanas();
    const ritmoReal = delta / semanas;
    const cinturaIni = regs.find(r => r.cintura)?.cintura;
    const cinturaAct = [...regs].reverse().find(r => r.cintura)?.cintura;
    const sueno = regs.filter(r => r.sueno).map(r => r.sueno);
    const suenoMedio = sueno.length ? sueno.reduce((a,b) => a+b, 0)/sueno.length : null;
    const adhTotal = App.adherencia(e.perfil.inicio, Fechas.hoyISO());
    const proyeccion = peso + ritmoReal * (total - semanas);
    const n = Calc.completo();
    const imc = Calc.imc(peso, e.perfil.altura);
    const diasRestantes = Math.max(0, App.totalDias() - App.diaDelPlan());

    document.getElementById('sec-estadisticas').innerHTML = `
      <div class="titulo-seccion">
        <div>
          <div class="eyebrow">Lo que dicen tus datos</div>
          <h2>Estadísticas</h2>
          <p>Semana ${semanas} de ${total} · ${regs.length} registros guardados</p>
        </div>
      </div>

      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-clipboard-data"></i><h3>Panel de progreso</h3></div>
        <div class="panel-red">
          <div class="panel-dato"><div class="panel-dato__e">Peso inicial</div>
            <div class="panel-dato__v">${U.n(e.perfil.pesoInicial)}<span class="metrica__unidad">kg</span></div></div>
          <div class="panel-dato"><div class="panel-dato__e">Peso actual</div>
            <div class="panel-dato__v verde">${U.n(peso)}<span class="metrica__unidad">kg</span></div></div>
          <div class="panel-dato"><div class="panel-dato__e">${musculo ? 'Peso previsto' : 'Peso objetivo'}</div>
            <div class="panel-dato__v azul">${U.n(e.perfil.pesoObjetivo)}<span class="metrica__unidad">kg</span></div></div>
          <div class="panel-dato"><div class="panel-dato__e">${delta < 0 ? 'Kilos perdidos' : 'Kilos ganados'}</div>
            <div class="panel-dato__v ${delta < 0 ? 'verde' : 'ambar'}">${U.n(Math.abs(delta),1)}<span class="metrica__unidad">kg</span></div>
            <div class="panel-dato__n">${U.n(Math.abs(ritmoReal),2)} kg por semana</div></div>
          <div class="panel-dato"><div class="panel-dato__e">IMC</div>
            <div class="panel-dato__v">${U.n(imc)}</div>
            <div class="panel-dato__n">${Calc.clasificaImc(imc)[0]}</div></div>
          <div class="panel-dato"><div class="panel-dato__e">Calorías recomendadas</div>
            <div class="panel-dato__v">${n.objetivo}</div>
            <div class="panel-dato__n">${n.proteina} g de proteína</div></div>
          <div class="panel-dato"><div class="panel-dato__e">Días cumplidos</div>
            <div class="panel-dato__v">${App.diasCumplidos()}</div>
            <div class="panel-dato__n">de ${App.diaDelPlan() + 1} transcurridos</div></div>
          <div class="panel-dato"><div class="panel-dato__e">Racha actual</div>
            <div class="panel-dato__v verde">${App.rachaCumplimiento()}</div>
            <div class="panel-dato__n">Récord: ${App.mejorRacha()} días</div></div>
          <div class="panel-dato"><div class="panel-dato__e">Tiempo restante</div>
            <div class="panel-dato__v">${Math.ceil(diasRestantes/7)}<span class="metrica__unidad">sem</span></div>
            <div class="panel-dato__n">${diasRestantes} días</div></div>
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">${delta < 0 ? 'Peso perdido' : 'Peso ganado'}</div>
          <div class="metrica__valor verde">${U.n(Math.abs(delta),1)}<span class="metrica__unidad">kg</span></div>
          <div class="tenue mt-1" style="font-size:.75rem">${U.n(Math.abs(ritmoReal),2)} kg por semana de media</div></div></div>
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Cintura</div>
          <div class="metrica__valor azul">${cinturaIni && cinturaAct ? U.n(cinturaIni - cinturaAct,1) : '—'}<span class="metrica__unidad">cm</span></div>
          <div class="tenue mt-1" style="font-size:.75rem">${cinturaAct ? 'Ahora: ' + U.n(cinturaAct) + ' cm' : 'Sin medir'}</div></div></div>
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Kilómetros</div>
          <div class="metrica__valor">${U.n(App.kmTotales(),0)}</div>
          <div class="tenue mt-1" style="font-size:.75rem">${U.n(App.kmTotales()/semanas,1)} km por semana</div></div></div>
        <div class="col-6 col-lg-3"><div class="tarjeta h-100">
          <div class="metrica__etq">Adherencia total</div>
          <div class="metrica__valor ${adhTotal >= 80 ? 'verde' : adhTotal >= 55 ? 'ambar' : 'rojo'}">${adhTotal}<span class="metrica__unidad">%</span></div>
          <div class="tenue mt-1" style="font-size:.75rem">${App.sesionesFuerza()} sesiones de fuerza</div></div></div>
      </div>

      <div class="tarjeta tarjeta--acento mb-3">
        <div class="tarjeta__cab"><i class="bi bi-binoculars"></i><h3>Proyección</h3></div>
        ${regs.length >= 2 ? `
          <p class="tenue-2 mb-2" style="font-size:.9rem">
            Al ritmo real de las últimas semanas (${U.n(Math.abs(ritmoReal),2)} kg por semana), en la semana ${total}
            estarías alrededor de <b class="verde">${U.n(proyeccion,1)} kg</b>.
            ${musculo
              ? (Math.abs(ritmoReal) > peso*0.006
                  ? 'Estás subiendo más rápido de lo que se puede construir músculo: baja 150 kcal para que la proporción de grasa no se dispare.'
                  : 'Ritmo correcto para ganar músculo con poca grasa acompañante. Si la báscula se estanca tres semanas, sube 150 kcal.')
              : (proyeccion <= e.perfil.pesoObjetivo
                  ? 'Vas por delante de tu meta. Vigila que la fuerza no baje: si cae dos semanas seguidas, sube 150 kcal.'
                  : `Eso deja <b>${U.n(Math.abs(proyeccion - e.perfil.pesoObjetivo),1)} kg</b> por encima de la meta.
                     Antes de recortar más calorías, revisa el aceite, las bebidas y los fines de semana:
                     casi siempre el déficit se escapa ahí y no en el plan.`)}
          </p>
          <div class="tenue" style="font-size:.82rem">
            ${musculo
              ? 'Ganar más de un 0,5 % del peso corporal por semana durante meses casi siempre significa más grasa que músculo.'
              : 'Un ritmo entre 0,6 y 0,9 kg por semana es el rango donde se pierde grasa rápido conservando músculo. Por encima de 1,1 kg semanales sostenidos, la pérdida de masa magra se acelera.'}
          </div>`
          : `<p class="tenue-2 mb-0" style="font-size:.9rem">
            Con dos registros semanales aparecerá aquí tu proyección real hasta la semana ${total}.</p>`}
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-6"><div class="tarjeta h-100">
          <div class="tarjeta__cab"><i class="bi bi-check2-circle"></i><h3>Adherencia semana a semana</h3></div>
          <div class="lienzo-envoltura"><canvas id="graf-adherencia"></canvas></div>
        </div></div>
        <div class="col-12 col-lg-6"><div class="tarjeta h-100">
          <div class="tarjeta__cab"><i class="bi bi-signpost-split"></i><h3>Kilómetros por semana</h3></div>
          <div class="lienzo-envoltura">${regs.length ? '<canvas id="graf-km"></canvas>' : ''}</div>
          ${regs.length ? '' : U.vacio('signpost','Sin kilómetros anotados','Apunta los km en el registro semanal.')}
        </div></div>
        <div class="col-12"><div class="tarjeta">
          <div class="tarjeta__cab"><i class="bi bi-moon-stars"></i><h3>Sueño y ánimo</h3>
            ${suenoMedio ? `<span class="ms-auto tenue" style="font-size:.78rem">Media: ${U.n(suenoMedio,1)} h</span>` : ''}</div>
          <div class="lienzo-envoltura">${regs.length ? '<canvas id="graf-bienestar"></canvas>' : ''}</div>
          ${regs.length ? `<div class="tenue mt-2" style="font-size:.8rem">
            Si el ánimo cae y el sueño baja de 7 h durante dos semanas seguidas, el problema no es la fuerza de
            voluntad: es que el plan está por encima de lo que puedes recuperar.
          </div>` : U.vacio('moon','Sin datos de descanso','El sueño explica buena parte de lo que la báscula no.')}
        </div></div>
      </div>`;

    Graficas.adherencia();
    if(App.estado.registros.length){ Graficas.km(); Graficas.bienestar(); }
  }
};

/* ==========================================================
   5. CONFIGURACIÓN
   ========================================================== */
const Config = {
  pintar(){
    const p = App.estado.perfil, a = App.estado.ajustes;
    const tam = Math.round((JSON.stringify(App.estado).length / 1024));
    document.getElementById('sec-configuracion').innerHTML = `
      <div class="titulo-seccion">
        <div>
          <div class="eyebrow">Tus datos, en tu dispositivo</div>
          <h2>Ajustes</h2>
          <p>Todo se guarda en este navegador. Nada viaja a ningún servidor.</p>
        </div>
      </div>

      <div class="tarjeta tarjeta--acento mb-3">
        <div class="tarjeta__cab"><i class="bi bi-magic"></i><h3>Tu plan</h3></div>
        <div class="panel-red mb-3">
          <div class="panel-dato"><div class="panel-dato__e">Objetivo</div>
            <div class="panel-dato__v" style="font-size:1.2rem">${App.esMusculo() ? 'Ganar músculo' : 'Perder grasa'}</div></div>
          <div class="panel-dato"><div class="panel-dato__e">Duración</div>
            <div class="panel-dato__v" style="font-size:1.2rem">${p.meses} meses</div>
            <div class="panel-dato__n">${App.totalSemanas()} semanas</div></div>
          <div class="panel-dato"><div class="panel-dato__e">Presupuesto</div>
            <div class="panel-dato__v" style="font-size:1.2rem">${Presupuesto.NIVELES[Presupuesto.actual()].etq}</div>
            <div class="panel-dato__n">${U.cop(p.presupuestoCOP || 0)} al mes</div></div>
          <div class="panel-dato"><div class="panel-dato__e">Actividad</div>
            <div class="panel-dato__v" style="font-size:1.2rem">${(Asistente.ACTIVIDADES.find(a => a.v == p.actividad) || {n:'—'}).n}</div></div>
        </div>
        <button class="btn btn-verde" onclick="Asistente.abrir(true)">
          <i class="bi bi-arrow-repeat"></i> Rehacer mi plan</button>
        <div class="tenue mt-2" style="font-size:.78rem">
          Cambiar el objetivo o la duración regenera la rutina, el cardio y las recetas. Tus registros,
          fotos y marcas del calendario no se pierden.
        </div>
      </div>

      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-person"></i><h3>Perfil y meta</h3></div>
        <div class="row g-3">
          <div class="col-12 col-md-4"><label class="form-label">Nombre</label>
            <input class="form-control" id="p-nombre" value="${U.esc(p.nombre)}" placeholder="Tu nombre"></div>
          <div class="col-6 col-md-4"><label class="form-label">Fecha de inicio del plan</label>
            <input class="form-control" type="date" id="p-inicio" value="${p.inicio}"></div>
          <div class="col-6 col-md-4"><label class="form-label">Peso inicial (kg)</label>
            <input class="form-control" type="number" step="0.1" id="p-pesoini" value="${p.pesoInicial}"></div>
          <div class="col-6 col-md-4"><label class="form-label">Peso objetivo (kg)</label>
            <input class="form-control" type="number" step="0.1" id="p-pesoobj" value="${p.pesoObjetivo}"></div>
          <div class="col-6 col-md-4"><label class="form-label">Altura (cm)</label>
            <input class="form-control" type="number" id="p-altura" value="${p.altura}"></div>
          <div class="col-6 col-md-4"><label class="form-label">Edad</label>
            <input class="form-control" type="number" id="p-edad" value="${p.edad}"></div>
        </div>
        <button class="btn btn-verde mt-3" onclick="Config.guardarPerfil()"><i class="bi bi-save"></i> Guardar perfil</button>
      </div>

      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-sliders2"></i><h3>Preferencias</h3></div>
        <div class="row g-3 align-items-end">
          <div class="col-6 col-md-4"><label class="form-label">Descanso por defecto (s)</label>
            <input class="form-control" type="number" step="15" id="p-descanso" value="${a.descanso}"></div>
          <div class="col-6 col-md-4"><label class="form-label">Meta de agua (L)</label>
            <input class="form-control" type="number" step="0.1" id="p-agua" value="${a.aguaMeta}"></div>
          <div class="col-12 col-md-4">
            <div class="check-fila ${a.sonido ? 'on' : ''}" id="p-sonido">
              <div class="check-caja"><i class="bi bi-check-lg"></i></div>
              <span class="check-txt">Sonido y vibración en los temporizadores</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tarjeta mb-3">
        <div class="tarjeta__cab"><i class="bi bi-hdd"></i><h3>Copia de seguridad</h3></div>
        <p class="tenue mb-3" style="font-size:.85rem">
          Ocupas <b class="tenue-2">${tam} KB</b> de los ~5.000 KB que permite el navegador.
          Si vas a cambiar de teléfono o borrar el historial, exporta primero: se pierde todo si no lo haces.
        </p>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-verde" onclick="Config.exportar()"><i class="bi bi-download"></i> Exportar mis datos</button>
          <label class="btn btn-linea mb-0"><i class="bi bi-upload"></i> Importar copia
            <input type="file" accept="application/json" id="p-importar" hidden></label>
          <button class="btn btn-peligro ms-auto" onclick="Config.borrarTodo()"><i class="bi bi-trash"></i> Borrar todo</button>
        </div>
      </div>

      <div class="tarjeta mb-3" id="tarjeta-instalar" style="display:none">
        <div class="tarjeta__cab"><i class="bi bi-phone"></i><h3>Instalar en el teléfono</h3></div>
        <p class="tenue mb-3" style="font-size:.85rem">
          Instálala como aplicación: se abre a pantalla completa, arranca más rápido y funciona sin datos.</p>
        <button class="btn btn-azul" id="btn-instalar"><i class="bi bi-download"></i> Instalar aplicación</button>
      </div>

      <div class="tarjeta">
        <div class="tarjeta__cab"><i class="bi bi-info-circle"></i><h3>Aviso importante</h3></div>
        <p class="tenue-2 mb-2" style="font-size:.87rem">
          Esta aplicación organiza un plan de entrenamiento y alimentación basado en recomendaciones generales.
          No sustituye a un médico ni a un nutricionista, y no conoce tu historia clínica.
        </p>
        <ul class="lista-fina lista-fina--error">
          <li>Hazte un chequeo médico antes de empezar, sobre todo por presión arterial, glucosa y perfil lipídico.</li>
          <li>Si tienes lesiones previas, problemas cardíacos, diabetes, hipertensión o tomas medicación, consulta antes de seguir este plan.</li>
          <li>Dolor articular que empeora, mareos, dolor en el pecho o falta de aire desproporcionada: para y consulta.</li>
          <li>Si la fuerza baja dos semanas seguidas, el sueño se rompe y el ánimo cae, sube calorías. No es debilidad: es información.</li>
        </ul>
      </div>`;

    document.getElementById('p-sonido').addEventListener('click', function(){
      App.estado.ajustes.sonido = !App.estado.ajustes.sonido;
      this.classList.toggle('on', App.estado.ajustes.sonido);
      App.guardar();
    });
    ['p-descanso','p-agua'].forEach(id =>
      document.getElementById(id).addEventListener('change', () => {
        App.estado.ajustes.descanso = Number(document.getElementById('p-descanso').value) || 90;
        App.estado.ajustes.aguaMeta = Number(document.getElementById('p-agua').value) || 3.2;
        App.guardar();
        Avisos.mostrar('Preferencias guardadas.', 'check-circle');
      }));
    document.getElementById('p-importar').addEventListener('change', Config.importar);
    if(window.promptInstalacion) document.getElementById('tarjeta-instalar').style.display = '';
    const btn = document.getElementById('btn-instalar');
    if(btn) btn.addEventListener('click', async () => {
      if(!window.promptInstalacion) return;
      window.promptInstalacion.prompt();
      await window.promptInstalacion.userChoice;
      window.promptInstalacion = null;
      document.getElementById('tarjeta-instalar').style.display = 'none';
    });
  },

  guardarPerfil(){
    const v = id => document.getElementById(id).value;
    Object.assign(App.estado.perfil, {
      nombre: v('p-nombre'),
      inicio: v('p-inicio') || Fechas.hoyISO(),
      pesoInicial: Number(v('p-pesoini')) || 85,
      pesoObjetivo: Number(v('p-pesoobj')) || 70,
      altura: Number(v('p-altura')) || 175,
      edad: Number(v('p-edad')) || 28
    });
    App.guardar();
    Plan.aplicar();
    Avisos.mostrar('Perfil actualizado.', 'check-circle');
    Vistas.inicio();
  },

  exportar(){
    const datos = JSON.stringify(App.estado, null, 2);
    const url = URL.createObjectURL(new Blob([datos], {type:'application/json'}));
    const a = document.createElement('a');
    a.href = url;
    a.download = `transformacion-${Fechas.hoyISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    Avisos.mostrar('Copia descargada.', 'download');
  },

  importar(ev){
    const f = ev.target.files[0];
    if(!f) return;
    const lec = new FileReader();
    lec.onload = e => {
      try{
        const datos = JSON.parse(e.target.result);
        if(!datos.perfil) throw new Error('formato');
        App.estado = Object.assign(ESTADO_INICIAL(), datos);
        App.guardar();
        Avisos.mostrar('Datos importados.', 'check-circle');
        Nav.ir('inicio');
      }catch(err){
        Avisos.mostrar('Ese archivo no es una copia válida.', 'exclamation-triangle');
      }
    };
    lec.readAsText(f);
    ev.target.value = '';
  },

  borrarTodo(){
    if(!confirm('Se borran todos tus registros, fotos y marcas. Esta acción no se puede deshacer. ¿Continuar?')) return;
    localStorage.removeItem(CLAVE);
    App.estado = ESTADO_INICIAL();
    App.guardar();
    Nav.ir('inicio');
    Avisos.mostrar('Todo borrado. Empezamos de cero.', 'arrow-counterclockwise');
  }
};
