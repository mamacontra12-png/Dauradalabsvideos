import React from 'react';
import {C, FUENTE} from '../tema';

const NAVY = '#0A1A44';

/** Móvil (76x136 a escala 1). `vibra` > 0 lo hace temblar; `pantalla`: llamada entrante, atendida o apagada. */
export const Movil: React.FC<{x: number; y: number; rot?: number; esc?: number; frame?: number; vibra?: number; pantalla?: 'llamada' | 'atendida' | 'apagada'}> = ({x, y, rot = 0, esc = 1, frame = 0, vibra = 0, pantalla = 'llamada'}) => {
  const jx = vibra ? Math.sin(frame * 3.1) * 3 * vibra : 0;
  const jr = vibra ? Math.sin(frame * 2.7) * 4 * vibra : 0;
  return (
    <g transform={`translate(${x + jx} ${y}) rotate(${rot + jr}) scale(${esc})`}>
      <rect x={-38} y={-68} width={76} height={136} rx={15} fill="#161A20" stroke={NAVY} strokeWidth={4} />
      <rect x={-32} y={-60} width={64} height={120} rx={9} fill={pantalla === 'apagada' ? '#0C1230' : '#17338A'} />
      {pantalla !== 'apagada' && (
        <>
          <circle cx={0} cy={-6} r={19 + (pantalla === 'llamada' ? Math.sin(frame / 3) * 2 : 0)} fill={pantalla === 'llamada' ? C.verde : C.dorado} />
          <path d="M-9,-3 C-9,-9 9,-9 9,-3 L9,1 L4,1 L4,-1 L-4,-1 L-4,1 L-9,1 Z" fill="#fff" transform="translate(0 -6) rotate(135) scale(1.1)" />
          <rect x={-18} y={30} width={36} height={8} rx={4} fill="#fff" opacity={0.7} />
        </>
      )}
    </g>
  );
};

/** Taza de café gigante con vapor animado. */
export const Taza: React.FC<{x: number; y: number; rot?: number; esc?: number; frame?: number}> = ({x, y, rot = 0, esc = 1, frame = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${esc})`}>
    <path d="M62,-30 C118,-38 118,40 58,34" stroke={NAVY} strokeWidth={24} fill="none" strokeLinecap="round" />
    <path d="M62,-30 C118,-38 118,40 58,34" stroke="#F5F1E8" strokeWidth={14} fill="none" strokeLinecap="round" />
    <rect x={-66} y={-70} width={132} height={140} rx={24} fill="#F5F1E8" stroke={NAVY} strokeWidth={4} />
    <rect x={-66} y={-8} width={132} height={34} fill={C.azul} />
    <rect x={-66} y={28} width={132} height={7} fill={C.dorado} />
    <ellipse cx={0} cy={-66} rx={58} ry={12} fill="#4A2A18" />
    <ellipse cx={-12} cy={-69} rx={26} ry={4} fill="#7A4A2A" />
    {[-24, 4, 30].map((dx, i) => (
      <path key={i} d={`M${dx},-84 Q${dx - 12 + Math.sin(frame / 6 + i) * 6},-108 ${dx},-128 Q${dx + 12 + Math.sin(frame / 6 + i) * 6},-148 ${dx},-170`} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.5 - i * 0.08} />
    ))}
  </g>
);

/** "Z" que flota (Paco durmiendo). `t` en fotogramas desde que nace. */
export const Zeta: React.FC<{x: number; y: number; t: number; tam?: number}> = ({x, y, t, tam = 70}) => {
  const k = (t % 84) / 84;
  return (
    <text
      x={x + k * 80 + Math.sin(k * 6) * 10}
      y={y - k * 170}
      fontFamily={FUENTE}
      fontWeight={900}
      fontSize={tam * (0.6 + k * 0.7)}
      fill="#BFD3FF"
      stroke={NAVY}
      strokeWidth={6}
      paintOrder="stroke fill"
      opacity={Math.sin(k * Math.PI)}
      transform={`rotate(${-10 + k * 20} ${x + k * 80} ${y - k * 170})`}
    >
      Z
    </text>
  );
};
