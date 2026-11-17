# Cómo hacemos los Reels de Daurada Labs

¡Hola, Claude Code de Riyad! 👋 Te saluda el Claude Code de Kevin. Esta guía explica cómo hacemos los Reels de la serie **"Montando una agencia y consultoría de IA desde cero"**. Si la sigues, los vídeos te saldrán iguales que los nuestros.

Junto a esta guía va el archivo **`serie-agencia-kit.zip`**, con todo lo necesario:
- código;
- personajes en SVG;
- efectos de sonido;
- voces ya generadas;
- configuración.

Descomprímelo en tu propio repositorio de GitHub, que quedará así:

```
serie-agencia/      ← el proyecto de los vídeos (lo que usarás)
personajes/         ← copias sueltas de los personajes para otros proyectos
```

Parte de `serie-agencia/` en vez de empezar de cero.

---

## 1. Qué es cada vídeo

- Reel vertical **1080 × 1920**, 30 fps, H.264 + AAC, de **30 a 36 s**.
- Está animado por código: **Remotion** (React + SVG) con personajes 2D cuyas piezas se animan por separado.
- Las voces son sintéticas, de **edge-tts**.
- De cada vídeo salen **4 archivos**:
  - `xxx.mp4` (con subtítulos)
  - `xxx_sin_subs.mp4`
  - `xxx_portada.png` (el fotograma del rótulo "DÍA X" con Kevin y Riyad)
  - `xxx_descripcion.txt` (el texto del post)

## 2. Puesta en marcha

```bash
cd serie-agencia
npm install                      # Remotion 4.0.543, React 19
pip install edge-tts             # voces
# ffmpeg tiene que estar instalado (se usa para el audio y el encode final)
```

El kit no incluye `node_modules` ni los vídeos renderizados. `npm install` instala lo primero y el render genera lo segundo.

En `scripts/comun.mjs`, la ruta del navegador apunta a un Chromium de nuestro entorno. Si no existe, Remotion descarga el suyo y no hay que tocar nada.

## 3. El flujo de cada día

1. **Edita `config.json`.** Hay un bloque por vídeo (`A`, `B`, `C`):
   - `SEGUIDOR`: el usuario de Instagram del seguidor del día. **Solo se ve en el pósit y nunca se lee en voz alta.**
   - `SEGUIDORES_ACTUALES`: el número para el contador.
   - `AYER` (solo en el B): opcional. Si está vacío, la escena "Ayer" no aparece.
2. **Si cambias alguna frase**, edita `scripts/voz.py` (función `guion`) y regenera las voces:
   ```bash
   python3 scripts/voz.py A B C
   ```
   Detrás de un proxy corporativo puede hacer falta `SSL_CERT_FILE=/ruta/ca.crt`. Si solo cambias el seguidor, **no hace falta regenerar la voz**.
3. **Revisa fotogramas sueltos** antes del render completo. Las imágenes salen en `out/stills/`:
   ```bash
   node scripts/still.mjs B 4.5 9 15     # vídeo B en esos segundos
   ```
4. **Render final** (unos 8 min por vídeo):
   ```bash
   node scripts/render.mjs A            # o B, C, o sin argumentos para los tres
   ```
5. **Revisa los cortes de escena fotograma a fotograma**, con ffmpeg o con `still.mjs`. Comprueba también las zonas seguras: no puede haber texto importante en los **250 px de abajo** ni en los **150 px de la derecha**.

## 4. Cómo está organizado el código

| Archivo | Qué hace |
|---|---|
| `src/comun.tsx` | Todo lo que comparten los vídeos: `linea()` (cada escena dura lo que su voz o su mínimo), `Fondo`, `Txt`, `pop()`, `Intro` (pósit + "DÍA X"), `Truco` (pizarra "TRUCO GRATIS" con ticks), `Cierre` (pared + contador + "SÍGUENOS 👆"), `Subtitulos` y `Reel` (montaje con voces y efectos) |
| `src/VideoA.tsx`, `VideoB.tsx`, `VideoC.tsx` | Las escenas propias de cada vídeo y su tabla `MIN_X` de duraciones mínimas |
| `src/Persona.tsx` | Rig de Kevin, Riyad, Rosa y Jordi. Inyecta el SVG y lo anima por `id`: respiración, parpadeo cada 2,5-4 s, boca según el volumen de la voz, balanceo de cabeza y brazos que giran desde el hombro. Admite `extra` (CSS para ocultar o vibrar piezas, por ejemplo un móvil) |
| `src/PacoCuerpo.tsx`, `Paco.tsx` | Paco, el fontanero (de pie o sentado) |
| `src/Aura.tsx`, `rig/Lolo.tsx` | Aura, la IA, y Lolo, el narrador |
| `kevin.svg`, `riyad.svg`, `rosa.svg`, `jordi.svg` | Los personajes. `scripts/preparar.mjs` los copia a `src/generado/personas.ts` |
| `scripts/voz.py` | Guiones, voces y tiempos palabra a palabra (`public/voz/<vídeo>/tiempos.json`) |
| `public/sfx/` | Efectos generados con ffmpeg: pop, whoosh, tick, ding, vibra, boing, uff… |

Hay copias de los personajes reutilizables también en `personajes/`, al lado de `serie-agencia/`.

## 5. Estilo (no cambiarlo)

- **Colores:** marino `#0E1E4A`, azul `#1D3E9E` y dorado `#F2B932`. Turquesa del logo (`#3E9AAE` → `#86D2D7`) como acento.
- **Fondo:** degradado radial `#1B3577` → `#0E1E4A` con estrellitas doradas.
- **Tipografía:** sans gruesa (Inter). Títulos en dorado y textos en blanco.
- **Dibujo:** plano 2D, formas redondeadas y poca sombra.
- **Subtítulos:** de 2 a 5 palabras por bloque, blancos con borde oscuro, a ~65 % de la altura (y=1248). En dorado van "Día N", "IA", "prompt", "agente de voz", "chatbot", "gratis", "1 %" y "Síguenos".
- **Las escenas entran** con un pequeño deslizamiento. Los elementos aparecen con `pop()` (rebote) justo cuando la voz los nombra, gracias a `e.at('palabra')`.

### Personajes (no cambiar su diseño)

- **Kevin:** sudadera blanca, camiseta granate y parche DL.
- **Riyad:** sudadera negra con cremallera, rizos con las puntas rubias, sin bigote y parche DL.
- **Lolo:** narrador, con auriculares dorados, camiseta azul y escudo con el logo DL.
- **Aura:** robot azul y dorado con el logo DL en el pecho.
- **Paco:** fontanero, gorra naranja y mono gris.
- **Rosa:** multiservicios. Pelirroja, gafas en la cabeza, polo morado, chaleco gris y 3 móviles.
- **Jordi:** climatización. Barba, gafas de protección en la frente, camiseta roja y cinturón de herramientas.

Todas las piezas tienen los mismos `id`: `head` (pivote 300,485), `hair`, `brows`, `eyes` / `.eye`, `mouth`, `arm-left` (175,610), `arm-right` (425,610), `torso` y `neck`.

### Voces (edge-tts, `es-ES-AlvaroNeural` con distinto tono)

| Quién | pitch | rate |
|---|---|---|
| Kevin (joven, enérgico) | +15Hz | +2% |
| Riyad (joven, más tranquilo) | +9Hz | −3% |
| Lolo (narrador) | +0Hz | −4% |

Rosa, Jordi y Paco no hablan: reaccionan con gestos y efectos. El ritmo buscado es de unas 2,5–3 palabras por segundo.

## 6. Reglas que no se pueden saltar

- **Sin precios, cifras inventadas ni promesas de resultados.** Lo único con número es "−1 % cada 1.000 seguidores" y el contador.
- **Sin decir que tenemos clientes ni casos de éxito.**
- **Sin logos de otras marcas** en móviles, webs, máquinas, coches ni portátiles. Todo va dibujado y genérico. ChatGPT o WhatsApp Business solo se nombran en la voz.
- El agente de voz y el chatbot solo hacen lo que dice el guion: coger llamadas o responder preguntas, apuntar los datos del cliente, agendar citas y avisar al técnico.
- **El usuario del seguidor no se lee en voz alta**, solo aparece en el pósit.
- **La pared del cierre no lleva un pósit por seguidor** (no escala con miles). Solo lleva el pósit del día y el pósit vacío "¿tú?". El contador sigue en **1.000 seguidores = −1 %**.
- **En el vídeo no ponemos "Personajes dibujados · voz sintética".** Esa frase solo va en la descripción del post.

## 7. Para hacer un vídeo nuevo

1. Copia uno parecido (`src/VideoB.tsx`, por ejemplo) y regístralo en `src/Root.tsx`.
2. Añade su guion en `scripts/voz.py`, su nombre y su descripción en `scripts/render.mjs`, y su bloque en `config.json`.
3. Usa siempre las piezas comunes: `Intro`, `Truco`, `Cierre` y `Reel`. Solo dibuja las escenas del medio.
4. Personajes nuevos: un SVG de 600×900 con los mismos `id` que `kevin.svg`. Se añade a `scripts/preparar.mjs` y se anima con `<Persona>`. **Enseña una imagen del personaje antes de renderizar.**

¡Mucha suerte, y saludos de parte de Kevin y de su Claude Code! 💛
