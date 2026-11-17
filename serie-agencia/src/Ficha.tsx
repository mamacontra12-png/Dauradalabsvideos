import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Persona} from './Persona';

/** Hoja de personajes para aprobar los diseños nuevos (Rosa y Jordi junto a Kevin y Riyad). */
export const Ficha: React.FC = () => {
  const frame = useCurrentFrame();
  const t = {fontFamily: 'Inter, sans-serif', fontWeight: 900, color: '#F2B932', fontSize: 44, position: 'absolute' as const, textAlign: 'center' as const, width: 540};
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #1B3577, #0E1E4A)'}}>
      <div style={{...t, left: 0, top: 40}}>Rosa</div>
      <div style={{...t, left: 540, top: 40}}>Jordi</div>
      <Persona quien="rosa" frame={frame} vol={0} habla={false} x={270} y={110} ancho={520} />
      <Persona quien="jordi" frame={frame} vol={0} habla={false} x={810} y={110} ancho={520} />
      <div style={{...t, left: 0, top: 960, fontSize: 32, color: '#fff'}}>junto a Kevin y Riyad (escala)</div>
      <Persona quien="kevin" frame={frame} vol={0} habla={false} x={160} y={1100} ancho={300} />
      <Persona quien="rosa" frame={frame + 1} vol={0} habla={false} x={420} y={1100} ancho={300} extra="" style={{}} />
      <Persona quien="jordi" frame={frame + 1} vol={0} habla={false} x={680} y={1100} ancho={300} />
      <Persona quien="riyad" frame={frame} vol={0} habla={false} x={940} y={1100} ancho={300} />
    </AbsoluteFill>
  );
};
