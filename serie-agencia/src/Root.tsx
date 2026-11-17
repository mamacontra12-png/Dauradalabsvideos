import React from 'react';
import {Composition} from 'remotion';
import cfg from '../config.json';
import tA from '../public/voz/A/tiempos.json';
import tB from '../public/voz/B/tiempos.json';
import tC from '../public/voz/C/tiempos.json';
import tL from '../public/voz/laura/tiempos.json';
import {linea, PropsReel} from './comun';
import {Ficha} from './Ficha';
import {MIN_A, VideoA} from './VideoA';
import {MIN_B, VideoB} from './VideoB';
import {MIN_C, VideoC} from './VideoC';
import {FichaLaura, MIN_L, VideoLaura} from './VideoLaura';

type Id = 'A' | 'B' | 'C' | 'laura';
const props = (v: Id, tiempos: unknown, subs: boolean) => ({cfg: cfg[v], tiempos, subs, pausa: cfg.pausa, cola: (cfg[v] as {COLA?: number}).COLA ?? cfg.cola}) as unknown as PropsReel;
const meta = (min: Record<string, number>) => ({props}: {props: PropsReel}) => ({durationInFrames: linea(props, min).duracion});
const V = [
  ['A', VideoA, tA, MIN_A],
  ['B', VideoB, tB, MIN_B],
  ['C', VideoC, tC, MIN_C],
  // vídeos sueltos (fuera de la serie)
  ['laura', VideoLaura, tL, MIN_L],
] as const;

export const RemotionRoot: React.FC = () => (
  <>
    {V.map(([id, C, t, min]) => (
      <React.Fragment key={id}>
        <Composition id={id} component={C} fps={30} width={1080} height={1920} defaultProps={props(id, t, true)} calculateMetadata={meta(min)} />
        <Composition id={`${id}-sin-subs`} component={C} fps={30} width={1080} height={1920} defaultProps={props(id, t, false)} calculateMetadata={meta(min)} />
        <Composition id={`${id}-portada`} component={C} fps={30} width={1080} height={1920} durationInFrames={60} defaultProps={{...props(id, t, false), portada: true}} />
      </React.Fragment>
    ))}
    <Composition id="ficha" component={Ficha} fps={30} width={1080} height={1920} durationInFrames={30} />
    <Composition id="ficha-laura" component={FichaLaura} fps={30} width={1080} height={1920} durationInFrames={1} />
  </>
);
