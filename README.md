# Dauradalabs Videos

Reels de la serie **"Montando una agencia y consultoría de IA desde cero"** de **Daurada Labs** (Kevin y Riyad, Tarragona).

Vídeos verticales 1080×1920 a 30 fps, de 30 a 36 s, animados por código con **Remotion** (React + SVG) y con voces sintéticas de **edge-tts**.

## Estructura

```
serie-agencia/              ← proyecto Remotion de los vídeos (se trabaja aquí)
personajes/                 ← copias sueltas de los personajes para otros proyectos
referencias/                ← imágenes de referencia: Kevin, Riyad, Lolo, Aura y logo DL
COMO_HACEMOS_LOS_VIDEOS.md  ← guía completa: flujo, estilo, personajes, voces y reglas
CLAUDE.md                   ← contexto y reglas para Claude Code
```

## Arranque rápido

```bash
cd serie-agencia
npm install                      # Remotion 4.0.543, React 19
pip install edge-tts             # voces
# requiere ffmpeg

# 1. Editar config.json (SEGUIDOR, SEGUIDORES_ACTUALES, AYER)
# 2. Si cambian frases: editar scripts/voz.py y regenerar
python3 scripts/voz.py A B C
# 3. Revisar fotogramas sueltos (salen en out/stills/)
node scripts/still.mjs B 4.5 9 15
# 4. Render final (A, B, C o sin argumentos para los tres)
node scripts/render.mjs A
```

Cada vídeo genera: `xxx.mp4`, `xxx_sin_subs.mp4`, `xxx_portada.png` y `xxx_descripcion.txt`.

Lee **[COMO_HACEMOS_LOS_VIDEOS.md](COMO_HACEMOS_LOS_VIDEOS.md)** antes de tocar nada.
