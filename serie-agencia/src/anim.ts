/** Utilidades de animación: rebote, anticipación, punch-in, shake y cámara con parallax. */
export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeIn = (t: number) => Math.pow(clamp01(t), 3);
export const easeInOut = (t: number) => (clamp01(t) < 0.5 ? 4 * clamp01(t) ** 3 : 1 - Math.pow(-2 * clamp01(t) + 2, 3) / 2);
/** 0 → 1 con rebote (overshoot): `f` fotogramas desde el inicio. */
export const rebote = (f: number, rig = 1) => (f <= 0 ? 0 : 1 - Math.exp(-0.45 * rig * f) * Math.cos(0.72 * f));
/** Squash & stretch tras un impacto en el fotograma t0: sx se estira cuando sy se aplasta. */
export const boing = (f: number, t0: number, amp = 0.16) => {
  const t = f - t0;
  if (t < 0) return {sx: 1, sy: 1};
  const a = amp * Math.exp(-0.2 * t) * Math.cos(0.9 * t);
  return {sx: 1 + a, sy: 1 - a};
};
export const sacude = (f: number, amp: number) => ({x: Math.sin(f * 2.9) * amp + Math.sin(f * 5.3) * amp * 0.4, y: Math.cos(f * 3.7) * amp * 0.8, r: Math.sin(f * 2.3) * amp * 0.05});
/** Campana de actividad (0..1) para eventos que duran n fotogramas. */
export const durante = (f: number, t0: number, n: number) => (f >= t0 && f < t0 + n ? 1 : 0);

export type Cam = {z: number; cx: number; cy: number; sx: number; sy: number; rot: number};

/**
 * Cámara de un plano. z: zoom inicial→final, c0→c1: punto de la escena en el centro de la pantalla.
 * punches: fotogramas locales con punch-in rápido (anticipación + rebote). shake: amplitud en px (0 = sin temblor).
 */
export const camara = (o: {local: number; dur: number; z: [number, number]; c0?: [number, number]; c1?: [number, number]; punches?: [number, number][]; shake?: number; frame: number}): Cam => {
  const t = easeInOut(o.local / Math.max(1, o.dur));
  let z = lerp(o.z[0], o.z[1], t);
  for (const [t0, amp] of o.punches ?? []) {
    const ant = o.local >= t0 - 4 && o.local < t0 ? -0.04 * ((o.local - (t0 - 4)) / 4) : 0;
    z *= 1 + ant + (o.local >= t0 ? amp * rebote(o.local - t0, 1.2) : 0);
  }
  const c0 = o.c0 ?? [540, 960];
  const c1 = o.c1 ?? c0;
  const s = o.shake ? sacude(o.frame, o.shake) : {x: 0, y: 0, r: 0};
  return {z, cx: lerp(c0[0], c1[0], t), cy: lerp(c0[1], c1[1], t), sx: s.x, sy: s.y, rot: s.r};
};

/** Transformación SVG de una capa con profundidad k (1 = el sujeto; <1 más lejos; >1 más cerca). */
export const capaT = (c: Cam, k = 1) =>
  `translate(540 960) rotate(${c.rot}) scale(${c.z}) translate(${-(540 + (c.cx - 540) * k) + c.sx * k} ${-(960 + (c.cy - 960) * k) + c.sy * k})`;
