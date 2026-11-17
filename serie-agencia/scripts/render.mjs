// Render final: por cada vídeo (A, B, C) → con subtítulos, sin subtítulos, portada y descripción.
// Uso: node scripts/render.mjs [A B C]
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import {mkdirSync, rmSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {browserExecutable, raiz} from './comun.mjs';

const NOMBRES = {A: 'dia1_prompt', B: 'dia2_rosa', C: 'dia2_jordi'};
const PIE = `Por cada 1.000 seguidores bajamos un 1 % nuestros precios (condiciones en la bio). Síguenos y sal en el próximo vídeo 👇`;
const DESCRIPCION = {
  A: `Día 1 montando una agencia y consultoría de IA desde cero 🚀 Somos Kevin y Riyad, dos socios de Tarragona. Hoy, un regalo para fontaneros (y cualquier autónomo): el prompt que te ordena los presupuestos en segundos. Haz captura 📸 y revisa siempre los precios antes de enviarlo.
${PIE}

Comenta PROMPT y te lo explicamos.

Los personajes son dibujos y la voz es sintética.
`,
  B: `Día 2 montando una agencia y consultoría de IA desde cero 🚀 Tres móviles… y solo dos manos 📞📞📞 Rosa tiene una empresa de multiservicios 24/7 y, si se le escapa una llamada, ese cliente llama a otro. Un agente de voz coge la llamada, apunta los datos, agenda la cita y avisa al técnico. Y el truco gratis de hoy: un mensaje de ausencia en WhatsApp Business que pida nombre, dirección y qué ha pasado.
${PIE}

Comenta 24H y te lo explicamos.

Los personajes son dibujos y la voz es sintética.
`,
  C: `Día 2 montando una agencia y consultoría de IA desde cero 🚀 Jordi es instalador y cada día le hacen las mismas preguntas… mientras está subido a una escalera 😅 Un chatbot en la web responde las preguntas de siempre, recoge los datos del cliente y agenda la visita. Truco gratis: apunta las 10 preguntas que más te hacen y ponlas en tu web.
${PIE}

Comenta CLIMA y te lo explicamos.

Los personajes son dibujos y la voz es sintética.
`,
};

execFileSync('node', [resolve(raiz, 'scripts/preparar.mjs')], {stdio: 'inherit'});
const out = resolve(raiz, 'out');
mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: resolve(raiz, 'src/index.ts'), publicDir: resolve(raiz, 'public')});

for (const v of process.argv.slice(2).length ? process.argv.slice(2) : ['A', 'B', 'C']) {
  const base = NOMBRES[v];
  for (const [id, nombre] of [[v, base], [`${v}-sin-subs`, `${base}_sin_subs`]]) {
    const composition = await selectComposition({serveUrl, id, browserExecutable});
    const bruto = resolve(out, `${nombre}.bruto.mp4`);
    await renderMedia({composition, serveUrl, codec: 'h264', outputLocation: bruto, browserExecutable, crf: 16, pixelFormat: 'yuv420p', audioCodec: 'aac', imageFormat: 'jpeg', jpegQuality: 95, concurrency: 4});
    const mp4 = resolve(out, `${nombre}.mp4`);
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', bruto, '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30',
      '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', mp4]);
    rmSync(bruto);
    console.log(`OK ${mp4} (${(statSync(mp4).size / 1e6).toFixed(1)} MB, ${(composition.durationInFrames / 30).toFixed(2)} s)`);
  }
  // Portada: rótulo "DÍA X" con el pósit, Kevin y Riyad (sin subtítulos)
  const sin = await selectComposition({serveUrl, id: `${v}-portada`, browserExecutable});
  await renderStill({composition: sin, serveUrl, output: resolve(out, `${base}_portada.png`), frame: 40, browserExecutable});
  writeFileSync(resolve(out, `${base}_descripcion.txt`), DESCRIPCION[v]);
  console.log(`OK portada y descripción ${v}`);
}
