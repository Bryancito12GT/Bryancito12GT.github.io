# Transformación · Tu plan personal

Aplicación web que genera un plan personalizado de **pérdida de grasa** o **ganancia muscular**
a partir de los datos del usuario, con entrenamiento en casa, cardio, alimentación adaptada al
presupuesto y seguimiento completo. Funciona sin conexión.

## Qué hace

**Asistente inicial (5 pasos)**
Peso, estatura, edad, sexo y nivel de actividad → objetivo → meta y duración (3 a 10 meses) →
presupuesto mensual → resumen con calorías, macros y lo que va a recibir. Al terminar genera
todo el plan.

**Dos modos completamente distintos**

| | Pérdida de grasa | Ganancia muscular |
|---|---|---|
| Calorías | Déficit calculado según meta y plazo, con límites de seguridad | Superávit del 12 % sobre mantenimiento |
| Rutina | 4 días de fuerza + cardio progresivo + HIIT opcional | 6 días divididos por grupos musculares |
| Cardio | Progresión del 8 % semanal con descargas e intervalos | Dos salidas cortas y suaves, para no interferir |
| Periodización | Base → Intensificación → Densidad → Pico | Adaptación → Hipertrofia → Fuerza → Metabólico |
| Proteína | 2,0 g por kg de peso objetivo | 2,0 g por kg de peso actual |

Ambos con descarga cada 5 semanas y progresión de cada ejercicio a lo largo del plan.

**Alimentación por presupuesto**
Tres niveles que cambian la lista de mercado y el recetario completo:

- **Bajo** (hasta 350.000 COP): huevos, lentejas, soya texturizada, arroz, avena, papa, atún, pollo, banano.
- **Medio** (350.000–700.000): carne magra, yogur griego, queso bajo en grasa, frutos secos, más fruta y verdura.
- **Alto** (más de 700.000): salmón, res magra, camarones, aguacate, frutos rojos, aceite de oliva extra virgen, proteína en polvo.

El menú del día rota solo entre desayunos, almuerzos, cenas y snacks, y muestra el factor por el
que hay que multiplicar las porciones para cuadrar con las calorías objetivo. Los precios se
pueden editar uno a uno dentro de la app.

**Seguimiento**
Registro semanal de peso, medidas, kilómetros, sueño y ánimo; fotos comprimidas en el dispositivo;
registro de cargas por ejercicio; gráficas automáticas de todo.

**Calendario de rachas**
Cinco casillas diarias (entrenamiento, cardio, agua, sueño, alimentación). Un día cuenta como
cumplido con 3 de 5. Muestra racha actual, mejor racha, porcentaje de cumplimiento del mes,
intensidad de color por día y mensajes según la racha.

**Panel de progreso**
Peso inicial, actual y objetivo, kilos ganados o perdidos, IMC, calorías recomendadas, días
cumplidos, racha y tiempo restante, tanto en Inicio como en Estadísticas.

**Además:** calculadoras (IMC, grasa corporal por perímetros, TDEE, gasto por actividad, agua,
ritmo de cambio), cronómetro con vueltas, temporizador de descanso, temporizador de intervalos
con sonido, 20 insignias, ilustraciones animadas de cada ejercicio y frases motivacionales.

## Dos formas de usarla

**1. Archivo único** — abre `transformacion-app.html` con doble clic. Funciona en cualquier navegador.

**2. Aplicación instalable sin conexión** — la carpeta del zip es una PWA completa con Bootstrap,
Chart.js, iconos y fuentes en local. Necesita servirse por HTTP:

- En el computador: `python3 -m http.server 8080` dentro de la carpeta, y abre `http://localhost:8080`.
- Gratis y permanente: súbela a GitHub Pages, Netlify o Vercel y ábrela en el celular; Chrome
  ofrecerá "Instalar aplicación".

## Estructura

```
index.html                Estructura y contenedores de las 12 secciones
manifest.json             Datos de instalación
sw.js                     Service worker (uso sin conexión)
assets/css/estilos.css    Sistema de diseño completo
assets/js/
  nucleo.js               Estado, LocalStorage, fechas, rachas, navegación
  datos-entreno.js        Ejercicios, semana tipo de definición, técnicas
  datos-nutricion.js      Mercado básico, recetas base, suplementos
  datos-mercado.js        Mercados medio y alto, recetario ampliado, presupuestos
  plan.js                 Generador de plan: semanas, bloques, cardio, macros
  asistente.js            Asistente inicial de 5 pasos
  svg-ejercicios.js       Ilustraciones animadas por patrón de movimiento
  herramientas.js         Calculadoras, cronómetros, logros
  seguimiento.js          Registros, fotos, gráficas, calendario, ajustes
  vistas.js               Renderizado de las secciones de contenido
  app.js                  Arranque y enrutado
vendor/                   Bootstrap 5, Chart.js, Bootstrap Icons y fuentes
```

## Cómo modificarla

- **Ejercicios:** objeto `EJERCICIOS` en `datos-entreno.js`. Las rutinas son `DIAS_DEFECTO`
  (definición) y `DIAS_MUSCULO` (volumen, en `plan.js`).
- **Progresión de cardio y periodización:** funciones `Plan.cardio()` y `Plan.semanas()` en `plan.js`.
- **Productos y precios:** `MERCADO_BAJO` en `datos-nutricion.js`, `MERCADO_MEDIO` y `MERCADO_ALTO`
  en `datos-mercado.js`. También se editan desde la app.
- **Recetas:** `RECETAS_BASE` y `RECETAS_EXTRA`. Cada receta lleva `pres` (presupuesto mínimo) y
  `obj` (objetivo al que encaja).
- **Colores y tipografía:** variables al principio de `estilos.css`, en `:root`.

Si editas archivos y no ves los cambios, sube el número de versión en `CACHE` dentro de `sw.js`.

## Datos

Todo se guarda en el `localStorage` del navegador; nada sale del dispositivo. Exporta una copia
desde **Ajustes → Copia de seguridad** antes de cambiar de teléfono o borrar el historial.
Rehacer el plan desde Ajustes no borra registros, fotos ni marcas del calendario.

## Aviso

La aplicación organiza recomendaciones generales de entrenamiento y alimentación. No sustituye a
un médico ni a un nutricionista. Consulta antes de empezar si tienes alguna condición de salud,
lesiones previas o tomas medicación.
