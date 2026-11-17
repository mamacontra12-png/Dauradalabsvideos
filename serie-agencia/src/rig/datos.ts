/**
 * Datos del rig de Lolo: tipos, poses, expresiones y utilidades de mezcla.
 * Convenciones: ángulos en grados, 0 = derecha, 90 = abajo, -90 = arriba.
 * "izq" y "der" son los lados de la PANTALLA (no del personaje).
 */
export type Mano = 'puno' | 'abierta' | 'senala' | 'camara';
export type Brazo = {a1: number; a2: number; mano: Mano; /** 0..1: acerca la mano a cámara (escorzo). */ z: number};
export type Boca = 'cerrada' | 'abierta' | 'o' | 'sonrisa' | 'sonrisaAbierta' | 'mueca' | 'resignada' | 'preocupada';
/** y: desplazamiento vertical; rot > 0 baja el extremo interior (enfado), rot < 0 lo sube (tristeza/agobio). */
export type Ceja = {y: number; rot: number};

export type LoloExpr = {
  /** 0 cerrado .. 1 abierto; -1 = ojo cerrado feliz (guiño ^). */
  ojoI: number;
  ojoD: number;
  pupila: [number, number];
  pupilaR: number;
  ojoEsc: number;
  cejaI: Ceja;
  cejaD: Ceja;
  ojeras: number;
  boca: Boca;
  rubor: number;
  sudor: number;
};

export type LoloPose = {
  cabeza: {x: number; y: number; rot: number; sx: number; sy: number};
  torso: {rot: number; y: number; sx: number; sy: number};
  /** + sube los hombros (encogerse), - los deja caídos. */
  hombros: number;
  /** Dibuja los brazos delante de la cabeza. */
  delante: boolean;
  izq: Brazo;
  der: Brazo;
};

const cab = (x = 0, y = 0, rot = 0, sx = 1, sy = 1) => ({x, y, rot, sx, sy});
const tor = (rot = 0, y = 0, sx = 1, sy = 1) => ({rot, y, sx, sy});
const br = (a1: number, a2: number, mano: Mano = 'puno', z = 0): Brazo => ({a1, a2, mano, z});

const base: LoloExpr = {
  ojoI: 1,
  ojoD: 1,
  pupila: [0, 2],
  pupilaR: 1,
  ojoEsc: 1,
  cejaI: {y: 0, rot: 0},
  cejaD: {y: 0, rot: 0},
  ojeras: 0,
  boca: 'sonrisa',
  rubor: 0.5,
  sudor: 0,
};

export const EXPR: Record<'neutra' | 'feliz' | 'cansado' | 'panico' | 'resignado' | 'guino' | 'habla', LoloExpr> = {
  neutra: base,
  feliz: {...base, boca: 'sonrisaAbierta', cejaI: {y: -3, rot: 0}, cejaD: {y: -3, rot: 0}, rubor: 0.7},
  cansado: {...base, ojoI: 0.5, ojoD: 0.5, pupila: [0, 6], ojeras: 1, cejaI: {y: 7, rot: -12}, cejaD: {y: 7, rot: -12}, boca: 'resignada', rubor: 0.1},
  panico: {...base, ojoEsc: 1.2, pupilaR: 0.62, pupila: [0, 0], cejaI: {y: -14, rot: -14}, cejaD: {y: -14, rot: -14}, boca: 'mueca', rubor: 0.2, sudor: 1},
  resignado: {...base, ojoI: 0.62, ojoD: 0.62, pupila: [0, -8], cejaI: {y: -2, rot: -16}, cejaD: {y: -2, rot: -16}, boca: 'resignada', rubor: 0.3},
  guino: {...base, ojoD: -1, cejaI: {y: -7, rot: 0}, cejaD: {y: 4, rot: 8}, boca: 'sonrisaAbierta', rubor: 0.85},
  habla: {...base, boca: 'abierta', cejaI: {y: -3, rot: 0}, cejaD: {y: -3, rot: 0}},
};

export const POSE: Record<'reposo' | 'cansado' | 'panico' | 'resignado' | 'senalarse' | 'senalaCamara' | 'senalaAbajo' | 'conMovil', LoloPose> = {
  reposo: {cabeza: cab(), torso: tor(), hombros: 0, delante: false, izq: br(98, 92), der: br(82, 88)},
  /** Agotado, hombros caídos, sujeta una taza con la mano derecha. */
  cansado: {cabeza: cab(8, 12, -9), torso: tor(2, 5), hombros: -8, delante: false, izq: br(100, 96), der: br(64, -82)},
  /** Un móvil en cada mano; el tercero va entre la oreja y el hombro (se dibuja con `frente`). */
  panico: {cabeza: cab(8, -2, 13), torso: tor(-1, -2), hombros: 12, delante: false, izq: br(152, -100), der: br(28, -80)},
  /** Se encoge de hombros con las palmas hacia arriba. */
  resignado: {cabeza: cab(0, 8, -7), torso: tor(), hombros: 20, delante: true, izq: br(118, -152, 'abierta'), der: br(62, -28, 'abierta')},
  /** Se señala a sí mismo con la mano derecha, la otra en la cadera. */
  senalarse: {cabeza: cab(0, 0, 6), torso: tor(), hombros: 0, delante: true, izq: br(126, 56), der: br(68, 168, 'senala')},
  /** Señala a cámara: la mano se acerca al espectador y se agranda. */
  senalaCamara: {cabeza: cab(0, 2, -3), torso: tor(), hombros: 0, delante: true, izq: br(98, 92), der: br(55, -122, 'camara', 1)},
  senalaAbajo: {cabeza: cab(), torso: tor(), hombros: 0, delante: true, izq: br(96, 62, 'senala'), der: br(84, 118, 'senala')},
  /** Habla con un móvil en la mano derecha. */
  conMovil: {cabeza: cab(0, 0, -4), torso: tor(), hombros: 0, delante: false, izq: br(98, 92), der: br(46, -82)},
};

/** Mezcla recursiva de dos objetos de poses/expresiones (números interpolados; el resto cambia a mitad). */
export const mezcla = <T,>(a: T, b: T, t: number): T => {
  if (typeof a === 'number' && typeof b === 'number') return (a + (b - a) * t) as unknown as T;
  if (Array.isArray(a) && Array.isArray(b)) return a.map((v, i) => mezcla(v, b[i], t)) as unknown as T;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const o: Record<string, unknown> = {};
    for (const k of Object.keys(b as object)) o[k] = mezcla((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], t);
    return o as T;
  }
  return t > 0.5 ? b : a;
};
