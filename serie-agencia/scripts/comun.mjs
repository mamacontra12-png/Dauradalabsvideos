import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

export const raiz = resolve(import.meta.dirname, '..');
export const CHROME = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
export const browserExecutable = existsSync(CHROME) ? CHROME : undefined;

/** Lee props/<variante>.json y su voz ya generada y devuelve las props del vídeo. */
export const cargaProps = (ruta = 'props/llamadas-humor.json') => {
  const guion = JSON.parse(readFileSync(resolve(raiz, ruta), 'utf8'));
  const rutaTiempos = resolve(raiz, `public/variantes/${guion.id}/tiempos.json`);
  if (!existsSync(rutaTiempos)) throw new Error(`Falta la voz de "${guion.id}": ejecuta  npm run voz -- ${ruta}`);
  return {guion, tiempos: JSON.parse(readFileSync(rutaTiempos, 'utf8'))};
};
