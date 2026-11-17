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
