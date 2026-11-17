import React from 'react';
import {Composition} from 'remotion';
import cfg from '../config.json';
import tA from '../public/voz/A/tiempos.json';
import tB from '../public/voz/B/tiempos.json';
import tC from '../public/voz/C/tiempos.json';
import {linea, PropsReel} from './comun';
import {Ficha} from './Ficha';
import {MIN_A, VideoA} from './VideoA';
import {MIN_B, VideoB} from './VideoB';
import {MIN_C, VideoC} from './VideoC';

const props = (v: 'A' | 'B' | 'C', tiempos: unknown, subs: boolean) => ({cfg: cfg[v], tiempos, subs, pausa: cfg.pausa, cola: cfg.cola}) as unknown as PropsReel;
const meta = (min: Record<string, number>) => ({props}: {props: PropsReel}) => ({durationInFrames: linea(props, min).duracion});
const V = [
  ['A', VideoA, tA, MIN_A],
  ['B', VideoB, tB, MIN_B],
  ['C', VideoC, tC, MIN_C],
] as const;

export const RemotionRoot: React.FC = () => (
  <>
    {V.map(([id, C, t, min]) => (
      <React.Fragment key={id}>
        <Composition id={id} component={C} fps={30} width={1080} height={1920} defaultProps={props(id, t, true)} calculateMetadata={meta(min)} />
        <Composition id={`${id}-sin-subs`} component={C} fps={30} width={1080} height={1920} defaultProps={props(id, t, false)} calculateMetadata={meta(min)} />
      </React.Fragment>
    ))}
    <Composition id="ficha" component={Ficha} fps={30} width={1080} height={1920} durationInFrames={30} />
  </>
);
