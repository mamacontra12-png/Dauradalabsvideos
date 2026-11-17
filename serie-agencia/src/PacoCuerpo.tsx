import React from 'react';
import {Expr, Mano, Miembro, P, PacoCabeza} from './Paco';

/** Brazo de Paco: ángulos en grados desde la vertical hacia abajo (positivo = hacia fuera del cuerpo). */
export type BrazoP = {a1: number; a2: number};
const rad = (g: number) => (g * Math.PI) / 180;

const brazo = (lado: -1 | 1, b: BrazoP) => {
  const x0 = lado * 130;
  const y0 = 30;
  const x1 = x0 + lado * Math.sin(rad(b.a1)) * 120;
  const y1 = y0 + Math.cos(rad(b.a1)) * 120;
  const x2 = x1 + lado * Math.sin(rad(b.a2)) * 110;
  const y2 = y1 + Math.cos(rad(b.a2)) * 110;
  return {d: `M${x0},${y0} L${x1},${y1} L${x2},${y2}`, mano: [x2, y2] as [number, number]};
};

/**
 * Paco entero (mono gris con solapas naranjas, gorra naranja), con el mismo diseño que su rig de cabeza.
 * Origen en la base del cuello. `sentado` dibuja las piernas hacia delante (vista frontal en el sofá).
 * objI/objD se dibujan en la mano (izquierda/derecha del espectador).
 */
export const PacoCuerpo: React.FC<{
  frame: number;
  expr: Expr;
  boca?: number;
  mirada?: [number, number];
  izq?: BrazoP;
  der?: BrazoP;
  cabezaRot?: number;
  sentado?: boolean;
  sudor?: boolean;
  objI?: (x: number, y: number) => React.ReactNode;
  objD?: (x: number, y: number) => React.ReactNode;
}> = ({frame, expr, boca = 0.4, mirada = [0, 0], izq = {a1: 14, a2: 6}, der = {a1: 14, a2: 6}, cabezaRot = 0, sentado = false, sudor = false, objI, objD}) => {
  const resp = Math.sin(frame / 16);
  const bI = brazo(-1, izq);
  const bD = brazo(1, der);
  return (
    <g>
      {sentado ? (
        <g>
          {/* muslos hacia el espectador y espinillas hasta el suelo */}
          {[-1, 1].map((s) => (
            <g key={s}>
              <rect x={s * 70 - 62} y={300} width={124} height={130} rx={50} fill={P.gris} stroke={P.cont} strokeWidth={6} />
              <rect x={s * 70 - 50} y={400} width={100} height={210} rx={30} fill={P.grisOsc} stroke={P.cont} strokeWidth={6} />
              <path d={`M${s * 70 - 62},600 Q${s * 70 - 66},650 ${s * 70 - 40},654 L${s * 70 + 70},654 Q${s * 70 + 80},620 ${s * 70 + 52},598 Z`} fill={P.bota} stroke={P.cont} strokeWidth={6} strokeLinejoin="round" />
            </g>
          ))}
        </g>
      ) : (
        <g>
          {[-1, 1].map((s) => (
            <g key={s}>
              <rect x={s * 62 - 52} y={330} width={104} height={300} rx={30} fill={P.gris} stroke={P.cont} strokeWidth={6} />
              <path d={`M${s * 62 - 56},620 Q${s * 62 - 60},670 ${s * 62 - 30},672 L${s * 62 + 80},672 Q${s * 62 + 84},640 ${s * 62 + 52},618 Z`} fill={P.bota} stroke={P.cont} strokeWidth={6} strokeLinejoin="round" />
            </g>
          ))}
        </g>
      )}
      <g transform={`translate(0 ${resp * 2})`}>
        <rect x={-26} y={-90} width={52} height={100} fill={P.pielSombra} stroke={P.cont} strokeWidth={5} />
        <path d="M-150,30 Q-146,-6 -96,-12 L96,-12 Q146,-6 150,30 L156,360 L-156,360 Z" fill={P.gris} stroke={P.cont} strokeWidth={6} strokeLinejoin="round" />
        <path d="M-40,-12 L0,40 L40,-12" fill="#fff" stroke={P.cont} strokeWidth={4} strokeLinejoin="round" />
        <rect x={-112} y={60} width={64} height={34} rx={5} fill={P.gorra} stroke={P.cont} strokeWidth={4} />
        <rect x={48} y={60} width={64} height={34} rx={5} fill={P.gorra} stroke={P.cont} strokeWidth={4} />
        <rect x={-156} y={300} width={312} height={26} fill={P.cinto} stroke={P.cont} strokeWidth={4} />
        <g transform={`rotate(${cabezaRot} 0 -60) translate(0 -168) scale(0.95)`}>
          <PacoCabeza expr={expr} frame={frame} mirada={mirada} boca={boca} fase={12} sudor={sudor} />
        </g>
        <Miembro d={bI.d} color={P.gris} ancho={52} />
        {objI?.(bI.mano[0], bI.mano[1])}
        <Mano x={bI.mano[0]} y={bI.mano[1]} />
        <Miembro d={bD.d} color={P.gris} ancho={52} />
        {objD?.(bD.mano[0], bD.mano[1])}
        <Mano x={bD.mano[0]} y={bD.mano[1]} />
      </g>
    </g>
  );
};
