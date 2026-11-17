import React from 'react';

/**
 * Paco, el fontanero (personaje de dibujos): gorra naranja con visera, patillas, bigote castaño, mono gris con
 * solapas naranjas. Aquí solo la cabeza y piezas sueltas; cada escena (src/fondos) las coloca y las anima.
 */
export const P = {
  piel: '#EFBE97',
  pielSombra: '#D79A72',
  cont: '#2A1D1A',
  gorra: '#F26A1B',
  gorraOsc: '#C74D0C',
  gorraLuz: '#FF9A55',
  gris: '#7D838B',
  grisOsc: '#5E646C',
  grisCl: '#A0A6AE',
  bigote: '#4B2A17',
  pelo: '#3B2314',
  bota: '#2E3237',
  cinto: '#8A5A33',
};

export type Expr = 'agobiado' | 'enfadado' | 'aliviado' | 'dormido' | 'atento';

const parpadeo = (frame: number, fase: number) => {
  const c = (frame + fase) % 96;
  return c < 5 ? [1, 0.5, 0.1, 0.5, 1][c] : 1;
};

/** Miembro con contorno (dos trazos superpuestos). */
export const Miembro: React.FC<{d: string; color: string; ancho: number; contorno?: string}> = ({d, color, ancho, contorno = P.cont}) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={contorno} strokeWidth={ancho + 12} />
    <path d={d} stroke={color} strokeWidth={ancho} />
  </g>
);

export const Mano: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 27}) => (
  <circle cx={x} cy={y} r={r} fill={P.piel} stroke={P.cont} strokeWidth={6} />
);

type Props = {
  expr: Expr;
  frame: number;
  /** Desplazamiento de las pupilas (px, máx. ±9). */
  mirada?: [number, number];
  /** Apertura de la boca 0..1 (agobiado). */
  boca?: number;
  fase?: number;
  sudor?: boolean;
};

/** Cabeza centrada en (0,0); ~216 px de ancho. Colócala con <g transform=...>. */
export const PacoCabeza: React.FC<Props> = ({expr, frame, mirada = [0, 0], boca = 0.4, fase = 0, sudor = false}) => {
  const p = parpadeo(frame, fase);
  const cerrados = expr === 'aliviado' || expr === 'dormido';
  const cejaIn = expr === 'enfadado' ? -28 : expr === 'agobiado' ? -62 : -52;
  const cejaOut = expr === 'enfadado' ? -58 : expr === 'agobiado' ? -38 : -50;
  const [mx, my] = mirada;
  const risa = 1 + Math.sin(frame / 2.4) * 0.12;

  return (
    <g>
      {/* Orejas y cara */}
      <circle cx={-100} cy={16} r={22} fill={P.piel} stroke={P.cont} strokeWidth={6} />
      <circle cx={100} cy={16} r={22} fill={P.piel} stroke={P.cont} strokeWidth={6} />
      <ellipse cx={0} cy={6} rx={100} ry={116} fill={P.piel} stroke={P.cont} strokeWidth={7} />
      {/* Patillas */}
      <path d="M-96,-30 C-104,0 -100,30 -90,44 C-92,14 -88,-10 -84,-30 Z" fill={P.pelo} />
      <path d="M96,-30 C104,0 100,30 90,44 C92,14 88,-10 84,-30 Z" fill={P.pelo} />

      {/* Gorra naranja de béisbol (más alta: la visera deja ver las cejas) */}
      <g transform="translate(0 -24)">
      <path d="M-108,-14 C-116,-112 -58,-156 0,-156 C58,-156 116,-112 108,-14 Q0,-46 -108,-14 Z" fill={P.gorra} stroke={P.cont} strokeWidth={7} strokeLinejoin="round" />
      <path d="M0,-152 C-6,-110 -6,-70 0,-34" stroke={P.gorraOsc} strokeWidth={4} fill="none" opacity={0.5} />
      <path d="M-66,-118 Q-30,-146 28,-142" stroke={P.gorraLuz} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.7} />
      <circle cx={0} cy={-156} r={8} fill={P.gorraOsc} stroke={P.cont} strokeWidth={4} />
      <path d="M-112,-18 Q-10,-62 108,-26 Q184,-20 196,0 Q150,16 96,10 Q0,-30 -104,4 Q-116,-4 -112,-18 Z" fill="#FF8A3D" stroke={P.cont} strokeWidth={7} strokeLinejoin="round" />
      <path d="M-70,-24 Q10,-46 96,-18" stroke="#FFC08A" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.8} />

      </g>

      <g transform="translate(0 10)">
      {/* Mejillas */}
      <circle cx={-68} cy={44} r={18} fill="#F0907F" opacity={0.42} />
      <circle cx={68} cy={44} r={18} fill="#F0907F" opacity={0.42} />

      {/* Cejas y ojos */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <path d={`M${s * 76},${cejaOut} Q${s * 46},${(cejaOut + cejaIn) / 2 - 10} ${s * 16},${cejaIn}`} stroke={P.pelo} strokeWidth={14} fill="none" strokeLinecap="round" />
          {cerrados ? (
            <path d={expr === 'dormido' ? `M${s * 40 - 24},0 Q${s * 40},22 ${s * 40 + 24},0` : `M${s * 40 - 24},6 Q${s * 40},-24 ${s * 40 + 24},6`} stroke={P.cont} strokeWidth={9} fill="none" strokeLinecap="round" />
          ) : (
            <g transform={`translate(${s * 40} -4) scale(1 ${p})`}>
              <ellipse rx={25} ry={29} fill="#fff" stroke={P.cont} strokeWidth={5} />
              <circle cx={mx} cy={my} r={11.5} fill="#1B2440" />
              <circle cx={mx + 4} cy={my - 4} r={4} fill="#fff" />
            </g>
          )}
        </g>
      ))}

      {/* Nariz y bigote */}
      <ellipse cx={0} cy={26} rx={17} ry={13} fill={P.pielSombra} stroke={P.cont} strokeWidth={4} />
      <path d="M-70,54 C-62,24 -14,26 0,42 C14,26 62,24 70,54 C56,70 16,64 0,54 C-16,64 -56,70 -70,54 Z" fill={P.bigote} stroke={P.cont} strokeWidth={5} strokeLinejoin="round" />

      {/* Boca */}
      {expr === 'agobiado' && (
        <ellipse cx={0} cy={86} rx={17 + boca * 4} ry={5 + boca * 13} fill="#4F1212" stroke={P.cont} strokeWidth={4} />
      )}
      {expr === 'dormido' && (
        <g>
          <path d="M-30,84 Q0,104 30,84" stroke={P.cont} strokeWidth={7} fill="none" strokeLinecap="round" />
          <ellipse cx={0} cy={92} rx={9 + boca * 4} ry={3 + boca * 9} fill="#4F1212" />
        </g>
      )}
      {expr === 'atento' && <path d="M-26,84 Q0,100 26,84" stroke={P.cont} strokeWidth={7} fill="none" strokeLinecap="round" />}
      {expr === 'enfadado' && <path d="M-26,92 Q0,72 26,92" stroke={P.cont} strokeWidth={8} fill="none" strokeLinecap="round" />}
      {expr === 'aliviado' && (
        <g transform={`translate(0 74) scale(1 ${risa}) translate(0 -74)`}>
          <path d="M-38,74 Q0,82 38,74 Q32,114 0,116 Q-32,114 -38,74 Z" fill="#4F1212" stroke={P.cont} strokeWidth={5} strokeLinejoin="round" />
          <path d="M-31,76 Q0,84 31,76 L29,90 Q0,96 -29,90 Z" fill="#fff" />
          <ellipse cx={0} cy={106} rx={15} ry={8} fill="#E86B6B" />
        </g>
      )}

      </g>

      {/* Gotas de sudor */}
      {sudor &&
        [0, 1].map((i) => {
          const t = ((frame * 2.2 + i * 45) % 90) / 90;
          return (
            <path
              key={i}
              d="M0,-14 C10,2 10,16 0,16 C-10,16 -10,2 0,-14 Z"
              fill="#BFE6FF"
              stroke="#6FB3E0"
              strokeWidth={3}
              transform={`translate(${i ? 92 : -90} ${-50 + t * 110})`}
              opacity={Math.sin(t * Math.PI)}
            />
          );
        })}
    </g>
  );
};
