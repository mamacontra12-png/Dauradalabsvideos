/**
 * Piezas comunes de la serie "Montando una agencia y consultoría de IA desde cero":
 * línea de tiempo según la voz, fondo, textos, intro con el pósit del seguidor y "DÍA X",
 * bloque "Truco gratis", cierre con la pared de la agencia y contador, subtítulos y el montaje (voces + efectos).
 */
import React from 'react';
import {AbsoluteFill, Audio, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeOut, rebote} from './anim';
import {Persona} from './Persona';

// ───────────────────────── Datos ─────────────────────────
export type VideoCfg = {SEGUIDOR: string; SEGUIDORES_ACTUALES: number; NOMBRES_PARED?: string[]; AYER?: string};
type Palabra = {w: string; start: number; end: number};
type Frase = {id: string; hablante: string | null; archivo?: string; silencio?: number; palabras: Palabra[]; envolvente: number[]};
export type Tiempos = {recorte: number; frases: Frase[]};
export type PropsReel = {cfg: VideoCfg; tiempos: Tiempos; subs: boolean; pausa: number; cola: number};

export const FPS = 30;
export const K = {marino: '#0E1E4A', azul: '#1D3E9E', oro: '#F2B932', blanco: '#FFFFFF', navy: '#0A1A44', verde: '#2FD27A', turq: '#3E9AAE', turqCl: '#86D2D7', rojo: '#E5484D'};
export const FUENTE = 'Inter, "Inter Display", Montserrat, Poppins, Arial, sans-serif';

export type Esc = Frase & {desde: number; dur: number; finVoz: number; at: (w: string, n?: number) => number; palabraEn: (i: number) => number};
export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w%]/g, '').toLowerCase();

/** Escenas seguidas, cada una dura lo que su voz (+ pausa) o su mínimo (s) si es mayor. */
export const linea = (p: PropsReel, minimos: Record<string, number>) => {
  const f = (s: number) => Math.round(s * FPS);
  let t = 0;
  const lista: Esc[] = p.tiempos.frases.map((fr, i) => {
    const ultima = i === p.tiempos.frases.length - 1;
    const voz = fr.palabras.length ? fr.palabras[fr.palabras.length - 1].end - p.tiempos.recorte : 0;
    const len = fr.palabras.length ? Math.max(voz + (ultima ? p.cola : p.pausa), minimos[fr.id] ?? 0) : (fr.silencio ?? 2);
    const desde = f(t);
    t += len;
    const palabraEn = (k: number) => (fr.palabras.length ? desde + f(fr.palabras[Math.max(0, Math.min(k, fr.palabras.length - 1))].start - p.tiempos.recorte) : desde);
    return {
      ...fr,
      desde,
      dur: f(t) - desde,
      finVoz: desde + f(voz),
      palabraEn,
      /** Fotograma local en el que empieza la palabra `w` (la n-ésima vez que aparece). */
      at: (w: string, n = 0) => {
        const x = norm(w);
        const idx = fr.palabras.map((q, j) => (norm(q.w) === x ? j : -1)).filter((j) => j >= 0);
        let i = idx[Math.min(n, idx.length - 1)] ?? -1;
        if (i < 0) i = Math.max(0, fr.palabras.findIndex((q) => norm(q.w).includes(x)));
        return palabraEn(i) - desde;
      },
    };
  });
  const duracion = lista[lista.length - 1].desde + lista[lista.length - 1].dur;
  const volumen = (frame: number) => {
    const e = lista.find((x) => frame >= x.desde && frame < x.desde + x.dur);
    if (!e || !e.hablante) return {quien: '', v: 0};
    const k = frame - e.desde + f(p.tiempos.recorte);
    const g = (j: number) => e.envolvente[j] ?? 0;
    return {quien: e.hablante, v: g(k - 1) * 0.25 + g(k) * 0.5 + g(k + 1) * 0.25};
  };
  return {lista, duracion, volumen, esc: (id: string) => lista.find((e) => e.id === id)};
};
export type Linea = ReturnType<typeof linea>;

// ───────────────────────── Piezas visuales ─────────────────────────
export const Fondo: React.FC<{frame: number; de?: string; a?: string}> = ({frame, de = '#1B3577', a = K.marino}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <defs>
      <radialGradient id={`f-${de}`} cx="0.5" cy="0.4" r="0.8">
        <stop offset="0" stopColor={de} />
        <stop offset="1" stopColor={a} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill={`url(#f-${de})`} />
    {[...Array(26)].map((_, i) => {
      const tw = 0.3 + 0.7 * Math.abs(Math.sin(frame / 11 + i * 1.3));
      return <path key={i} d="M0,-10 C1,-2 2,-1 10,0 C2,1 1,2 0,10 C-1,2 -2,1 -10,0 C-2,-1 -1,-2 0,-10 Z" fill={K.oro} opacity={0.25 + 0.45 * tw} transform={`translate(${random(`ex${i}`) * 1080} ${random(`ey${i}`) * 1900}) scale(${0.6 + random(`es${i}`) * 0.9})`} />;
    })}
  </svg>
);

export const Txt: React.FC<{top: number; size: number; color?: string; k?: number; children: React.ReactNode; left?: number; right?: number; rot?: number; peso?: number; sombra?: boolean; nowrap?: boolean}> = ({top, size, color = '#fff', k = 1, children, left = 60, right = 150, rot = 0, peso = 900, sombra = true, nowrap = false}) => (
  <div style={{position: 'absolute', top, left, right, textAlign: 'center', fontFamily: FUENTE, fontWeight: peso, fontSize: size, lineHeight: 1.05, color, whiteSpace: nowrap ? 'nowrap' : undefined, transform: `scale(${Math.max(0, k)}) rotate(${rot}deg)`, textShadow: sombra ? '0 8px 0 rgba(6,12,40,.55)' : undefined, opacity: k > 0 ? 1 : 0}}>
    {children}
  </div>
);

/** Escala de entrada con rebote: 0 antes de t0, luego ~1. */
export const pop = (f: number, t0: number, amp = 0.15) => (f < t0 ? 0 : 1 + amp * Math.exp(-0.25 * (f - t0)) * Math.sin(0.55 * (f - t0)) - Math.exp(-0.6 * (f - t0)) * 0.5);

export const Tick: React.FC<{x: number; y: number; r: number; p: number}> = ({x, y, r, p}) =>
  p <= 0 ? (
    <circle cx={x} cy={y} r={r} fill="none" stroke="#3C5BB0" strokeWidth={4} />
  ) : (
    <g transform={`translate(${x} ${y}) scale(${Math.min(1.15, rebote(p * 14, 1.3))})`}>
      <circle r={r} fill={K.verde} />
      <path d={`M${-r * 0.45},0 L${-r * 0.1},${r * 0.36} L${r * 0.5},${-r * 0.36}`} stroke="#fff" strokeWidth={r * 0.26} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  );

/** Móvil genérico dibujado (sin marca), 160x300 a escala 1, centrado en (0,0). */
export const MovilGen: React.FC<{children?: React.ReactNode; vibra?: number; frame?: number; color?: string}> = ({children, vibra = 0, frame = 0, color = '#17338A'}) => {
  const j = vibra ? Math.sin(frame * 3.1) * 4 * vibra : 0;
  const r = vibra ? Math.sin(frame * 2.7) * 5 * vibra : 0;
  return (
    <g transform={`translate(${j} 0) rotate(${r})`}>
      <rect x={-80} y={-150} width={160} height={300} rx={28} fill="#1E2230" stroke={K.navy} strokeWidth={6} />
      <rect x={-68} y={-134} width={136} height={262} rx={18} fill={color} />
      <rect x={-20} y={-146} width={40} height={8} rx={4} fill="#0B0E16" />
      {children}
    </g>
  );
};

/** Ondas de vibración alrededor de un objeto. */
export const Ondas: React.FC<{frame: number; r?: number; color?: string}> = ({frame, r = 110, color = K.oro}) => (
  <g fill="none" stroke={color} strokeWidth={7} strokeLinecap="round">
    {[0, 1].map((i) => {
      const k = ((frame / 6 + i * 0.5) % 1);
      return (
        <g key={i} opacity={1 - k}>
          <path d={`M${-r - k * 40},${-40} Q${-r - 20 - k * 40},0 ${-r - k * 40},40`} />
          <path d={`M${r + k * 40},${-40} Q${r + 20 + k * 40},0 ${r + k * 40},40`} />
        </g>
      );
    })}
  </g>
);

/** Portátil (lo ve el espectador por detrás, con el símbolo DL en la tapa). */
export {DlMark} from './DlMark';

// ───────────────────────── Intro: "esta persona nos sigue" ─────────────────────────
export const Intro: React.FC<{l: number; frame: number; cfg: VideoCfg; dia: number; vol: (q: string) => number}> = ({l, frame, cfg, dia, vol}) => {
  const k = l < 0 ? 0 : interpolate(l, [0, 6, 10, 13], [0, 1.15, 0.97, 1], {extrapolateRight: 'clamp'});
  const tp = 4;
  const kp = l < tp ? 0 : interpolate(l - tp, [0, 4, 8, 12], [1.7, 0.92, 1.04, 1], {extrapolateRight: 'clamp'});
  const senala = easeOut((l - 8) / 8);
  return (
    <AbsoluteFill>
      <Fondo frame={frame} />
      <Txt top={110} size={210} color={K.oro} k={k} nowrap>
        DÍA {dia}
      </Txt>
      {l >= tp && (
        <div style={{position: 'absolute', left: 170, top: 420, width: 600, height: 560, background: '#FFE066', borderRadius: 14, boxShadow: '0 30px 0 rgba(0,0,0,.25)', transform: `rotate(-4deg) scale(${kp})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FUENTE}}>
          <div style={{position: 'absolute', top: -26, width: 200, height: 56, background: 'rgba(255,255,255,.55)', transform: 'rotate(3deg)'}} />
          <div style={{fontWeight: 900, fontSize: Math.min(96, Math.floor(560 / (cfg.SEGUIDOR.length * 0.62))), color: K.marino, whiteSpace: 'nowrap'}}>{cfg.SEGUIDOR}</div>
          <div style={{fontWeight: 800, fontSize: 64, color: K.marino, marginTop: 24}}>nos sigue 💛</div>
        </div>
      )}
      <Persona quien="kevin" frame={frame} vol={vol('kevin')} habla={vol('kevin') > 0} x={290} y={1215} ancho={470} pose={{brazoD: -130 * senala, cabeza: 4}} />
      <Persona quien="riyad" frame={frame} vol={vol('riyad')} habla={vol('riyad') > 0} x={770} y={1215} ancho={470} pose={{brazoI: 130 * senala, cabeza: -4}} />
    </AbsoluteFill>
  );
};

// ───────────────────────── Truco gratis ─────────────────────────
/**
 * Pizarra grande (la tarjeta "TRUCO GRATIS" ampliada) con el contenido del truco y sus puntos marcados con tick
 * cuando la voz los nombra; abajo, el personaje que lo dice sujeta la tarjeta pequeña.
 */
export const Truco: React.FC<{
  l: number;
  frame: number;
  quien: 'kevin' | 'riyad';
  vol: (q: string) => number;
  subtitulo: string;
  tSub: number;
  items: [string, string, number][];
  alto?: number;
  children?: React.ReactNode;
}> = ({l, frame, quien, vol, subtitulo, tSub, items, alto = 940, children}) => {
  const tarjeta = rebote(l - 2, 1.1);
  const sub = clamp01((l - tSub + 2) / 6);
  const y0 = -alto / 2;
  const nItems = items.length;
  const yItems = alto / 2 - 40 - nItems * 120;
  return (
    <AbsoluteFill>
      <Fondo frame={frame} de="#1D3E9E" />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(465 ${120 + alto / 2}) scale(${Math.max(0.01, tarjeta)})`}>
          <rect x={-420} y={y0} width={840} height={alto} rx={40} fill="#0B1638" stroke={K.oro} strokeWidth={8} />
          <text x={0} y={y0 + 110} textAnchor="middle" fontFamily={FUENTE} fontWeight={900} fontSize={92} fill={K.oro}>
            TRUCO GRATIS
          </text>
          <text x={0} y={y0 + 190} textAnchor="middle" fontFamily={FUENTE} fontWeight={800} fontSize={44} fill="#fff" opacity={sub}>
            {subtitulo}
          </text>
          {children}
          {items.map(([ico, it, t], i) => {
            const p = clamp01((l - t + 1) / 6);
            const on = p > 0;
            return (
              <g key={it} transform={`translate(0 ${yItems + 60 + i * 120})`}>
                <rect x={-370} y={-50} width={740} height={100} rx={26} fill={on ? '#16327F' : '#101F55'} stroke={on ? K.oro : '#22408F'} strokeWidth={on ? 5 : 3} />
                <text x={-325} y={18} fontFamily={FUENTE} fontWeight={900} fontSize={50} opacity={on ? 1 : 0.5}>
                  {ico}
                </text>
                <text x={-245} y={19} fontFamily={FUENTE} fontWeight={900} fontSize={54} fill={on ? '#fff' : '#7F8FB8'}>
                  {it}
                </text>
                <Tick x={310} y={0} r={36} p={p} />
              </g>
            );
          })}
        </g>
        <path d="M400,1070 L450,1440 M530,1070 L530,1440" stroke={K.oro} strokeWidth={4} strokeDasharray="10 12" opacity={0.6 * clamp01((l - 8) / 8)} />
      </svg>
      <Persona quien={quien} frame={frame} vol={vol(quien)} habla={vol(quien) > 0} x={500} y={1215} ancho={470} pose={{brazoI: -30, brazoD: 30}} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(495 1690) rotate(${Math.sin(frame / 14) * 2})`}>
          <rect x={-110} y={-80} width={220} height={150} rx={14} fill="#0B1638" stroke={K.oro} strokeWidth={5} />
          <text x={0} y={-36} textAnchor="middle" fontFamily={FUENTE} fontWeight={900} fontSize={24} fill={K.oro}>
            TRUCO GRATIS
          </text>
          {items.map((it, i) => <rect key={i} x={-80} y={-14 + i * 26} width={160} height={10} rx={5} fill={l >= it[2] ? K.verde : '#7F8FB8'} />)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ───────────────────────── Cierre: la pared de la agencia ─────────────────────────
/**
 * La pared no lista a todos los seguidores (no escala con miles): pósit del seguidor del día y el pósit vacío "¿tú?".
 * Contador: 1 % menos por cada 1.000 seguidores. El protagonista del vídeo se despide al fondo.
 */
export const Cierre: React.FC<{l: number; frame: number; e: Esc; vol: (q: string) => number; cfg: VideoCfg; fondo?: React.ReactNode}> = ({l, frame, e, vol, cfg, fondo}) => {
  const ultimo = e.dur - 36;
  const sigue = l >= ultimo;
  const total = cfg.SEGUIDORES_ACTUALES;
  const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const siguiente = (Math.floor(total / 1000) + 1) * 1000;
  const conseguido = Math.floor(total / 1000);
  const pct = (total - (siguiente - 1000)) / 1000;
  const parp = 0.65 + 0.35 * Math.abs(Math.sin(frame / 8));
  const k1 = pop(l, 6, 0.2);
  const k2 = pop(l, 22, 0.25);
  const habla = (q: string) => vol(q) > 0;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <rect width={1080} height={1920} fill="#24458F" />
        {[...Array(30)].map((_, i) => <rect key={i} x={(i % 6) * 190 - 20} y={Math.floor(i / 6) * 250} width={180} height={240} fill="#2A4DA0" opacity={0.25} />)}
      </svg>
      {fondo}
      <Txt top={120} size={64} color={K.oro} k={pop(l, 2)}>
        La pared de la agencia
      </Txt>
      <div style={{position: 'absolute', left: 70, top: 230, width: 860, height: 700, borderRadius: 26, background: '#B98552', border: '14px solid #7A5230', boxShadow: '0 18px 0 rgba(0,0,0,.25)', transform: `scale(${pop(l, 2, 0.08)})`, opacity: pop(l, 2) > 0 ? 1 : 0, backgroundImage: 'radial-gradient(#A7743F 2px, transparent 2.5px)', backgroundSize: '22px 22px'}} />
      <div style={{position: 'absolute', left: 120, top: 330, width: 370, height: 360, background: '#FFE066', borderRadius: 10, boxShadow: '0 16px 0 rgba(0,0,0,.25)', transform: `rotate(-4deg) scale(${k1})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FUENTE, fontWeight: 900, color: K.marino, opacity: k1 > 0 ? 1 : 0}}>
        <div style={{position: 'absolute', top: -16, width: 34, height: 34, borderRadius: 17, background: K.rojo, boxShadow: '0 4px 0 rgba(0,0,0,.3)'}} />
        <div style={{fontSize: Math.min(48, Math.floor(330 / (cfg.SEGUIDOR.length * 0.6))), whiteSpace: 'nowrap'}}>{cfg.SEGUIDOR}</div>
        <div style={{fontSize: 40, marginTop: 18, fontWeight: 800}}>nos sigue 💛</div>
      </div>
      <div style={{position: 'absolute', left: 540, top: 350, width: 340, height: 330, background: 'rgba(255,255,255,.14)', border: `6px dashed ${K.oro}`, borderRadius: 10, transform: `rotate(3deg) scale(${k2})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FUENTE, fontWeight: 900, color: '#fff', opacity: k2 > 0 ? 1 : 0}}>
        <div style={{position: 'absolute', top: -16, width: 34, height: 34, borderRadius: 17, background: K.oro, boxShadow: '0 4px 0 rgba(0,0,0,.3)'}} />
        <div style={{fontSize: 90, color: K.oro}}>¿?</div>
        <div style={{fontSize: 52}}>¿tú?</div>
      </div>
      <div style={{position: 'absolute', left: 70, width: 860, top: 760, textAlign: 'center', fontFamily: FUENTE, fontWeight: 900, fontSize: 40, color: '#fff', textShadow: '0 4px 0 rgba(0,0,0,.35)', opacity: clamp01((l - 26) / 8)}}>
        El próximo pósit puede ser el tuyo
      </div>
      <div style={{position: 'absolute', left: 80, right: 150, top: 1000, opacity: clamp01((l - 10) / 8), fontFamily: FUENTE}}>
        <div style={{textAlign: 'center', fontWeight: 900, fontSize: 56, color: '#fff'}}>
          {fmt(total)} / {fmt(siguiente)} <span style={{color: K.oro}}>→ −{siguiente / 1000} %</span>
        </div>
        <div style={{marginTop: 14, height: 34, borderRadius: 17, background: K.marino, border: `4px solid ${K.oro}`, overflow: 'hidden'}}>
          <div style={{width: `${Math.max(1.5, pct * 100)}%`, height: '100%', background: K.oro, opacity: parp}} />
        </div>
        {conseguido > 0 && <div style={{marginTop: 12, textAlign: 'center', fontWeight: 900, fontSize: 34, color: K.oro}}>Ya conseguido: −{conseguido} %</div>}
      </div>
      <Persona quien="kevin" frame={frame} vol={vol('kevin')} habla={habla('kevin')} x={290} y={1215} ancho={470} pose={{brazoD: sigue ? -150 : -10, cabeza: 3}} />
      <Persona quien="riyad" frame={frame} vol={vol('riyad')} habla={habla('riyad')} x={790} y={1215} ancho={470} pose={{brazoI: sigue ? 150 : 10, cabeza: -3}} />
      {sigue && (
        <AbsoluteFill style={{background: 'rgba(14,30,74,.72)'}}>
          <div style={{position: 'absolute', top: 560, left: 40, right: 150, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: FUENTE, fontWeight: 900, fontSize: 122, color: K.oro, textShadow: '0 8px 0 rgba(6,12,40,.55)', transform: `scale(${Math.max(0, pop(l, ultimo, 0.2))})`}}>
            SÍGUENOS 👆
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ───────────────────────── Subtítulos ─────────────────────────
const DORADAS = new Set(['ia', 'prompt', 'chatbot', 'gratis', '%', 'siguenos']);
/** Índices dorados: palabras sueltas + "Día N", "1 %" y "agente de voz". */
const doradas = (ws: string[]) => {
  const n = ws.map(norm);
  const s = new Set<number>();
  n.forEach((w, i) => {
    if (DORADAS.has(w)) s.add(i);
    if (w === 'dia' && /^\d+$/.test(n[i + 1] ?? '')) [i, i + 1].forEach((j) => s.add(j));
    if (/^\d+$/.test(w) && n[i + 1] === '%') s.add(i);
    if (w === 'agente' && n[i + 1] === 'de' && n[i + 2] === 'voz') [i, i + 1, i + 2].forEach((j) => s.add(j));
  });
  return s;
};

export const Subtitulos: React.FC<{lista: Esc[]; frame: number}> = ({lista, frame}) => {
  const bloques = lista.flatMap((e) => {
    if (!e.palabras.length) return [];
    const b: number[][] = [];
    let a: number[] = [];
    let ch = 0;
    e.palabras.forEach((p, i) => {
      // no separar una sigla o un "%" de la palabra anterior ("1 %", "e IVA")
      const pegada = /^[A-ZÁÉÍÓÚÑ]{2,}[.,:;!?]?$/.test(p.w) || /^%/.test(p.w);
      if (a.length && !pegada && (a.length >= 4 || ch + p.w.length > 20)) {
        b.push(a);
        a = [];
        ch = 0;
      }
      a.push(i);
      ch += p.w.length + 1;
      if (/[.,:;!?…]$/.test(p.w) && a.length >= 2) {
        b.push(a);
        a = [];
        ch = 0;
      }
    });
    if (a.length) b.push(a);
    const u = b.reduce<number[][]>((acc, x) => {
      if (acc.length && (x.length === 1 || acc[acc.length - 1].length === 1) && acc[acc.length - 1].length + x.length <= 5) acc[acc.length - 1] = [...acc[acc.length - 1], ...x];
      else acc.push(x);
      return acc;
    }, []);
    const oro = doradas(e.palabras.map((p) => p.w));
    return u.map((idx, i) => ({e, idx, oro, desde: Math.max(e.desde, e.palabraEn(idx[0]) - 2), hasta: u[i + 1] ? e.palabraEn(u[i + 1][0]) - 2 : Math.min(e.desde + e.dur, e.finVoz + 12)}));
  });
  const b = bloques.find((x) => frame >= x.desde && frame < x.hasta);
  if (!b) return null;
  const k = 0.7 + 0.3 * rebote(frame - b.desde, 1.4);
  return (
    <div style={{position: 'absolute', left: 50, right: 150, top: 1248 - 70, height: 140, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 18, fontFamily: FUENTE, fontWeight: 900, fontSize: 72, lineHeight: 1.05, transform: `scale(${k})`}}>
        {b.idx.map((i) => (
          <span key={i} style={{color: b.oro.has(i) ? K.oro : '#fff', WebkitTextStroke: '14px #050B22', paintOrder: 'stroke fill', textShadow: '0 6px 16px rgba(0,0,0,.6)'}}>
            {b.e.palabras[i].w}
          </span>
        ))}
      </div>
    </div>
  );
};

// ───────────────────────── Montaje ─────────────────────────
export type Ctx = {l: number; frame: number; e: Esc; L: Linea; vol: (q: string) => number; cfg: VideoCfg};
export type Sfx = [number, string, number];

/** Monta un reel: escena actual (con entrada suave), subtítulos, voces y efectos. */
export const Reel: React.FC<{props: PropsReel; minimos: Record<string, number>; escena: (c: Ctx) => React.ReactNode; sfx: (L: Linea) => Sfx[]; sinEntrada?: string[]}> = ({props, minimos, escena, sfx, sinEntrada = ['intro']}) => {
  const frame = useCurrentFrame();
  const L = linea(props, minimos);
  const e = L.lista.find((x) => frame >= x.desde && frame < x.desde + x.dur) ?? L.lista[L.lista.length - 1];
  const l = frame - e.desde;
  const v = L.volumen(frame);
  const vol = (q: string) => (v.quien === q ? v.v : 0);
  const trim = Math.round(props.tiempos.recorte * FPS);
  const entra = sinEntrada.includes(e.id) ? 1 : easeOut(l / 8);
  const efectos: Sfx[] = [[4, 'pop', 0.35], ...L.lista.slice(1).map((x) => [x.desde - 4, 'whoosh', 0.25] as Sfx), ...sfx(L)];
  const c = L.esc('cierre');
  if (c) efectos.push([c.desde + 6, 'pop', 0.2], [c.desde + 22, 'pop', 0.2], [c.desde + c.dur - 36, 'ding', 0.3]);
  return (
    <AbsoluteFill style={{background: K.marino}}>
      <AbsoluteFill style={{transform: `translateY(${(1 - entra) * 40}px)`, opacity: 0.6 + 0.4 * entra}}>{escena({l, frame, e, L, vol, cfg: props.cfg})}</AbsoluteFill>
      {props.subs && <Subtitulos lista={L.lista} frame={frame} />}
      {L.lista
        .filter((x) => x.archivo)
        .map((x) => (
          <Sequence key={x.id} from={x.desde} name={`Voz ${x.id} (${x.hablante})`}>
            <Audio src={staticFile(x.archivo!)} trimBefore={trim} />
          </Sequence>
        ))}
      {efectos
        .filter(([f]) => f >= 0)
        .map(([f, s, vv], i) => (
          <Sequence key={i} from={f} durationInFrames={60} name={`sfx ${s}`}>
            <Audio src={staticFile(`sfx/${s}.wav`)} volume={vv} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
