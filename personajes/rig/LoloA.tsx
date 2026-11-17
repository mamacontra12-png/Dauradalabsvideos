import React from 'react';
import {LoloPose, LoloExpr} from './datos';
import {LoloRig} from './Lolo';

type Obj = (m: {x: number; y: number; ang: number}) => React.ReactNode;

/** Lolo en pantalla: pose y expresión dependen del fotograma; la pose 3 fotogramas antes da el movimiento secundario. */
export const LoloA: React.FC<{
  pf: (f: number) => LoloPose;
  ef: (f: number) => LoloExpr;
  frame: number;
  x: number;
  y: number;
  s: number;
  vol?: number;
  habla?: boolean;
  fase?: number;
  uid?: string;
  objI?: Obj;
  objD?: Obj;
  frente?: React.ReactNode;
  sx?: number;
  sy?: number;
}> = ({pf, ef, frame, x, y, s, vol = 0, habla = false, fase = 0, uid = 'lolo', objI, objD, frente, sx = 1, sy = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s * sx} ${s * sy})`}>
    <LoloRig p={pf(frame)} prev={pf(frame - 3)} e={ef(frame)} frame={frame} vol={vol} habla={habla} fase={fase} uid={uid} objI={objI} objD={objD} frente={frente} />
  </g>
);
