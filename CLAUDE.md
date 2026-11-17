# ⚠️ REPOSITORIO ARCHIVADO — NO TRABAJES AQUÍ

Todo este trabajo se volcó al repositorio compartido de Kevin y Riyad:
**`keeviinbrzz/creaci-n-de-contenido-de-daurada-labs`** (en la sesión, `/home/user/creaci-n-de-contenido-de-daurada-labs`).
Ese es el **único repositorio de trabajo**: haz allí cualquier vídeo o cambio y sigue su `CLAUDE.md`.
No edites, no renderices y no hagas commits en este repositorio. Lo de abajo es solo el histórico.

---

# Contexto para Claude Code — Dauradalabs Videos

Repositorio de los Reels de Daurada Labs (serie "Montando una agencia y consultoría de IA desde cero").
Los socios son **Kevin** y **Riyad**. Este kit viene del Claude Code de Kevin; la guía completa está en
`COMO_HACEMOS_LOS_VIDEOS.md` (léela siempre antes de crear o modificar un vídeo).

## Dónde está cada cosa
- `serie-agencia/`: proyecto Remotion. Escenas comunes en `src/comun.tsx` (Intro, Truco, Cierre, Subtitulos, Reel); vídeos en `src/VideoA|B|C.tsx`; guiones y voces en `scripts/voz.py`; render con `scripts/render.mjs`; datos del día en `config.json`.
- `personajes/`: copias reutilizables de los rigs y SVG.
- `referencias/`: imágenes oficiales de Kevin, Riyad, Lolo, Aura y el logo DL. Úsalas para comprobar que los personajes no cambian.
- `scripts/comun.mjs` define la ruta de Chromium (`CHROME`); en este entorno está en `/opt/pw-browsers/`.

## Estilo (no cambiar)
- Colores: marino `#0E1E4A`, azul `#1D3E9E`, dorado `#F2B932`; acento turquesa `#3E9AAE` → `#86D2D7`.
- Fondo: radial `#1B3577` → `#0E1E4A` con estrellitas doradas. Tipografía Inter gruesa, títulos dorados y textos blancos.
- Subtítulos: 2–5 palabras por bloque, blancos con borde oscuro, y=1248.
- Zonas seguras: nada importante en los 250 px de abajo ni en los 150 px de la derecha.
- Voces edge-tts `es-ES-AlvaroNeural`: Kevin +15Hz/+2%, Riyad +9Hz/−3%, Lolo +0Hz/−4%.

## Reglas que no se pueden saltar
- Sin precios, cifras inventadas ni promesas de resultados (solo "−1 % cada 1.000 seguidores" y el contador).
- Sin decir que hay clientes ni casos de éxito.
- Sin logos de otras marcas en ningún objeto dibujado; marcas como ChatGPT o WhatsApp Business solo en la voz.
- El agente de voz y el chatbot solo hacen lo que dice el guion.
- El usuario del seguidor solo aparece en el pósit; nunca se lee en voz alta.
- La pared del cierre solo lleva el pósit del día y el pósit vacío "¿tú?".
- "Personajes dibujados · voz sintética" solo va en la descripción del post, nunca en el vídeo.
- Personajes nuevos: SVG 600×900 con los mismos `id` que `kevin.svg`; enseñar una imagen antes de renderizar.
- No cambiar el diseño de ningún personaje.

## Entorno (cloud)
- Las sesiones deben usar el entorno **`dauradalabsvideos`**: permite `speech.platform.bing.com` (voces edge-tts) y su script de preparación hace `npm ci` en `serie-agencia/` e instala `edge-tts`.
- Si `node_modules` no existe: `cd serie-agencia && npm ci`. Si falta edge-tts: `pip install edge-tts`.
- Voces: `SSL_CERT_FILE=/root/.ccr/ca-bundle.crt python3 scripts/voz.py <VÍDEO>`.
- Los vídeos renderizados (`serie-agencia/out/`) **no se suben al repo**: se entregan al usuario como archivo.

## Estructura obligatoria de cada vídeo (8 piezas)
Ejemplo de referencia: `serie-agencia/src/VideoB.tsx` (Rosa). Cada pieza es una escena con su frase en `scripts/voz.py`.

| # | Pieza | id escena | Qué pasa |
|---|---|---|---|
| 1 | Gancho | `gancho` | El protagonista en pleno problema, con el **pósit del seguidor** en pantalla. Frase corta e impactante (B: "Tres móviles… y solo dos manos."). |
| 2 | Introducción | `intro` | Rótulo "DÍA X" con Kevin y Riyad (`Intro`): "Día N. Hoy te enseño a …, y al final un truco gratis que puedes usar hoy." |
| 3 | Cuerpo 1 | `cae` (o similar) | El problema, visual (B: se le cae un móvil → "Llamada perdida"). |
| 4 | Bucle | `bucle1` | Frase que deja en suspenso (B: "Pero lo peor no es perder la llamada…"). |
| 5 | Cuerpo 2 | `agente` | Resuelve el suspense ("…es que ese cliente llama a otro.") y entra la solución de IA (agente de voz / chatbot…). |
| 6 | Bucle | `bucle2` | "¿Y si todavía no quieres nada de esto? Para eso es el truco gratis." |
| 7 | Cuerpo 3 | `truco` | El truco gratis (`Truco`). |
| 8 | Acción | `cierre` + `bucle` | `Cierre` con "Comenta PALABRA. Y síguenos: cada mil seguidores bajamos un 1 %." y una última escena corta (`bucle`, voz de Lolo) cuya frase **empalma con el gancho** y vuelve a la misma imagen del gancho, para que el Reel haga bucle (B: "Y Rosa sigue con…" → "Tres móviles…"). |

- En `config.json`, `COLA` del vídeo ≈ 0.3 para que el final enlace sin silencio con el principio.
- La portada se saca de la composición `<V>-portada` (inicio de la escena `intro`), no del fotograma 40 del vídeo.
- Con esta estructura el vídeo sale de ~38–40 s; si hace falta acortar, recorta primero las frases propias (cuerpo 1, bucle final) y pregunta antes de tocar las que da el usuario.

## Vídeos sueltos (fuera de la serie)
Ejemplo de referencia: `serie-agencia/src/VideoLaura.tsx` (composición `laura`, "4 reseñas contra 300").
- **Sin** "DÍA X", sin pósit de seguidor y sin pared/contador de seguidores. No usan `Intro` ni `Cierre`.
- Lolo es la mascota y el narrador. Pantalla final: símbolo DL + "Comenta PALABRA" + `dauradalabs.com`, con Lolo señalando a cámara.
- 25–30 s y tono de humor. Gancho en texto arriba desde el segundo 0.
- El id del vídeo es un nombre (`laura`), no una letra: bloque en `config.json` (con `SEGUIDOR: ""`, `COLA`), entrada en `V` de `Root.tsx`, `NOMBRES`/`DESCRIPCION` en `render.mjs` (sin `${PIE}`) y guion en `voz.py`.
- Voces extra en `config.json`: `laura` (es-ES-ElviraNeural) y `paciente` (Alvaro grave y lento). Los personajes nuevos sí pueden hablar si el guion lo pide.
- Las pausas de edge-tts tras un punto son de ~0,9 s: si sobra tiempo, usa comas o dos puntos en el texto.
- Ficha de personajes nuevos: composición `ficha-laura` (`node scripts/still.mjs ficha-laura 0`).

## Cuando el usuario mande el prompt de un vídeo nuevo
1. **Guion.** Escribe las frases siguiendo la **estructura de 8 piezas** de arriba, 2,5–3 palabras/s. Comprueba las reglas de arriba (sin precios, sin clientes, sin marcas en pantalla, seguidor solo en el pósit). Si falta el usuario del seguidor, el número de seguidores o el número de día, pregúntalo.
2. **Letra nueva** (D, E…): copia el vídeo más parecido (`src/VideoB.tsx`) a `src/VideoD.tsx` y adapta sus escenas del medio y `MIN_D`. Reutiliza siempre `Intro`, `Truco`, `Cierre` y `Reel`, y usa `e.at('palabra')` para que los elementos aparezcan cuando la voz los nombra.
3. Registra el vídeo en:
   - `src/Root.tsx` (import de `public/voz/D/tiempos.json` y entrada en `V`; el tipo `'A' | 'B' | 'C'` se amplía);
   - `scripts/voz.py` → función `guion` (bloque `if video == "D"`);
   - `scripts/render.mjs` → `NOMBRES` (p. ej. `diaN_tema`) y `DESCRIPCION` (termina con `${PIE}`, "Comenta X…" y "Los personajes son dibujos y la voz es sintética.");
   - `config.json` → bloque `"D"` con `SEGUIDOR`, `SEGUIDORES_ACTUALES`, `NOMBRES_PARED: []`.
4. Genera la voz: `python3 scripts/voz.py D` (revisa el total de segundos que imprime).
5. Personaje nuevo: SVG 600×900 con los mismos `id` que `kevin.svg`, añadido a `scripts/preparar.mjs`; **enseña una imagen al usuario y espera su visto bueno antes de renderizar**.
6. Revisa fotogramas: `node scripts/still.mjs D <segundos…>` (incluye los cortes de escena) y mira las zonas seguras. Enseña los fotogramas clave al usuario.
7. Render: `node scripts/render.mjs D` (≈8 min). Comprueba los cortes con ffmpeg y entrega al usuario los 4 archivos: `.mp4`, `_sin_subs.mp4`, `_portada.png`, `_descripcion.txt`.
8. Haz commit y push del código (no de `out/`).
