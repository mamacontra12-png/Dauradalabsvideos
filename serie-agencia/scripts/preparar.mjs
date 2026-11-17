// Copia los SVG de los personajes (sin tocarlos) a un módulo TS para inyectarlos y animarlos por id.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const raiz = resolve(import.meta.dirname, '..');
const lee = (f) => readFileSync(resolve(raiz, f), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
mkdirSync(resolve(raiz, 'src/generado'), {recursive: true});
const svgs = Object.fromEntries(['kevin', 'riyad', 'rosa', 'jordi'].map((q) => [q, lee(`${q}.svg`)]));
writeFileSync(resolve(raiz, 'src/generado/personas.ts'), `// Generado por scripts/preparar.mjs desde los .svg de los personajes. No editar.\nexport const SVGS: Record<string, string> = ${JSON.stringify(svgs)};\n`);
console.log('personas.ts generado');
