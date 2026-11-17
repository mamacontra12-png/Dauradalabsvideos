import React from 'react';
import {Mano, Miembro, P, PacoCabeza} from './Paco';
import {C} from './tema';

const rad = (g: number) => (g * Math.PI) / 180;

// ───────────────────────── ANTONIO (dibujado por código a partir de su hoja de referencia) ─────────────────────────
const A = {
  piel: '#F1C7A3',
  pielS: '#DDA683',
  pelo: '#E6E9EE',
  peloS: '#BFC5CE',
  traje: '#7C8590',
  trajeOsc: '#5F6772',
  camisa: '#F4F6FA',
  corbata: '#2358D6',
  cont: '#2A1D1A',
};
export type BrazoA = {a1: number; a2: number};
export type PoseAntonio = {cabeza: {x: number; y: number; rot: number}; torsoY: number; izq: BrazoA; der: BrazoA};
export type ExprAntonio = 'panico' | 'come' | 'relajado' | 'neutro';
type Obj = (m: {x: number; y: number}) => React.ReactNode;

export const POSE_A: Record<'reposo' | 'panico' | 'come', PoseAntonio> = {
  reposo: {cabeza: {x: 0, y: 0, rot: 0}, torsoY: 0, izq: {a1: 100, a2: 95}, der: {a1: 80, a2: 85}},
  /** Bocata en alto en una mano y móvil en la oreja en la otra. */
  panico: {cabeza: {x: 6, y: -4, rot: 10}, torsoY: -4, izq: {a1: 150, a2: -70}, der: {a1: -30, a2: -145}},
  /** Se lleva el bocata a la boca, relajado. */
  come: {cabeza: {x: 0, y: 4, rot: -6}, torsoY: 2, izq: {a1: -100, a2: 11}, der: {a1: 78, a2: 92}},
};

const geo = (x0: number, y0: number, b: BrazoA) => {
  const ex = x0 + 120 * Math.cos(rad(b.a1));
  const ey = y0 + 120 * Math.sin(rad(b.a1));
  return {ex, ey, hx: ex + 110 * Math.cos(rad(b.a2)), hy: ey + 110 * Math.sin(rad(b.a2))};
};

const parpadeo = (frame: number) => {
  const c = frame % 101;
  return c < 5 ? [0.5, 0.12, 0.05, 0.12, 0.5][c] : 1;
};

const CabezaAntonio: React.FC<{expr: ExprAntonio; frame: number; masca?: number; electro?: number; tizne?: number}> = ({expr, frame, masca = 0, electro = 0, tizne = 0}) => {
  const ab = parpadeo(frame);
  const cerrados = expr === 'relajado' || expr === 'come';
  const ojoEsc = expr === 'panico' ? 1.25 : 1;
  const cejaIn = expr === 'panico' ? -66 : expr === 'come' || expr === 'relajado' ? -48 : -52;
  const cejaOut = expr === 'panico' ? -48 : -46;
  return (
    <g>
      {electro > 0 && (
        <path
          d={[...Array(13)].map((_, i) => {
            const a1 = ((-178 + i * 14.6) * Math.PI) / 180;
            const a2 = ((-178 + (i + 0.5) * 14.6) * Math.PI) / 180;
            const R = 108 + electro * (46 + Math.sin(frame * 2.1 + i) * 8);
            return `${i ? 'L' : 'M'}${Math.cos(a1) * 92},${Math.sin(a1) * 100 - 10} L${Math.cos(a2) * R},${Math.sin(a2) * R - 14}`;
          }).join(' ') + ' Z'}
          fill={A.pelo}
          stroke={A.cont}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      )}
      <circle cx={-86} cy={10} r={20} fill={A.piel} stroke={A.cont} strokeWidth={5} />
      <circle cx={86} cy={10} r={20} fill={A.piel} stroke={A.cont} strokeWidth={5} />
      <ellipse cx={0} cy={0} rx={86} ry={100} fill={A.piel} stroke={A.cont} strokeWidth={6} />
      {/* pelo blanco: laterales y parte de arriba */}
      <path d="M-84,-10 C-98,-60 -86,-104 -40,-112 C-6,-120 40,-118 70,-98 C92,-82 96,-46 84,-10 C80,-40 70,-62 44,-72 C14,-80 -20,-80 -46,-70 C-70,-60 -80,-40 -84,-10 Z" fill={A.pelo} stroke={A.cont} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-30,-100 C-10,-108 20,-108 40,-98" stroke={A.peloS} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* arrugas */}
      <path d="M-34,-60 Q0,-66 34,-60 M-26,-48 Q0,-53 26,-48" stroke={A.pielS} strokeWidth={4} fill="none" strokeLinecap="round" opacity={expr === 'panico' ? 1 : 0.6} />
      {/* cejas canosas */}
      {[-1, 1].map((s) => (
        <path key={s} d={`M${s * 66},${cejaOut} Q${s * 42},${(cejaIn + cejaOut) / 2 - 8} ${s * 16},${cejaIn}`} stroke={A.peloS} strokeWidth={12} fill="none" strokeLinecap="round" />
      ))}
      {/* ojos */}
      {[-1, 1].map((s) =>
        cerrados ? (
          <path key={s} d={`M${s * 36 - 15},4 Q${s * 36},${expr === 'come' ? -10 : -12} ${s * 36 + 15},4`} stroke={A.cont} strokeWidth={6} fill="none" strokeLinecap="round" />
        ) : (
          <g key={s} transform={`translate(${s * 36} 0) scale(${ojoEsc} ${ojoEsc * ab})`}>
            <ellipse rx={13} ry={15} fill="#fff" stroke={A.cont} strokeWidth={3} />
            <circle cx={expr === 'panico' ? 0 : 2} cy={2} r={expr === 'panico' ? 4.5 : 6.5} fill="#1B2440" />
          </g>
        ),
      )}
      {tizne > 0 && (
        <g fill="#3A3F4A" opacity={0.55 * tizne}>
          <ellipse cx={-50} cy={46} rx={26} ry={14} />
          <ellipse cx={46} cy={-50} rx={30} ry={12} />
          <ellipse cx={58} cy={52} rx={18} ry={10} />
          <ellipse cx={-20} cy={-70} rx={16} ry={8} />
        </g>
      )}
      {/* gafas */}
      <g stroke="#3A2E2A" strokeWidth={5} fill="#BFD8FF" fillOpacity={0.15}>
        <rect x={-66} y={-20} width={58} height={42} rx={14} />
        <rect x={8} y={-20} width={58} height={42} rx={14} />
      </g>
      <path d="M-8,-4 Q0,-10 8,-4" stroke="#3A2E2A" strokeWidth={5} fill="none" />
      {/* nariz */}
      <path d="M2,10 C16,30 14,42 0,44 C-6,44 -10,40 -8,36" stroke={A.pielS} strokeWidth={6} fill="none" strokeLinecap="round" />
      <circle cx={-56} cy={44} r={14} fill="#F0907F" opacity={expr === 'come' || expr === 'relajado' ? 0.5 : 0.25} />
      <circle cx={56} cy={44} r={14} fill="#F0907F" opacity={expr === 'come' || expr === 'relajado' ? 0.5 : 0.25} />
      {/* boca */}
      {expr === 'panico' && (
        <g>
          <path d="M-30,58 Q0,50 30,58 Q32,90 0,92 Q-32,90 -30,58 Z" fill="#4F1212" stroke={A.cont} strokeWidth={5} />
          <path d="M-26,58 Q0,52 26,58 L25,68 Q0,64 -25,68 Z" fill="#fff" />
        </g>
      )}
      {expr === 'come' && (
        <g>
          <ellipse cx={-30} cy={62} rx={16 + masca * 4} ry={12 + masca * 3} fill={A.piel} stroke={A.pielS} strokeWidth={3} />
          <ellipse cx={30} cy={62} rx={16 + (1 - masca) * 4} ry={12 + (1 - masca) * 3} fill={A.piel} stroke={A.pielS} strokeWidth={3} />
          <path d={`M-18,${66 + masca * 3} Q0,${74 - masca * 4} 18,${66 + (1 - masca) * 3}`} stroke={A.cont} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      )}
      {(expr === 'relajado' || expr === 'neutro') && <path d="M-28,62 Q0,84 28,62" stroke={A.cont} strokeWidth={6} fill="none" strokeLinecap="round" />}
      {expr === 'panico' &&
        [0, 1].map((i) => {
          const t = ((frame * 2 + i * 40) % 80) / 80;
          return <path key={i} d="M0,-12 C8,2 8,13 0,13 C-8,13 -8,2 0,-12 Z" fill="#BFE6FF" stroke="#6FB3E0" strokeWidth={2} transform={`translate(${i ? 80 : -82} ${-40 + t * 80})`} opacity={Math.sin(t * Math.PI)} />;
        })}
    </g>
  );
};

const BrazoAntonio: React.FC<{x0: number; y0: number; b: BrazoA; obj?: Obj}> = ({x0, y0, b, obj}) => {
  const {ex, ey, hx, hy} = geo(x0, y0, b);
  const cx = ex + (hx - ex) * 0.86;
  const cy = ey + (hy - ey) * 0.86;
  return (
    <g>
      <Miembro d={`M${x0},${y0} L${ex},${ey} L${cx},${cy}`} color={A.traje} ancho={52} contorno={A.cont} />
      <circle cx={cx} cy={cy} r={22} fill={A.camisa} stroke={A.cont} strokeWidth={4} />
      {obj?.({x: hx, y: hy})}
      <circle cx={hx} cy={hy} r={25} fill={A.piel} stroke={A.cont} strokeWidth={5} />
    </g>
  );
};

/** Antonio: dueño mayor del concesionario. (0,0) = centro de la línea de hombros; cabeza en (0,-165). */
export const AntonioRig: React.FC<{p: PoseAntonio; expr: ExprAntonio; frame: number; objI?: Obj; objD?: Obj; masca?: number; electro?: number; tizne?: number}> = ({p, expr, frame, objI, objD, masca, electro = 0, tizne = 0}) => {
  const resp = Math.sin(frame / 14);
  return (
    <g transform={`translate(0 ${p.torsoY + resp * 1.5})`}>
      <rect x={-28} y={-90} width={56} height={100} fill={A.pielS} stroke={A.cont} strokeWidth={5} />
      <path d="M-150,30 Q-146,-6 -96,-12 L96,-12 Q146,-6 150,30 L156,360 L-156,360 Z" fill={A.traje} stroke={A.cont} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-44,-12 L0,150 L44,-12 Z" fill={A.camisa} stroke={A.cont} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-14,-8 L14,-8 L9,14 L-9,14 Z" fill={A.corbata} stroke={A.cont} strokeWidth={4} />
      <path d="M-9,14 L9,14 L16,120 L0,142 L-16,120 Z" fill={A.corbata} stroke={A.cont} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-44,-12 L-74,40 L-40,60 L0,150 Z" fill={A.trajeOsc} stroke={A.cont} strokeWidth={4} strokeLinejoin="round" />
      <path d="M44,-12 L74,40 L40,60 L0,150 Z" fill={A.trajeOsc} stroke={A.cont} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={0} cy={200} r={8} fill={A.cont} />
      <circle cx={0} cy={260} r={8} fill={A.cont} />
      <g transform={`translate(${p.cabeza.x} ${p.cabeza.y - resp * 2}) rotate(${p.cabeza.rot} 0 -60) translate(0 -165)`}>
        <CabezaAntonio expr={expr} frame={frame} masca={masca} electro={electro} tizne={tizne} />
      </g>
      <BrazoAntonio x0={-130} y0={30} b={p.izq} obj={objI} />
      <BrazoAntonio x0={130} y0={30} b={p.der} obj={objD} />
    </g>
  );
};

// ───────────────────────── PACO con el móvil (para el aviso) ─────────────────────────
export const PacoConMovil: React.FC<{frame: number; vibra?: number; children?: React.ReactNode}> = ({frame, vibra = 0, children}) => {
  const resp = Math.sin(frame / 14);
  const asiente = Math.sin(frame / 5) * 3;
  const j = vibra ? Math.sin(frame * 3) * 4 : 0;
  return (
    <g transform={`translate(0 ${resp * 1.5})`}>
      <rect x={-26} y={-90} width={52} height={100} fill={P.pielSombra} stroke={P.cont} strokeWidth={5} />
      <path d="M-150,30 Q-146,-6 -96,-12 L96,-12 Q146,-6 150,30 L156,360 L-156,360 Z" fill={P.gris} stroke={P.cont} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-40,-12 L0,40 L40,-12" fill="#fff" stroke={P.cont} strokeWidth={4} strokeLinejoin="round" />
      <rect x={-112} y={60} width={64} height={34} rx={5} fill={P.gorra} stroke={P.cont} strokeWidth={4} />
      <rect x={48} y={60} width={64} height={34} rx={5} fill={P.gorra} stroke={P.cont} strokeWidth={4} />
      <g transform={`translate(0 ${asiente * 0.5}) rotate(${asiente} 0 -60) translate(0 -168) scale(0.95)`}>
        <PacoCabeza expr="atento" frame={frame} mirada={[5, 8]} fase={12} />
      </g>
      <Miembro d="M-130,30 L-170,140 L-160,250" color={P.gris} ancho={52} />
      <Mano x={-160} y={260} />
      <Miembro d="M130,30 L190,130 L120,70" color={P.gris} ancho={52} />
      <g transform={`translate(${118 + j} 0) rotate(-12)`}>
        <rect x={-38} y={-68} width={76} height={136} rx={14} fill="#161A20" stroke={P.cont} strokeWidth={4} />
        <rect x={-32} y={-60} width={64} height={120} rx={9} fill="#17338A" />
        {children}
      </g>
      <Mano x={120} y={70} />
    </g>
  );
};

// ───────────────────────── OBJETOS ─────────────────────────
/** Bocata (baguette). `mordiscos` 0..3 = mordiscos en la punta derecha. */
export const Bocata: React.FC<{x: number; y: number; rot?: number; esc?: number; mordiscos?: number; id: string}> = ({x, y, rot = 0, esc = 1, mordiscos = 0, id}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${esc})`}>
    <defs>
      <mask id={id}>
        <rect x={-120} y={-60} width={240} height={120} fill="#fff" />
        {[...Array(Math.min(3, Math.floor(mordiscos)))].map((_, i) => (
          <circle key={i} cx={100 - i * 26} cy={-14 + i * 10} r={28} fill="#000" />
        ))}
      </mask>
    </defs>
    <g mask={`url(#${id})`}>
      <path d="M-96,0 C-96,-30 -70,-34 0,-32 C70,-34 96,-30 96,0 C96,30 70,34 0,32 C-70,34 -96,30 -96,0 Z" fill="#E2B36B" stroke={A.cont} strokeWidth={5} />
      <path d="M-90,2 Q-70,-8 -50,2 T-10,2 T30,2 T70,2 T96,2" stroke="#5DBB4A" strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M-80,10 L80,10" stroke="#E5484D" strokeWidth={7} strokeLinecap="round" strokeDasharray="22 12" />
      <path d="M-60,-22 L-44,-12 M-20,-24 L-4,-14 M20,-24 L36,-14 M58,-22 L72,-12" stroke="#C98E45" strokeWidth={5} strokeLinecap="round" />
    </g>
  </g>
);

/** Llave de paso roja sobre una tubería; `giro` en grados. */
export const LlavePaso: React.FC<{x: number; y: number; giro: number; esc?: number}> = ({x, y, giro, esc = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${esc})`}>
    <rect x={-150} y={-20} width={300} height={40} rx={10} fill="#9FAAB6" stroke={C.azulOscuro} strokeWidth={5} />
    <rect x={-10} y={-70} width={20} height={56} fill="#7F8A96" stroke={C.azulOscuro} strokeWidth={4} />
    <g transform={`translate(0 -78) rotate(${giro})`}>
      <circle r={52} fill="none" stroke="#C0262D" strokeWidth={16} />
      {[0, 60, 120].map((a) => (
        <rect key={a} x={-6} y={-50} width={12} height={100} rx={5} fill="#C0262D" transform={`rotate(${a})`} />
      ))}
      <circle r={14} fill="#8E1B20" />
    </g>
  </g>
);

/** Agua en la parte de abajo de la pantalla (nivel = y de la superficie). */
export const Agua: React.FC<{frame: number; nivel: number}> = ({frame, nivel}) => {
  const ola = (off: number, amp: number, fase: number) => {
    let d = `M-40,${nivel + off}`;
    for (let x = -40; x <= 1120; x += 40) d += ` L${x},${nivel + off + Math.sin(x / 70 + frame / 6 + fase) * amp}`;
    return d + ' L1120,1960 L-40,1960 Z';
  };
  return (
    <g>
      <path d={ola(0, 12, 0)} fill="#3C7BFF" opacity={0.45} />
      <path d={ola(18, 9, 2)} fill="#2358D6" opacity={0.6} />
      {[...Array(6)].map((_, i) => (
        <ellipse key={i} cx={120 + i * 170 + Math.sin(frame / 10 + i) * 10} cy={nivel + 40 + (i % 2) * 30} rx={34} ry={6} fill="#BFE6FF" opacity={0.35 + 0.25 * Math.sin(frame / 7 + i)} />
      ))}
    </g>
  );
};
