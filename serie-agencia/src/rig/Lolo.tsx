import React from 'react';
import {DlMark} from '../DlMark';
import {Boca, Brazo, LoloExpr, LoloPose} from './datos';

/**
 * LOLO: rig por piezas independientes (estilo plano de la referencia: colores sólidos, sin contornos oscuros).
 * Piezas: torso (camiseta), escudo, cuello, cabeza, orejas, pelo + mechón, cejas, ojos (pupila + párpado),
 * ojeras, mejillas, nariz, boca (8 formas), auriculares con micro, brazos (hombro-codo-mano) y manos.
 * Movimiento secundario: pelo, mechón, micro y cascos reaccionan al movimiento de la cabeza.
 * Respiración y parpadeo (cada 2,5-3,5 s) incluidos. Devuelve un <g>: se coloca dentro de cualquier <svg>.
 * Sistema de coordenadas: (0,0) = línea de hombros, centro; la cabeza está en (0,-170); la cintura en y=330.
 */
export const K = {
  piel: '#F3C6A0',
  pielS: '#E3AE86',
  pelo: '#2F1D14',
  camisa: '#3C7BFF',
  manga: '#2358D6',
  cuello: '#E8EEFF',
  oro1: '#FFE08A',
  oro2: '#F2B92E',
  oro3: '#C98A10',
  navy: '#0A1A44',
  labio: '#8B3A2B',
  boca: '#5B1818',
  lengua: '#E86B6B',
  rubor: '#F0907F',
  ojera: '#B987A6',
};

export const HC = -170; // centro de la cabeza
const PIVOTE = -52; // pivote de la cabeza en el cuello
const L1 = 130;
const L2 = 120;
const rad = (g: number) => (g * Math.PI) / 180;

/** Geometría de un brazo (hombro en x0,y0): codo y mano. */
export const geomBrazo = (x0: number, y0: number, b: Brazo) => {
  const l1 = L1 * (1 - 0.1 * b.z);
  const l2 = L2 * (1 - 0.35 * b.z);
  const ex = x0 + l1 * Math.cos(rad(b.a1));
  const ey = y0 + l1 * Math.sin(rad(b.a1));
  return {ex, ey, hx: ex + l2 * Math.cos(rad(b.a2)), hy: ey + l2 * Math.sin(rad(b.a2))};
};

/** Parpadeo: 3 intervalos distintos (2,5 / 3,5 / 2,1 s) para que no sea mecánico. */
const parpadeo = (frame: number, fase: number) => {
  const c = (((frame + fase) % 243) + 243) % 243;
  const f = (s: number) => (c >= s && c < s + 5 ? [0.55, 0.12, 0.04, 0.12, 0.55][c - s] : null);
  return f(0) ?? f(75) ?? f(180) ?? 1;
};

type Obj = (m: {x: number; y: number; ang: number}) => React.ReactNode;

const ManoSvg: React.FC<{hx: number; hy: number; ang: number; b: Brazo; lado: 1 | -1}> = ({hx, hy, ang, b, lado}) => {
  const esc = 1 + 0.7 * b.z;
  const dedo = (
    <rect x={-8.5} y={-76} width={17} height={62} rx={8.5} fill={K.piel} />
  );
  return (
    <g transform={`translate(${hx} ${hy}) rotate(${ang + 90}) scale(${esc})`}>
      {b.mano === 'abierta' && (
        <>
          {[-21, -7, 7, 21].map((x, i) => (
            <rect key={i} x={x - 6.5} y={[-60, -68, -66, -56][i]} width={13} height={50} rx={6.5} fill={K.piel} />
          ))}
          <ellipse cx={-lado * 29} cy={-6} rx={9} ry={20} transform={`rotate(${-lado * 32} ${-lado * 29} -6)`} fill={K.piel} />
          <rect x={-27} y={-20} width={54} height={46} rx={20} fill={K.piel} />
          <path d="M-14,-52 L-14,-18 M0,-58 L0,-18 M14,-56 L14,-18" stroke={K.pielS} strokeWidth={2.5} strokeLinecap="round" />
        </>
      )}
      {b.mano === 'senala' && (
        <>
          {dedo}
          <circle r={27} fill={K.piel} />
          <ellipse cx={-lado * 23} cy={-6} rx={9} ry={16} transform={`rotate(${-lado * 25} ${-lado * 23} -6)`} fill={K.piel} />
          <path d="M-12,-2 L12,-2" stroke={K.pielS} strokeWidth={3} strokeLinecap="round" />
        </>
      )}
      {b.mano === 'camara' && (
        <>
          <g stroke={K.oro2} strokeWidth={6} strokeLinecap="round" opacity={0.9}>
            {[-50, -25, 0, 25, 50].map((a) => (
              <line key={a} x1={0} y1={-54} x2={0} y2={-74} transform={`rotate(${a})`} />
            ))}
          </g>
          <circle r={31} fill={K.piel} />
          <ellipse cx={-lado * 25} cy={-4} rx={9} ry={17} fill={K.piel} />
          <rect x={-11} y={-64} width={22} height={52} rx={11} fill={K.piel} />
          <ellipse cx={0} cy={-56} rx={7} ry={9} fill="#FBE3D2" />
          <path d="M-9,-26 L9,-26" stroke={K.pielS} strokeWidth={3} strokeLinecap="round" />
        </>
      )}
      {b.mano === 'puno' && (
        <>
          <circle r={28} fill={K.piel} />
          <ellipse cx={-lado * 24} cy={-8} rx={9} ry={17} transform={`rotate(${-lado * 22} ${-lado * 24} -8)`} fill={K.piel} />
          <path d="M-14,-10 L14,-10 M-14,2 L14,2" stroke={K.pielS} strokeWidth={3} strokeLinecap="round" />
        </>
      )}
    </g>
  );
};

const BrazoSvg: React.FC<{x0: number; y0: number; b: Brazo; lado: 1 | -1; obj?: Obj}> = ({x0, y0, b, lado, obj}) => {
  const {ex, ey, hx, hy} = geomBrazo(x0, y0, b);
  const mx = x0 + (ex - x0) * 0.58;
  const my = y0 + (ey - y0) * 0.58;
  return (
    <g>
      <path d={`M${x0},${y0} L${ex},${ey} L${hx},${hy}`} stroke={K.piel} strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${x0},${y0} L${mx},${my}`} stroke={K.manga} strokeWidth={78} strokeLinecap="round" fill="none" />
      <path d={`M${x0 + (mx - x0) * 0.3},${y0 + (my - y0) * 0.3} L${mx},${my}`} stroke="#1B49B5" strokeWidth={78} strokeLinecap="round" fill="none" opacity={0.0} />
      {obj?.({x: hx, y: hy, ang: b.a2})}
      <ManoSvg hx={hx} hy={hy} ang={b.a2} b={b} lado={lado} />
    </g>
  );
};

const BocaSvg: React.FC<{tipo: Boca; abre: number}> = ({tipo, abre}) => {
  const y = 66;
  const dientes = (w: number, h: number, yy: number) => <path d={`M${-w},${yy} Q0,${yy + 8} ${w},${yy} L${w - 2},${yy + h} Q0,${yy + h + 6} ${-w + 2},${yy + h} Z`} fill="#fff" />;
  switch (tipo) {
    case 'cerrada':
      return <path d={`M-20,${y} Q0,${y + 6} 20,${y}`} stroke={K.labio} strokeWidth={7} strokeLinecap="round" fill="none" />;
    case 'sonrisa':
      return <path d={`M-30,${y - 6} Q0,${y + 26} 30,${y - 6}`} stroke={K.labio} strokeWidth={8} strokeLinecap="round" fill="none" />;
    case 'sonrisaAbierta':
      return (
        <g>
          <path d={`M-38,${y - 8} Q0,${y} 38,${y - 8} Q34,${y + 36} 0,${y + 38} Q-34,${y + 36} -38,${y - 8} Z`} fill={K.boca} />
          {dientes(33, 14, y - 6)}
          <ellipse cx={0} cy={y + 30} rx={15} ry={6} fill={K.lengua} />
          <path d={`M-38,${y - 8} Q0,${y} 38,${y - 8} Q34,${y + 36} 0,${y + 38} Q-34,${y + 36} -38,${y - 8} Z`} fill="none" stroke={K.labio} strokeWidth={6} strokeLinejoin="round" />
        </g>
      );
    case 'abierta': {
      if (abre < 0.07) return <path d={`M-26,${y - 2} Q0,${y + 14} 26,${y - 2}`} stroke={K.labio} strokeWidth={8} strokeLinecap="round" fill="none" />;
      const h = 10 + abre * 32;
      const d = `M-27,${y - 4} Q0,${y - 8} 27,${y - 4} Q25,${y + h} 0,${y + h + 2} Q-25,${y + h} -27,${y - 4} Z`;
      return (
        <g>
          <path d={d} fill={K.boca} />
          <clipPath id="cl-boca">
            <path d={d} />
          </clipPath>
          <g clipPath="url(#cl-boca)">
            <rect x={-30} y={y - 8} width={60} height={9 + abre * 4} fill="#fff" />
            <ellipse cx={0} cy={y + h} rx={16} ry={6 + abre * 8} fill={K.lengua} />
          </g>
          <path d={d} fill="none" stroke={K.labio} strokeWidth={6} strokeLinejoin="round" />
        </g>
      );
    }
    case 'o':
      return <ellipse cx={0} cy={y + 8} rx={13} ry={16} fill={K.boca} stroke={K.labio} strokeWidth={5} />;
    case 'mueca':
      return (
        <g>
          <path d={`M-36,${y - 8} Q0,${y - 16} 36,${y - 8} Q38,${y + 26} 0,${y + 30} Q-38,${y + 26} -36,${y - 8} Z`} fill={K.boca} stroke={K.labio} strokeWidth={6} strokeLinejoin="round" />
          <path d={`M-31,${y - 8} Q0,${y - 14} 31,${y - 8} L30,${y + 6} Q0,${y + 2} -30,${y + 6} Z`} fill="#fff" />
          <path d={`M-16,${y - 12} L-16,${y + 4} M0,${y - 13} L0,${y + 3} M16,${y - 12} L16,${y + 4}`} stroke="#C9CED8" strokeWidth={2.5} />
        </g>
      );
    case 'resignada':
      return <path d={`M-26,${y + 6} Q-10,${y - 2} 4,${y + 4} Q16,${y + 9} 28,${y - 3}`} stroke={K.labio} strokeWidth={8} strokeLinecap="round" fill="none" />;
    case 'preocupada':
      return <path d={`M-26,${y + 10} Q0,${y - 8} 26,${y + 10}`} stroke={K.labio} strokeWidth={8} strokeLinecap="round" fill="none" />;
  }
};

const Ojo: React.FC<{id: string; cx: number; abierto: number; esc: number; pupila: [number, number]; pr: number; ojera: number}> = ({id, cx, abierto, esc, pupila, pr, ojera}) => {
  const cy = 8;
  const rx = 19 * esc;
  const ry = 22 * esc;
  const ojeras = ojera > 0.02 && (
    <g opacity={0.75 * ojera}>
      <path d={`M${cx - 22},${cy + 18} Q${cx},${cy + 44} ${cx + 22},${cy + 18} Q${cx},${cy + 32} ${cx - 22},${cy + 18} Z`} fill={K.ojera} />
    </g>
  );
  if (abierto < 0) {
    return (
      <g>
        {ojeras}
        <path d={`M${cx - 20},${cy + 8} Q${cx},${cy - 18} ${cx + 20},${cy + 8}`} stroke={K.pelo} strokeWidth={8} strokeLinecap="round" fill="none" />
      </g>
    );
  }
  const lid = cy - ry + 2 * ry * (1 - abierto);
  const px = Math.max(-8, Math.min(8, pupila[0]));
  const py = Math.max(-9, Math.min(9, pupila[1]));
  return (
    <g>
      {ojeras}
      <clipPath id={id}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      </clipPath>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" />
      <g clipPath={`url(#${id})`}>
        <circle cx={cx + px} cy={cy + py + 2} r={10.5 * pr} fill="#1B2440" />
        <circle cx={cx + px + 4} cy={cy + py - 3} r={3.6 * pr} fill="#fff" />
        {abierto < 0.97 && <rect x={cx - rx - 2} y={cy - ry - 4} width={2 * rx + 4} height={lid - (cy - ry - 4)} fill={K.piel} />}
      </g>
      {abierto < 0.97 && <path d={`M${cx - rx},${lid} Q${cx},${lid + 6} ${cx + rx},${lid}`} stroke={abierto < 0.2 ? K.pelo : K.pielS} strokeWidth={abierto < 0.2 ? 6 : 4} strokeLinecap="round" fill="none" />}
    </g>
  );
};

type Props = {
  p: LoloPose;
  e: LoloExpr;
  frame: number;
  /** Volumen de la voz 0..1 (con `habla`, mueve la boca). */
  vol?: number;
  habla?: boolean;
  /** Pose unos fotogramas antes: da el movimiento secundario (pelo, mechón, micro). */
  prev?: LoloPose;
  fase?: number;
  uid?: string;
  objI?: Obj;
  objD?: Obj;
  /** Objeto delante de todo (p. ej. un móvil entre la oreja y el hombro), en coordenadas del rig. */
  frente?: React.ReactNode;
  /** Pone el escudo del pecho (por defecto sí). */
  escudo?: boolean;
};

export const LoloRig: React.FC<Props> = ({p, e, frame, vol = 0, habla = false, prev, fase = 0, uid = 'lolo', objI, objD, frente, escudo = true}) => {
  const resp = Math.sin(frame / 14);
  const sh = p.hombros;
  const ty = p.torso.y + resp * 1.4;
  const sxT = p.torso.sx * (1 + resp * 0.004);
  const syT = p.torso.sy * (1 + resp * 0.012);
  const cab = p.cabeza;
  // Movimiento secundario: el pelo y el micro se retrasan respecto a la cabeza
  const sway = prev ? (prev.cabeza.rot - cab.rot) * 0.9 + (prev.cabeza.x - cab.x) * 0.12 : Math.sin(frame / 9) * 1.6;
  const swayY = prev ? (prev.cabeza.y - cab.y) * 0.25 : Math.sin(frame / 7) * 0.8;
  const abierto = parpadeo(frame, fase);
  const oI = e.ojoI < 0 ? -1 : e.ojoI * abierto;
  const oD = e.ojoD < 0 ? -1 : e.ojoD * abierto;
  const abre = habla ? Math.min(1, vol * 1.15) : 0;
  const boca: Boca = habla ? 'abierta' : e.boca;
  const t0 = 18 - sh;
  const t1 = -10 - sh * 0.5;
  const hombroY = 34 - sh;
  const arms = (
    <>
      <BrazoSvg x0={-136} y0={hombroY} b={p.izq} lado={-1} obj={objI} />
      <BrazoSvg x0={136} y0={hombroY} b={p.der} lado={1} obj={objD} />
    </>
  );
  const cejaTrans = (cx: number, c: {y: number; rot: number}, lado: 1 | -1) => `translate(${cx} ${-30 + c.y}) rotate(${c.rot * lado})`;

  return (
    <g transform={`translate(0 ${ty}) rotate(${p.torso.rot} 0 330) translate(0 330) scale(${sxT} ${syT}) translate(0 -330)`}>
      <defs>
        <linearGradient id={`${uid}-oro`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={K.oro1} />
          <stop offset="0.5" stopColor={K.oro2} />
          <stop offset="1" stopColor={K.oro3} />
        </linearGradient>
      </defs>

      {/* Cuello */}
      <rect x={-30} y={-96} width={60} height={110} fill={K.pielS} />
      {/* Torso: camiseta azul con cuello blanco */}
      <path d={`M-150,${t0} Q-142,${t1 + 6} -70,${t1} Q0,${t1 - 7} 70,${t1} Q142,${t1 + 6} 150,${t0} L142,340 L-142,340 Z`} fill={K.camisa} />
      <path d={`M-46,${t1 + 3} Q0,${t1 + 36} 46,${t1 + 3} Q0,${t1 + 20} -46,${t1 + 3} Z`} fill={K.cuello} />
      {escudo && (
        <g transform="translate(-72 52) scale(0.655)">
          <path d="M110,6 L210,40 V120 C210,180 168,222 110,244 C52,222 10,180 10,120 V40 Z" fill={`url(#${uid}-oro)`} stroke="#7A5208" strokeWidth={5} strokeLinejoin="round" />
          <path d="M110,28 L190,55 V122 C190,170 156,204 110,222 C64,204 30,170 30,122 V55 Z" fill={K.navy} />
          {/* Símbolo oficial DL (dl_mark.svg) centrado: ~70 % del ancho del escudo */}
          <g transform="translate(110 128)">
            <DlMark ancho={154} uid={`${uid}-dl`} trazo={17} />
          </g>
        </g>
      )}

      {!p.delante && arms}

      {/* Cabeza */}
      <g transform={`translate(${cab.x} ${cab.y - resp * 2 + sh * 0.5}) rotate(${cab.rot} 0 ${PIVOTE}) translate(0 ${HC}) scale(${cab.sx} ${cab.sy})`}>
        <circle cx={-94} cy={14} r={20} fill={K.piel} />
        <circle cx={94} cy={14} r={20} fill={K.piel} />
        <ellipse cx={0} cy={0} rx={94} ry={106} fill={K.piel} />
        {/* mejillas y nariz */}
        <circle cx={-56} cy={50} r={19} fill={K.rubor} opacity={0.18 + e.rubor * 0.34} />
        <circle cx={56} cy={50} r={19} fill={K.rubor} opacity={0.18 + e.rubor * 0.34} />
        <path d="M4,22 Q17,40 3,45" stroke={K.pielS} strokeWidth={6} strokeLinecap="round" fill="none" />
        {/* ojos, cejas y boca */}
        <Ojo id={`${uid}-oi`} cx={-36} abierto={oI} esc={e.ojoEsc} pupila={e.pupila} pr={e.pupilaR} ojera={e.ojeras} />
        <Ojo id={`${uid}-od`} cx={36} abierto={oD} esc={e.ojoEsc} pupila={e.pupila} pr={e.pupilaR} ojera={e.ojeras} />
        <g transform={cejaTrans(-36, e.cejaI, 1)}>
          <path d="M-22,4 Q0,-10 22,-1" stroke={K.pelo} strokeWidth={9} strokeLinecap="round" fill="none" />
        </g>
        <g transform={cejaTrans(36, e.cejaD, -1)}>
          <path d="M-22,-1 Q0,-10 22,4" stroke={K.pelo} strokeWidth={9} strokeLinecap="round" fill="none" />
        </g>
        <BocaSvg tipo={boca} abre={abre} />

        {/* Pelo y mechón (movimiento secundario) */}
        <g transform={`rotate(${sway * 0.35} 0 -60) translate(0 ${swayY * 0.4})`}>
          <path d="M-96,-16 C-106,-92 -52,-116 0,-116 C52,-116 106,-92 96,-16 C90,-44 70,-58 44,-66 C24,-46 -22,-46 -44,-66 C-70,-58 -90,-44 -96,-16 Z" fill={K.pelo} />
        </g>
        <g transform={`rotate(${sway * 1.5} 4 -112)`}>
          <path d="M-8,-110 C4,-140 34,-142 44,-118 C28,-128 12,-124 -8,-110 Z" fill={K.pelo} />
        </g>

        {/* Auriculares dorados con micro */}
        <g transform={`rotate(${-sway * 0.3} 0 -60)`}>
          <path d="M-106,0 C-120,-156 120,-156 106,0" stroke={`url(#${uid}-oro)`} strokeWidth={16} strokeLinecap="round" fill="none" />
        </g>
        <rect x={-120} y={-8} width={32} height={72} rx={15} fill={`url(#${uid}-oro)`} />
        <rect x={88} y={-8} width={32} height={72} rx={15} fill={`url(#${uid}-oro)`} />
        <rect x={-113} y={2} width={7} height={34} rx={3.5} fill="#fff" opacity={0.45} />
        <rect x={95} y={2} width={7} height={34} rx={3.5} fill="#fff" opacity={0.45} />
        <g transform={`rotate(${sway * 1.3} 102 56)`}>
          <path d="M104,58 C112,106 72,114 30,98" stroke={`url(#${uid}-oro)`} strokeWidth={8} strokeLinecap="round" fill="none" />
          <circle cx={26} cy={97} r={11} fill={`url(#${uid}-oro)`} />
        </g>

        {/* Sudor (pánico) */}
        {e.sudor > 0 &&
          [0, 1].map((i) => {
            const t = ((frame * 2 + i * 40) % 80) / 80;
            return <path key={i} d="M0,-13 C9,2 9,14 0,14 C-9,14 -9,2 0,-13 Z" fill="#BFE6FF" transform={`translate(${i ? 84 : -80} ${-62 + t * 90})`} opacity={Math.sin(t * Math.PI) * e.sudor} />;
          })}
      </g>

      {p.delante && arms}
      {frente}
    </g>
  );
};
