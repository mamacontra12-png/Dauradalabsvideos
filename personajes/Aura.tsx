import React from 'react';
import {AURA_SVG, AURA_CAPAS_OK} from './generado/recursos';

/**
 * Aura a partir de assets/aura/aura.svg, sin cambiar su diseño.
 * Se anima por capas (ids del SVG) con CSS generado en cada fotograma:
 * flotar, parpadeo, pulso del halo y del orbe, saludo del brazo derecho y sonrisa que reacciona a la voz.
 */
type Props = {
  /** Fotograma global (para que todas las instancias vayan en fase). */
  frame: number;
  /** Volumen de la voz 0..1. */
  vol: number;
  /** Saluda con el brazo derecho. */
  saluda?: boolean;
  /** Ancho en píxeles (el SVG es 800x1000). */
  ancho: number;
  clase: string;
  style?: React.CSSProperties;
};

const caja = (x: number, y: number) => `transform-box: view-box; transform-origin: ${x}px ${y}px;`;

export const Aura: React.FC<Props> = ({frame, vol, saluda = false, ancho, clase, style}) => {
  const escala = ancho / 800;
  const flota = Math.sin(frame / 13) * 14;
  const sombra = 1 - Math.sin(frame / 13) * 0.08;
  const halo = 1 + Math.sin(frame / 9) * 0.035;
  const haloOp = 0.75 + Math.sin(frame / 9) * 0.25;
  const orbe = 0.55 + 0.45 * Math.abs(Math.sin(frame / 7));
  const ciclo = (frame + 17) % 84;
  const parpado = ciclo < 6 ? [1, 0.5, 0.1, 0.1, 0.5, 1][ciclo] : 1;
  const brazo = saluda ? Math.sin(frame / 3.6) * 16 - 6 : Math.sin(frame / 15) * 4;
  const ondas = saluda ? 0.4 + 0.6 * Math.abs(Math.sin(frame / 3.6)) : 0.85;
  const sonrisa = 1 + vol * 0.55;
  const boca = Math.min(1, vol * 1.15);

  const s = `.${clase}`;
  const css = AURA_CAPAS_OK
    ? `
${s} svg { width: 800px; height: 1000px; overflow: visible; display: block; }
${s} #aura-flota { ${caja(400, 500)} transform: translateY(${flota}px); }
${s} #aura-sombra { ${caja(400, 900)} transform: scale(${sombra}); }
${s} #aura-halo { ${caja(400, 500)} transform: translateY(${flota * 0.6}px) scale(${halo}); opacity: ${haloOp}; }
${s} #aura-orbe-brillo { ${caja(400, 196)} transform: scale(${0.8 + orbe * 0.5}); opacity: ${orbe}; }
${s} #aura-orbe { ${caja(400, 196)} transform: scale(${1 + orbe * 0.08}); }
${s} #aura-ojos { ${caja(400, 374)} transform: scaleY(${parpado}); }
${s} #aura-boca { ${caja(400, 432)} transform: scale(${1 + vol * 0.12}, ${sonrisa}); }
${s} #aura-boca-abierta { ${caja(400, 436)} transform: scaleY(${boca}); opacity: ${boca > 0.08 ? 1 : 0}; }
${s} #aura-brazo-der { ${caja(505, 712)} transform: rotate(${brazo}deg); }
${s} #aura-brazo-izq { ${caja(296, 712)} transform: rotate(${Math.sin(frame / 17) * 4}deg); }
${s} #aura-ondas { opacity: ${ondas}; }
${s} #aura-lazo { ${caja(296, 270)} transform: rotate(${Math.sin(frame / 11) * 4}deg); }
`
    : `${s} svg { width: 800px; height: 1000px; display: block; } ${s} { transform: translateY(${flota}px); }`;

  return (
    <div style={{position: 'absolute', width: ancho, height: ancho * 1.25, ...style}}>
      <style>{css}</style>
      <div className={clase} style={{width: 800, height: 1000, transform: `scale(${escala})`, transformOrigin: 'top left'}} dangerouslySetInnerHTML={{__html: AURA_SVG}} />
    </div>
  );
};
