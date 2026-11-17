// Uso: node scripts/still.mjs <composicion> <segundos...>   → out/stills/<comp>_fNNNN.png
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {browserExecutable, raiz} from './comun.mjs';

execFileSync('node', [resolve(raiz, 'scripts/preparar.mjs')], {stdio: 'inherit'});
const [id, ...seg] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: resolve(raiz, 'src/index.ts'), publicDir: resolve(raiz, 'public')});
const comp = await selectComposition({serveUrl, id, browserExecutable});
mkdirSync(resolve(raiz, 'out/stills'), {recursive: true});
for (const s of seg.length ? seg : ['0']) {
  const fr = Math.min(comp.durationInFrames - 1, Math.round(Number(s) * 30));
  await renderStill({composition: comp, serveUrl, output: resolve(raiz, `out/stills/${id}_f${String(fr).padStart(4, '0')}.png`), frame: fr, browserExecutable, scale: 0.5});
}
console.log(`${id}: ${(comp.durationInFrames / 30).toFixed(2)} s`);
