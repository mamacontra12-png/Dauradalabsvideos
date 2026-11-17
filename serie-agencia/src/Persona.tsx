import React from 'react';
import {SVGS} from './generado/personas';

/**
 * Kevin y Riyad: se inyecta su SVG tal cual (viewBox 600x900) y se anima por id con CSS en cada fotograma.
 * head: pivote (300,485) · eyes (.eye): centros (258,302) y (342,302) en coordenadas de la cabeza · arm-left (175,610) · arm-right (425,610).
 */
export type PoseP = {
  /** Giro del brazo derecho (grados; negativo = hacia arriba-afuera). */
  brazoD?: number;
  brazoI?: number;
  /** Inclinación extra de la cabeza. */
  cabeza?: number;
  /** Desplazamiento vertical extra (saltito). */
  y?: number;
};

const dur = (f: number, semilla: number) => {
  // parpadeo cada 2,5-4 s (pseudoaleatorio pero determinista), ~120 ms (4 fotogramas)
  let t = semilla % 40;
  let k = 0;
  while (t + 4 < f) {
    k++;
    t += 75 + ((k * 37 + semilla * 13) % 45);
  }
  const d = f - t;
  return d >= 0 && d < 4 ? [0.45, 0.08, 0.08, 0.45][d] : 1;
};

export const Persona: React.FC<{
  quien: 'kevin' | 'riyad' | 'rosa' | 'jordi';
  /** CSS extra (con {c} = selector del personaje), p. ej. ocultar un móvil. */
  extra?: string;
  /** Espejo horizontal. */
  espejo?: boolean;
  frame: number;
  vol: number;
  habla: boolean;
  x: number;
  y: number;
  ancho: number;
  pose?: PoseP;
  style?: React.CSSProperties;
}> = ({quien, frame, vol, habla, x, y, ancho, pose = {}, style, extra = '', espejo = false}) => {
  const cls = `p-${quien}`;
  const resp = Math.sin(frame / 18);
  const abre = habla ? Math.min(1, vol * 1.25) : 0;
  const balanceo = habla ? Math.sin(frame / 7) * 3 * Math.min(1, vol * 3 + 0.3) : Math.sin(frame / 25) * 0.8;
  const ojo = dur(frame, {kevin: 11, riyad: 47, rosa: 29, jordi: 63}[quien]);
  const caja = (px: number, py: number) => `transform-box: view-box; transform-origin: ${px}px ${py}px;`;
  const css = `
.${cls} svg { width: 600px; height: 900px; overflow: visible; display: block; }
.${cls} #${quien} { transform: translateY(${resp * 2.5 + (pose.y ?? 0)}px); }
.${cls} #torso { ${caja(300, 900)} transform: scaleY(${1 + resp * 0.004}); }
.${cls} #head { ${caja(300, 485)} transform: rotate(${balanceo + (pose.cabeza ?? 0)}deg) translate(0px, 45px); }
.${cls} #eyes .eye:nth-of-type(1) { ${caja(258, 302)} transform: scaleY(${ojo}); }
.${cls} #eyes .eye:nth-of-type(2) { ${caja(342, 302)} transform: scaleY(${ojo}); }
.${cls} #mouth { ${caja(300, 392)} transform: scale(${1 - abre * 0.08}, ${1 + abre * 1.9}); }
.${cls} #brows { transform: translateY(${-abre * 5}px); }
.${cls} #arm-right { ${caja(425, 610)} transform: rotate(${pose.brazoD ?? 0}deg); }
.${cls} #arm-left { ${caja(175, 610)} transform: rotate(${pose.brazoI ?? 0}deg); }
${extra.split('{c}').join('.' + cls)}
`;
  const k = ancho / 600;
  return (
    <div style={{position: 'absolute', left: x - ancho / 2, top: y, width: ancho, height: 900 * k, transform: espejo ? 'scaleX(-1)' : undefined, ...style}}>
      <style>{css}</style>
      <div className={cls} style={{width: 600, height: 900, transform: `scale(${k})`, transformOrigin: 'top left'}} dangerouslySetInnerHTML={{__html: SVGS[quien]}} />
    </div>
  );
};
