/** Vídeo A · "Día 1: copia este prompt" (fontaneros). */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeIn, easeOut, lerp, rebote} from './anim';
import {Cierre, Ctx, DlMark, FUENTE, Intro, K, Linea, PropsReel, Reel, Sfx, Txt, pop} from './comun';
import {PacoCuerpo} from './PacoCuerpo';
import {Persona} from './Persona';

export const MIN_A: Record<string, number> = {intro: 3.4, paco: 5.0, copia: 3.8, prompt: 8.0, revisa: 4.6, cierre: 0};

export const PROMPT = [
  'Hazme un presupuesto claro para un cliente',
  'con estas notas. Ordénalo en:',
  '· Trabajo a realizar',
  '· Materiales (con precio)',
  '· Mano de obra (horas × precio/hora)',
  '· IVA desglosado y total',
  '· Validez del presupuesto: 15 días',
  'Tono profesional y cercano.',
  'Mis notas: [pega aquí tus notas]',
];

// ───────── Salón de noche ─────────
const Salon: React.FC<{frame: number; children?: React.ReactNode; delante?: React.ReactNode; detras?: React.ReactNode}> = ({frame, children, delante, detras}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <rect width={1080} height={1920} fill="#26346B" />
    {[...Array(9)].map((_, i) => <rect key={i} x={i * 130} y={0} width={64} height={1520} fill="#2A3973" />)}
    {/* ventana con la luna */}
    <rect x={70} y={110} width={400} height={420} rx={16} fill="#0B1433" stroke="#16224F" strokeWidth={14} />
    <circle cx={350} cy={210} r={50} fill="#FFF3C4" />
    <circle cx={372} cy={196} r={46} fill="#0B1433" />
    {[[140, 190], [230, 330], [410, 390], [180, 450], [300, 290]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={4} fill={K.oro} opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 9 + i))} />
    ))}
    <rect x={262} y={110} width={14} height={420} fill="#16224F" />
    <path d="M50,100 L120,100 Q110,330 80,550 L50,550 Z M490,100 L420,100 Q430,330 460,550 L490,550 Z" fill="#7C4DB5" opacity={0.9} />
    {/* reloj digital de pared: 23:00 */}
    <g transform="translate(600 140)">
      <rect x={0} y={0} width={340} height={150} rx={22} fill="#0B1433" stroke="#16224F" strokeWidth={10} />
      <text x={170} y={110} textAnchor="middle" fontFamily={FUENTE} fontWeight={900} fontSize={96} fill="#FF6B5E" opacity={Math.floor(frame / 15) % 2 ? 1 : 0.92}>
        23:00
      </text>
    </g>
    {/* lámpara de pie con luz cálida */}
    <circle cx={1010} cy={900} r={260} fill="#FFD27A" opacity={0.1} />
    <path d="M960,760 L1060,760 L1040,860 L980,860 Z" fill="#F2B932" stroke={K.navy} strokeWidth={6} />
    <rect x={1004} y={860} width={12} height={640} fill="#4A3A5E" />
    <rect x={0} y={1520} width={1080} height={400} fill="#4A3324" />
    <rect x={0} y={1514} width={1080} height={12} fill="#2E1F15" />
    {detras}
    {/* sofá: respaldo */}
    <rect x={100} y={1090} width={880} height={360} rx={60} fill="#C0623B" stroke={K.navy} strokeWidth={8} />
    <rect x={140} y={1120} width={390} height={300} rx={46} fill="#CF7048" />
    <rect x={550} y={1120} width={390} height={300} rx={46} fill="#CF7048" />
    {children}
    {/* asiento, brazos y base */}
    <rect x={130} y={1420} width={820} height={110} rx={36} fill="#D97A50" stroke={K.navy} strokeWidth={8} />
    <rect x={130} y={1520} width={820} height={120} rx={20} fill="#A9512F" stroke={K.navy} strokeWidth={8} />
    <rect x={50} y={1250} width={130} height={390} rx={50} fill="#B85A35" stroke={K.navy} strokeWidth={8} />
    <rect x={900} y={1250} width={130} height={390} rx={50} fill="#B85A35" stroke={K.navy} strokeWidth={8} />
    <rect x={150} y={1640} width={30} height={40} fill="#2E1F15" />
    <rect x={900} y={1640} width={30} height={40} fill="#2E1F15" />
    {delante}
  </svg>
);

const Hojas: React.FC<{x: number; y: number; n: number; frame: number}> = ({x, y, n, frame}) => (
  <g transform={`translate(${x} ${y})`}>
    {[...Array(n)].map((_, i) => (
      <g key={i} transform={`translate(${Math.sin(i * 2.3) * 10} ${-i * 12}) rotate(${Math.sin(i * 1.7 + frame / 40) * 4})`}>
        <rect x={-70} y={-48} width={140} height={96} rx={6} fill="#F7F9FC" stroke={K.navy} strokeWidth={4} />
        <rect x={-50} y={-30} width={90} height={8} rx={4} fill="#B9C4DA" />
        <rect x={-50} y={-12} width={70} height={8} rx={4} fill="#B9C4DA" />
      </g>
    ))}
  </g>
);

const Papel = (x: number, y: number) => (
  <g transform={`translate(${x} ${y - 40}) rotate(-6)`}>
    <rect x={-70} y={-90} width={140} height={180} rx={8} fill="#F7F9FC" stroke={K.navy} strokeWidth={5} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-50} y={-66 + i * 28} width={i % 2 ? 70 : 100} height={9} rx={4} fill="#B9C4DA" />)}
  </g>
);
const Boli = (x: number, y: number) => (
  <g transform={`translate(${x + 10} ${y - 30}) rotate(30)`}>
    <rect x={-6} y={-70} width={12} height={90} rx={5} fill="#2E5BD6" stroke={K.navy} strokeWidth={3} />
    <path d="M-6,20 L0,34 L6,20 Z" fill={K.navy} />
  </g>
);

/** Portátil visto por detrás (tapa con el símbolo DL). */
const PortatilDetras: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-170,0 L170,0 L190,16 L-190,16 Z" fill="#3A3F4A" stroke={K.navy} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-150,-4 L150,-4 L130,-206 L-130,-206 Z" fill="#4A505C" stroke={K.navy} strokeWidth={6} strokeLinejoin="round" />
    <g transform="translate(0 -108)">
      <DlMark ancho={84} uid={`lap-${x}`} trazo={17} />
    </g>
  </g>
);

// ───────── Escena 2 · Paco a las 23:00 ─────────
const Paco23: React.FC<Ctx> = ({l, frame, e}) => {
  const tBos = e.at('trabajar') + 2;
  const bostezo = l >= tBos && l < tBos + 34;
  const ab = bostezo ? Math.sin(clamp01((l - tBos) / 34) * Math.PI) : 0;
  const k23 = pop(l, 4, 0.2);
  return (
    <AbsoluteFill>
      <Salon
        frame={frame}
        delante={
          <>
            <Hojas x={760} y={1420} n={9} frame={frame} />
            <rect x={300} y={1700} width={520} height={34} rx={10} fill="#7A5230" stroke={K.navy} strokeWidth={6} />
            <Hojas x={430} y={1690} n={4} frame={frame} />
            <Hojas x={640} y={1690} n={6} frame={frame + 30} />
          </>
        }
      >
        <g transform={`translate(400 1123) scale(0.9)`}>
          <PacoCuerpo
            frame={frame}
            sentado
            expr={bostezo ? 'dormido' : 'agobiado'}
            boca={bostezo ? 1.4 * ab : 0.3}
            sudor={!bostezo}
            mirada={[4, 9]}
            cabezaRot={bostezo ? -8 * ab : 2}
            izq={{a1: bostezo ? 150 * ab + 20 * (1 - ab) : 20, a2: bostezo ? 200 * ab : -40}}
            der={{a1: 20, a2: -40}}
            objI={bostezo ? undefined : Papel}
            objD={Boli}
          />
        </g>
      </Salon>
      <Txt top={620} size={78} k={k23} color="#fff">
        Las <span style={{color: K.oro}}>23:00</span>…
      </Txt>
      <Txt top={712} size={58} k={pop(l, e.at('presupuestos'), 0.2)} color="#fff">
        y los presupuestos, <span style={{color: K.oro}}>a mano</span> ✍️
      </Txt>
    </AbsoluteFill>
  );
};

// ───────── Escena 3 · Riyad se sienta con el portátil ─────────
const Copia: React.FC<Ctx> = ({l, frame, e, vol}) => {
  const llega = easeOut(l / 16);
  const sienta = easeOut((l - 14) / 8);
  const rx = lerp(1250, 740, llega);
  const ry = 980 + 70 * sienta;
  const kT = pop(l, e.at('copia'), 0.18);
  return (
    <AbsoluteFill>
      <Salon
        frame={frame}
        delante={
          <>
            <rect x={300} y={1700} width={520} height={34} rx={10} fill="#7A5230" stroke={K.navy} strokeWidth={6} />
            <Hojas x={430} y={1690} n={4} frame={frame} />
          </>
        }
      >
        <g transform={`translate(330 1123) scale(0.9)`}>
          <PacoCuerpo frame={frame} sentado expr="atento" mirada={[9, 4]} cabezaRot={4} izq={{a1: 20, a2: -40}} der={{a1: 20, a2: -40}} objI={Papel} objD={Boli} />
        </g>
      </Salon>
      <div style={{position: 'absolute', inset: 0, clipPath: 'inset(0 0 470px 0)'}}>
        <Persona quien="riyad" frame={frame} vol={vol('riyad')} habla={vol('riyad') > 0} x={rx} y={ry} ancho={440} pose={{brazoI: 20, brazoD: -20, cabeza: -4}} />
      </div>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <PortatilDetras x={rx - 10} y={1440 + 70 * sienta} s={0.82} />
      </svg>
      <Txt top={600} size={84} k={kT} color={K.oro} rot={-2}>
        COPIA ESTE PROMPT 👇
      </Txt>
    </AbsoluteFill>
  );
};

// ───────── Escena 4 · El prompt en la pantalla ─────────
const Prompt: React.FC<Ctx> = ({l, frame, e, vol}) => {
  const zoom = easeOut(l / 10);
  // cada punto se marca en dorado cuando la voz lo nombra
  const marcas: [number, number][] = [
    [2, e.at('trabajo')],
    [3, e.at('materiales')],
    [4, e.at('mano')],
    [5, e.at('IVA')],
  ];
  const captura = 0.85 + 0.15 * Math.abs(Math.sin(frame / 7));
  return (
    <AbsoluteFill style={{background: '#16224F'}}>
      <div style={{position: 'absolute', left: 14, top: 140, width: 926, height: 1030, transform: `scale(${0.85 + 0.15 * zoom})`, transformOrigin: '50% 40%'}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 36, background: '#1E2230', border: `8px solid ${K.navy}`}} />
        <div style={{position: 'absolute', left: 26, top: 26, right: 26, bottom: 26, borderRadius: 18, background: '#F7F9FC', overflow: 'hidden', fontFamily: FUENTE}}>
          <div style={{height: 70, background: '#E3E8F2', display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 26}}>
            {['#E5484D', '#F2B932', '#2FD27A'].map((c) => <div key={c} style={{width: 22, height: 22, borderRadius: 11, background: c}} />)}
            <div style={{marginLeft: 20, fontWeight: 800, fontSize: 30, color: '#5A6480'}}>Tu IA · nuevo chat</div>
          </div>
          <div style={{padding: '22px 18px 0 18px'}}>
            <div style={{background: '#fff', border: '4px solid #C9D3E8', borderRadius: 22, padding: '20px 20px', boxShadow: '0 6px 0 rgba(14,30,74,.08)'}}>
              {PROMPT.map((t, i) => {
                const vis = l >= 3 + i * 2;
                const m = marcas.find(([j]) => j === i);
                const on = m && l >= m[1];
                return (
                  <div key={i} style={{fontSize: 46, fontWeight: i < 2 || i > 6 ? 700 : 800, lineHeight: 1.28, color: on ? K.marino : '#1B2440', marginBottom: 6, opacity: vis ? 1 : 0, background: on ? 'rgba(242,185,50,.35)' : 'transparent', borderRadius: 8, padding: '0 6px', marginLeft: -6}}>
                    {t}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop: 26, display: 'flex', justifyContent: 'flex-end'}}>
              <div style={{background: K.marino, color: '#fff', fontWeight: 900, fontSize: 32, padding: '14px 30px', borderRadius: 40}}>Enviar ➤</div>
            </div>
          </div>
        </div>
      </div>
      {/* aviso de captura */}
      <div style={{position: 'absolute', top: 50, left: 200, width: 560, textAlign: 'center', fontFamily: FUENTE, fontWeight: 900, fontSize: 56, color: K.marino, background: K.oro, borderRadius: 40, padding: '10px 0', transform: `scale(${pop(l, 12, 0.2) * captura})`, boxShadow: '0 8px 0 rgba(6,12,40,.45)'}}>
        📸 Haz captura
      </div>
      {/* flash de cámara al aparecer el aviso */}
      <AbsoluteFill style={{background: '#fff', opacity: l >= 12 && l < 18 ? (18 - l) / 6 * 0.5 : 0}} />
      {/* base del portátil */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d="M10,1170 L950,1170 L1000,1230 L-40,1230 Z" fill="#3A3F4A" stroke={K.navy} strokeWidth={6} />
        <rect x={0} y={1230} width={1080} height={700} fill="#4A3324" />
      </svg>
      <Persona quien="riyad" frame={frame} vol={vol('riyad')} habla={vol('riyad') > 0} x={760} y={1330} ancho={440} pose={{brazoI: 40 + Math.sin(frame / 8) * 6, cabeza: -3}} />
    </AbsoluteFill>
  );
};

// ───────── Escena 5 · Paco lee, sonríe y se le cae el boli; Kevin avisa ─────────
const Revisa: React.FC<Ctx> = ({l, frame, e, vol}) => {
  const tSonrie = 6;
  const tCae = 10;
  const caida = clamp01((l - tCae) / 14);
  const kev = rebote(l - 2, 1.1);
  const kT = pop(l, e.at('revisa'), 0.2);
  return (
    <AbsoluteFill>
      <Salon
        frame={frame}
        delante={
          <>
            <PortatilDetras x={620} y={1470} s={0.8} />
            {caida < 1 && l >= tCae && (
              <g transform={`translate(${720 + caida * 60} ${1420 + easeIn(caida) * 280}) rotate(${30 + caida * 400})`}>
                <rect x={-6} y={-45} width={12} height={90} rx={5} fill="#2E5BD6" stroke={K.navy} strokeWidth={3} />
              </g>
            )}
            {caida >= 1 && (
              <g transform="translate(790 1755) rotate(84)">
                <rect x={-6} y={-45} width={12} height={90} rx={5} fill="#2E5BD6" stroke={K.navy} strokeWidth={3} />
              </g>
            )}
          </>
        }
      >
        <g transform={`translate(620 1123) scale(0.9)`}>
          <PacoCuerpo frame={frame} sentado expr={l >= tSonrie ? 'aliviado' : 'atento'} mirada={[0, 10]} cabezaRot={l >= tSonrie ? Math.sin(frame / 6) * 2 : 0} izq={{a1: 25, a2: -30}} der={{a1: 25, a2: -30}} objD={l < tCae ? Boli : undefined} />
        </g>
      </Salon>
      <Persona quien="kevin" frame={frame} vol={vol('kevin')} habla={vol('kevin') > 0} x={210} y={1020 + (1 - kev) * 900} ancho={480} pose={{brazoD: -165, cabeza: 5}} />
      <div style={{position: 'absolute', top: 640, left: 60, right: 150, textAlign: 'center', fontFamily: FUENTE, fontWeight: 900, fontSize: 54, whiteSpace: 'nowrap', color: K.marino, transform: `scale(${Math.max(0, kT)}) rotate(-2deg)`}}>
        <span style={{background: K.oro, borderRadius: 24, padding: '10px 26px', boxShadow: '0 8px 0 rgba(6,12,40,.45)'}}>⚠️ Revisa siempre los precios</span>
      </div>
    </AbsoluteFill>
  );
};

// ───────── Cierre: Paco dice adiós al fondo ─────────
const PacoAdios: React.FC<{frame: number}> = ({frame}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <g transform="translate(540 1370) scale(0.42)">
      <PacoCuerpo frame={frame} expr="aliviado" izq={{a1: 14, a2: 6}} der={{a1: 150, a2: 175 + Math.sin(frame * 0.5) * 22}} />
    </g>
  </svg>
);

export const VideoA: React.FC<PropsReel> = (props) => (
  <Reel
    props={props}
    minimos={MIN_A}
    escena={(c) => {
      switch (c.e.id) {
        case 'intro':
          return <Intro l={c.l} frame={c.frame} cfg={c.cfg} dia={1} vol={c.vol} />;
        case 'paco':
          return <Paco23 {...c} />;
        case 'copia':
          return <Copia {...c} />;
        case 'prompt':
          return <Prompt {...c} />;
        case 'revisa':
          return <Revisa {...c} />;
        default:
          return <Cierre l={c.l} frame={c.frame} e={c.e} vol={c.vol} cfg={c.cfg} fondo={<PacoAdios frame={c.frame} />} />;
      }
    }}
    sfx={(L: Linea): Sfx[] => {
      const p = L.esc('paco')!;
      const pr = L.esc('prompt')!;
      const r = L.esc('revisa')!;
      return [
        [p.desde + 4, 'pop', 0.25],
        [L.esc('copia')!.desde + L.esc('copia')!.at('copia'), 'pop', 0.25],
        [pr.desde + 12, 'tick', 0.35],
        ...['trabajo', 'materiales', 'mano', 'IVA'].map((w) => [pr.desde + pr.at(w), 'tick', 0.25] as Sfx),
        [r.desde + 10, 'tropiezo', 0.25],
        [r.desde + r.at('revisa'), 'pop', 0.25],
      ];
    }}
  />
);
