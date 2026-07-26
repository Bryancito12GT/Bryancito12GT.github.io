/* ============================================================
   svg-ejercicios.js
   Ilustraciones vectoriales animadas, una por patrón de movimiento.
   Cada patrón guarda dos poses (inicio y final del recorrido) que se
   alternan con CSS: se ve el rango de movimiento completo sin GIFs
   externos, sin peso extra y sin depender de internet.
   ============================================================ */

const SVGEjercicios = (() => {

  /* Cada pose se describe con puntos en un lienzo de 220x200.
     tronco  : hombro -> cadera
     brazo   : hombro -> codo -> mano
     pierna  : cadera -> rodilla -> tobillo -> punta del pie
     carga   : posición del implemento (mancuerna, barra o disco)      */

  const POSES = {

    /* ---------- Tren inferior ---------- */
    sentadilla:{
      pie:'Rodilla sigue la punta del pie · torso firme',
      carga:'goblet',
      a:{cabeza:[100,34],tronco:[[100,52],[100,100]],
         brazo:[[100,52],[103,76],[110,90]],
         pierna:[[100,100],[100,140],[100,176],[118,180]],
         carga:[110,90]},
      b:{cabeza:[97,68],tronco:[[97,86],[88,132]],
         brazo:[[97,86],[100,104],[107,116]],
         pierna:[[88,132],[112,150],[100,176],[118,180]],
         carga:[107,116]}
    },
    bisagra:{
      pie:'Cadera atrás, espalda neutra, barra pegada a la pierna',
      carga:'barra',
      a:{cabeza:[100,34],tronco:[[100,52],[100,100]],
         brazo:[[100,52],[100,76],[100,100]],
         pierna:[[100,100],[100,140],[100,176],[118,180]],
         carga:[100,100]},
      b:{cabeza:[142,62],tronco:[[130,74],[86,102]],
         brazo:[[130,74],[128,98],[126,124]],
         pierna:[[86,102],[98,142],[100,176],[118,180]],
         carga:[126,124]}
    },
    zancada:{
      pie:'Peso en el talón delantero · rodilla trasera baja recta',
      carga:'mancuerna',
      a:{cabeza:[100,34],tronco:[[100,52],[100,102]],
         brazo:[[100,52],[100,78],[100,104]],
         pierna:[[100,102],[126,140],[132,176],[148,180]],
         pierna2:[[100,102],[78,146],[64,176],[52,178]],
         carga:[100,104]},
      b:{cabeza:[100,56],tronco:[[100,74],[100,124]],
         brazo:[[100,74],[100,100],[100,126]],
         pierna:[[100,124],[132,150],[134,176],[150,180]],
         pierna2:[[100,124],[76,166],[62,176],[50,178]],
         carga:[100,126]}
    },
    puente:{
      pie:'Empuja con talones · aprieta glúteo arriba, no la espalda',
      carga:'barra',
      a:{cabeza:[38,158],tronco:[[58,166],[106,168]],
         brazo:[[58,166],[74,178],[92,180]],
         pierna:[[106,168],[142,144],[152,178],[168,180]],
         carga:[106,164]},
      b:{cabeza:[38,158],tronco:[[58,166],[108,138]],
         brazo:[[58,166],[74,178],[92,180]],
         pierna:[[108,138],[142,142],[152,178],[168,180]],
         carga:[108,132]}
    },
    gemelo:{
      pie:'Sube lento, pausa 1 s arriba, baja en 3 s buscando estirar',
      carga:'mancuerna',
      a:{cabeza:[100,36],tronco:[[100,54],[100,102]],
         brazo:[[100,54],[100,78],[100,104]],
         pierna:[[100,102],[100,142],[100,176],[120,180]],
         carga:[100,104]},
      b:{cabeza:[100,20],tronco:[[100,38],[100,86]],
         brazo:[[100,38],[100,62],[100,88]],
         pierna:[[100,86],[100,128],[104,166],[122,180]],
         carga:[100,88]}
    },

    /* ---------- Empuje ---------- */
    empujeVertical:{
      pie:'Costillas abajo, no arquees la espalda al subir',
      carga:'barra',
      a:{cabeza:[100,34],tronco:[[100,54],[100,104]],
         brazo:[[100,54],[82,68],[100,50]],
         pierna:[[100,104],[100,142],[100,176],[118,180]],
         carga:[100,50]},
      b:{cabeza:[100,34],tronco:[[100,54],[100,104]],
         brazo:[[100,54],[98,32],[100,10]],
         pierna:[[100,104],[100,142],[100,176],[118,180]],
         carga:[100,10]}
    },
    empujeHorizontal:{
      pie:'Escápulas atrás y abajo · codos a unos 45° del torso',
      carga:'mancuerna',
      a:{cabeza:[42,150],tronco:[[62,160],[112,162]],
         brazo:[[62,160],[54,140],[74,138]],
         pierna:[[112,162],[142,140],[158,176],[174,180]],
         carga:[74,138]},
      b:{cabeza:[42,150],tronco:[[62,160],[112,162]],
         brazo:[[62,160],[64,134],[66,110]],
         pierna:[[112,162],[142,140],[158,176],[174,180]],
         carga:[66,110]}
    },
    flexion:{
      pie:'Cuerpo en tabla: glúteo y abdomen apretados todo el tiempo',
      carga:'ninguna',
      a:{cabeza:[156,126],tronco:[[144,140],[98,152]],
         brazo:[[144,140],[150,158],[152,178]],
         pierna:[[98,152],[62,166],[38,178],[30,170]]},
      b:{cabeza:[164,146],tronco:[[150,158],[100,163]],
         brazo:[[150,158],[166,166],[152,178]],
         pierna:[[100,163],[64,171],[38,178],[30,170]]}
    },
    fondo:{
      pie:'Hombros lejos de las orejas · baja hasta 90° de codo',
      carga:'ninguna',
      a:{cabeza:[100,44],tronco:[[100,62],[100,112]],
         brazo:[[100,62],[86,84],[84,110]],
         pierna:[[100,112],[136,124],[168,150],[180,146]]},
      b:{cabeza:[100,74],tronco:[[100,92],[100,142]],
         brazo:[[100,92],[78,104],[84,110]],
         pierna:[[100,142],[136,150],[168,162],[180,158]]}
    },
    tricepsSobreCabeza:{
      pie:'Codos apuntando al frente y quietos · solo se mueve el antebrazo',
      carga:'mancuerna',
      a:{cabeza:[100,36],tronco:[[100,54],[100,104]],
         brazo:[[100,54],[104,24],[82,40]],
         pierna:[[100,104],[100,142],[100,176],[118,180]],
         carga:[82,40]},
      b:{cabeza:[100,36],tronco:[[100,54],[100,104]],
         brazo:[[100,54],[104,24],[108,4]],
         pierna:[[100,104],[100,142],[100,176],[118,180]],
         carga:[108,4]}
    },
    elevacionLateral:{
      pie:'Sube con el codo, no con la mano · sin impulso de cadera',
      carga:'mancuerna',
      vista:'frontal',
      a:{cabeza:[110,32],tronco:[[110,54],[110,110]],
         brazo:[[110,54],[88,78],[84,104]],
         brazo2:[[110,54],[132,78],[136,104]],
         pierna:[[110,110],[96,146],[94,178],[80,180]],
         pierna2:[[110,110],[124,146],[126,178],[140,180]],
         carga:[84,104],carga2:[136,104]},
      b:{cabeza:[110,32],tronco:[[110,54],[110,110]],
         brazo:[[110,54],[84,58],[58,60]],
         brazo2:[[110,54],[136,58],[162,60]],
         pierna:[[110,110],[96,146],[94,178],[80,180]],
         pierna2:[[110,110],[124,146],[126,178],[140,180]],
         carga:[58,60],carga2:[162,60]}
    },

    /* ---------- Tracción ---------- */
    remo:{
      pie:'Lleva el codo al bolsillo · no gires el torso al jalar',
      carga:'barra',
      a:{cabeza:[142,64],tronco:[[130,76],[86,102]],
         brazo:[[130,76],[134,102],[136,128]],
         pierna:[[86,102],[98,142],[100,176],[118,180]],
         carga:[136,128]},
      b:{cabeza:[142,64],tronco:[[130,76],[86,102]],
         brazo:[[130,76],[112,90],[134,104]],
         pierna:[[86,102],[98,142],[100,176],[118,180]],
         carga:[134,104]}
    },
    traccionVertical:{
      pie:'Baja los hombros primero, después jala con los codos',
      carga:'ninguna',
      a:{cabeza:[100,60],tronco:[[100,78],[100,124]],
         brazo:[[100,78],[100,50],[100,22]],
         pierna:[[100,124],[86,158],[104,176],[120,172]]},
      b:{cabeza:[100,40],tronco:[[100,58],[100,104]],
         brazo:[[100,58],[78,42],[100,22]],
         pierna:[[100,104],[86,140],[104,160],[120,156]]}
    },
    curl:{
      pie:'Codo pegado al costado · baja en 3 s controlando',
      carga:'mancuerna',
      a:{cabeza:[100,36],tronco:[[100,54],[100,104]],
         brazo:[[100,54],[100,80],[100,106]],
         pierna:[[100,104],[100,142],[100,176],[118,180]],
         carga:[100,106]},
      b:{cabeza:[100,36],tronco:[[100,54],[100,104]],
         brazo:[[100,54],[100,80],[82,62]],
         pierna:[[100,104],[100,142],[100,176],[118,180]],
         carga:[82,62]}
    },

    /* ---------- Core ---------- */
    plancha:{
      pie:'Cadera a la altura de los hombros · respira sin soltar el abdomen',
      carga:'ninguna',
      a:{cabeza:[162,132],tronco:[[150,146],[104,156]],
         brazo:[[150,146],[152,166],[168,172]],
         pierna:[[104,156],[68,166],[40,178],[32,170]]},
      b:{cabeza:[162,136],tronco:[[150,150],[104,159]],
         brazo:[[150,150],[152,168],[168,174]],
         pierna:[[104,159],[68,169],[40,178],[32,170]]}
    },
    abdomen:{
      pie:'Curva la columna vértebra a vértebra, no tires del cuello',
      carga:'ninguna',
      a:{cabeza:[46,152],tronco:[[64,162],[112,166]],
         brazo:[[64,162],[54,146],[44,140]],
         pierna:[[112,166],[146,166],[176,168],[186,160]]},
      b:{cabeza:[58,128],tronco:[[72,142],[112,166]],
         brazo:[[72,142],[60,128],[52,120]],
         pierna:[[112,166],[140,140],[150,110],[160,104]]}
    },

    /* ---------- Cardio ---------- */
    correr:{
      pie:'Zancada corta y frecuente · pisada bajo la cadera',
      carga:'ninguna',
      a:{cabeza:[104,36],tronco:[[102,54],[98,104]],
         brazo:[[102,54],[118,72],[124,92]],
         brazo2:[[102,54],[86,72],[78,58]],
         pierna:[[98,104],[124,132],[118,168],[134,174]],
         pierna2:[[98,104],[78,136],[86,170],[70,176]]},
      b:{cabeza:[104,36],tronco:[[102,54],[98,104]],
         brazo:[[102,54],[86,72],[80,92]],
         brazo2:[[102,54],[118,72],[126,58]],
         pierna:[[98,104],[76,130],[74,166],[60,172]],
         pierna2:[[98,104],[122,138],[112,170],[128,176]]}
    },
    movilidad:{
      pie:'Estira sin rebotar · 30–45 s por posición, respirando lento',
      carga:'ninguna',
      a:{cabeza:[128,64],tronco:[[118,78],[86,106]],
         brazo:[[118,78],[126,102],[130,126]],
         pierna:[[86,106],[104,142],[110,176],[128,180]]},
      b:{cabeza:[140,88],tronco:[[128,100],[88,110]],
         brazo:[[128,100],[136,124],[142,150]],
         pierna:[[88,110],[110,146],[112,176],[130,180]]}
    }
  };

  /* --------- Dibujo de una pose --------- */
  function polilinea(pts, clase){
    if(!pts) return '';
    return `<polyline class="${clase}" points="${pts.map(p=>p.join(',')).join(' ')}"/>`;
  }

  function carga(tipo, pos, vistaFrontal){
    if(!pos || tipo==='ninguna') return '';
    const [x,y] = pos;
    if(tipo==='barra'){
      return `<g class="carga"><rect x="${x-30}" y="${y-3}" width="60" height="6" rx="3"/>
        <rect x="${x-34}" y="${y-11}" width="7" height="22" rx="2"/>
        <rect x="${x+27}" y="${y-11}" width="7" height="22" rx="2"/></g>`;
    }
    if(tipo==='goblet'){
      return `<g class="carga"><rect x="${x-9}" y="${y-11}" width="18" height="22" rx="5"/></g>`;
    }
    // mancuerna
    const ancho = vistaFrontal ? 4 : 5;
    return `<g class="carga"><rect x="${x-13}" y="${y-4}" width="26" height="8" rx="4"/>
      <rect x="${x-17}" y="${y-9}" width="${ancho+2}" height="18" rx="3"/>
      <rect x="${x+11}" y="${y-9}" width="${ancho+2}" height="18" rx="3"/></g>`;
  }

  function pose(p, tipoCarga, clase, vistaFrontal){
    return `<g class="${clase}">
      <circle class="cabeza" cx="${p.cabeza[0]}" cy="${p.cabeza[1]}" r="10"/>
      ${polilinea(p.pierna2,'hueso')}
      ${polilinea(p.brazo2,'hueso')}
      ${polilinea(p.tronco,'hueso foco')}
      ${polilinea(p.pierna,'hueso')}
      ${polilinea(p.brazo,'hueso')}
      ${carga(tipoCarga,p.carga,vistaFrontal)}
      ${carga(tipoCarga,p.carga2,vistaFrontal)}
    </g>`;
  }

  /**
   * Devuelve el SVG animado de un patrón de movimiento.
   * @param {string} patron  clave de POSES
   * @param {boolean} conPie incluir la línea de consejo bajo el dibujo
   */
  function dibujar(patron, conPie = true){
    const d = POSES[patron] || POSES.movilidad;
    const frontal = d.vista === 'frontal';
    const svg = `<svg class="mov" data-mov="${patron}" viewBox="0 0 220 200" role="img"
        aria-label="Ilustración del movimiento: ${patron}">
      <line class="suelo" x1="8" y1="186" x2="212" y2="186"/>
      ${pose(d.a, d.carga, 'fase fase-a', frontal)}
      ${pose(d.b, d.carga, 'fase fase-b', frontal)}
    </svg>`;
    return conPie && d.pie ? `<div>${svg}<div class="mov-pie">${d.pie}</div></div>` : svg;
  }

  return { dibujar, POSES };
})();
