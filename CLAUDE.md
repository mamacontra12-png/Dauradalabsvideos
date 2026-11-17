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

## Cuando el usuario mande el prompt de un vídeo nuevo
1. **Guion.** Escribe las frases (intro → personaje/problema → solución → truco gratis → cierre), 2,5–3 palabras/s, 30–36 s en total. Comprueba las reglas de arriba (sin precios, sin clientes, sin marcas en pantalla, seguidor solo en el pósit). Si falta el usuario del seguidor, el número de seguidores o el número de día, pregúntalo.
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
