/** Vídeo B · "Día 2: los tres móviles de Rosa" (multiservicios 24/7, agente de voz). */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeIn, easeOut, rebote} from './anim';
import {Aura} from './Aura';
import {Cierre, Ctx, DlMark, Fondo, FUENTE, Intro, K, Linea, MovilGen, Ondas, PropsReel, Reel, Sfx, Truco, Txt, pop} from './comun';
import {Persona} from './Persona';

export const MIN_B: Record<string, number> = {intro: 3.4, ayer: 3.0, rosa: 6.2, agente: 8.2, truco: 6.4, cierre: 0};

/** Vibración de una pieza del SVG de Rosa (CSS). */
const vibraCss = (id: string, frame: number, on: boolean, fase = 0) =>
  on ? `{c} #${id} { transform: translate(${Math.sin((frame + fase) * 3.1) * 5}px, ${Math.cos((frame + fase) * 2.3) * 2}px) rotate(${Math.sin((frame + fase) * 2.7) * 4}deg); transform-box: fill-box; transform-origin: center; }` : '';
const oculta = (id: string) => `{c} #${id} { display: none; }`;

/** Teléfono pequeño cayendo (gira y rebota en el suelo). */
const MovilCae: React.FC<{x0: number; y0: number; x1: number; y1: number; p: number; esc?: number}> = ({x0, y0, x1, y1, p, esc = 0.42}) => {
  const t = clamp01(p);
  const x = x0 + (x1 - x0) * t;
  const y = t < 1 ? y0 + (y1 - y0) * easeIn(t) - Math.sin(t * Math.PI) * 60 : y1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${t < 1 ? t * 540 : 90}) scale(${esc})`}>
      <MovilGen>
        <circle r={34} cy={-10} fill={K.verde} />
      </MovilGen>
    </g>
  );
};

const Bocadillo: React.FC<{x: number; y: number; k: number; texto?: string}> = ({x, y, k, texto = '📞'}) => (
  <g transform={`translate(${x} ${y}) scale(${Math.max(0, k)})`}>
    <path d="M-62,-48 Q-62,-70 -40,-70 L40,-70 Q62,-70 62,-48 L62,10 Q62,32 40,32 L0,32 L-24,58 L-18,32 L-40,32 Q-62,32 -62,10 Z" fill="#fff" stroke={K.navy} strokeWidth={5} />
    <text x={0} y={-2} textAnchor="middle" fontSize={54} fontFamily={FUENTE}>
      {texto}
    </text>
  </g>
);

// ───────── Escena "Ayer" (solo si B.AYER no está vacío) ─────────
const Ayer: React.FC<Ctx> = ({l, frame, vol, cfg}) => (
  <AbsoluteFill>
    <Fondo frame={frame} />
    <Txt top={300} size={120} color={K.oro} k={pop(l, 2)}>
      AYER
    </Txt>
    <Txt top={470} size={74} k={pop(l, 8)}>
      {cfg.AYER}
    </Txt>
    <Persona quien="kevin" frame={frame} vol={vol('kevin')} habla={false} x={270} y={1230} ancho={460} pose={{brazoD: -18}} />
    <Persona quien="riyad" frame={frame} vol={vol('riyad')} habla={vol('riyad') > 0} x={790} y={1230} ancho={460} pose={{brazoI: 18}} />
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <rect x={-20} y={1720} width={1120} height={40} rx={14} fill="#8A5A33" stroke={K.navy} strokeWidth={6} />
      <rect x={-20} y={1756} width={1120} height={200} fill="#6A4527" />
      <g transform="translate(530 1720) scale(0.78)">
        <path d="M-170,0 L170,0 L190,16 L-190,16 Z" fill="#3A3F4A" stroke={K.navy} strokeWidth={5} strokeLinejoin="round" />
        <path d="M-150,-4 L150,-4 L130,-206 L-130,-206 Z" fill="#4A505C" stroke={K.navy} strokeWidth={6} strokeLinejoin="round" />
        <g transform="translate(0 -108)">
          <DlMark ancho={84} uid="ayer-dl" trazo={17} />
        </g>
      </g>
    </svg>
  </AbsoluteFill>
);

// ───────── Escena · Rosa y sus tres móviles ─────────
const RX = 520;
const RY = 600;
const RA = 660;
const rk = RA / 600;
const rp = (x: number, y: number): [number, number] => [RX - RA / 2 + x * rk, RY + y * rk];

const Rosa3: React.FC<Ctx> = ({l, frame, e}) => {
  const tCoge = e.at('Tres') - 2;
  const tSuelta = e.at('solo');
  const tCae = e.at('manos');
  const coge = easeOut((l - tCoge) / 8);
  const [hdx, hdy] = rp(428, 836);
  const [bx, by] = rp(372, 700);
  const extra = [
    l < tCoge ? vibraCss('movil-izq', frame, true) : '',
    l < tSuelta ? vibraCss('movil-der', frame, true, 7) : oculta('movil-der'),
    l < tCae ? vibraCss('movil-bolsillo', frame, true, 13) : oculta('movil-bolsillo'),
  ].join('\n');
  const sacude = l < tCoge ? Math.sin(frame * 1.7) * 1.5 : 0;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <rect width={1080} height={1920} fill="#2B2F66" />
        <rect x={0} y={0} width={1080} height={1660} fill="#33397A" />
        <rect x={80} y={160} width={340} height={360} rx={16} fill="#0B1433" stroke="#1C2257" strokeWidth={12} />
        <circle cx={330} cy={250} r={40} fill="#FFF3C4" />
        <circle cx={348} cy={238} r={36} fill="#0B1433" />
        <rect x={244} y={160} width={12} height={360} fill="#1C2257" />
        {/* cartel 24/7 dibujado */}
        <g transform="translate(640 110) rotate(3)">
          <rect x={0} y={0} width={300} height={190} rx={18} fill="#F7F9FC" stroke={K.navy} strokeWidth={6} />
          <text x={150} y={118} textAnchor="middle" fontFamily={FUENTE} fontWeight={900} fontSize={96} fill={K.rojo}>
            24/7
          </text>
          <circle cx={150} cy={-6} r={12} fill={K.rojo} />
        </g>
        <rect x={0} y={1660} width={1080} height={260} fill="#3B2A4F" />
        <rect x={0} y={1654} width={1080} height={12} fill="#24193A" />
      </svg>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${sacude}px)`}}>
        <Persona quien="rosa" frame={frame} vol={0} habla={false} x={RX} y={RY} ancho={RA} pose={{brazoI: -160 * coge, brazoD: l >= tSuelta ? -25 * clamp01((l - tSuelta) / 6) : 0, cabeza: l >= tCoge ? -6 : Math.sin(frame / 3) * 3}} extra={extra} />
      </div>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {/* escritorio delante */}
        <rect x={60} y={1560} width={960} height={40} rx={12} fill="#8A5A33" stroke={K.navy} strokeWidth={6} />
        <rect x={100} y={1596} width={880} height={130} fill="#6A4527" stroke={K.navy} strokeWidth={6} />
        {/* ondas y bocadillos de llamada */}
        {l < tCoge && (
          <>
            <g transform={`translate(${rp(166, 812)[0]} ${rp(166, 812)[1]})`}>
              <Ondas frame={frame} r={40} />
            </g>
            <g transform={`translate(${hdx} ${hdy - 20})`}>
              <Ondas frame={frame + 3} r={40} />
            </g>
          </>
        )}
        {l < tCae && (
          <g transform={`translate(${bx} ${by})`}>
            <Ondas frame={frame + 5} r={34} />
          </g>
        )}
        <Bocadillo x={150} y={1150} k={l < tCoge ? pop(l, 2) : 0} />
        <Bocadillo x={900} y={1120} k={l < tSuelta ? pop(l, 6) : 0} />
        <Bocadillo x={880} y={860} k={l < tCae ? pop(l, 10) : 0} />
        {l >= tCoge && <Bocadillo x={150} y={870} k={pop(l, tCoge + 2)} texto="🗣️" />}
        {l >= tSuelta && <MovilCae x0={hdx} y0={hdy} x1={hdx + 60} y1={1800} p={(l - tSuelta) / 16} />}
        {l >= tCae && <MovilCae x0={bx} y0={by} x1={bx - 120} y1={1820} p={(l - tCae) / 16} />}
      </svg>
      <Txt top={430} size={70} k={pop(l, e.at('Tres'), 0.2)} rot={-2}>
        3 móviles 📱📱📱
      </Txt>
      <Txt top={520} size={60} k={pop(l, e.at('manos'), 0.2)} color={K.oro} rot={2}>
        … y 2 manos
      </Txt>
    </AbsoluteFill>
  );
};

// ───────── Escena · El agente de voz ─────────
const Agente: React.FC<Ctx> = ({l, frame, e}) => {
  const pasos: [string, string, number][] = [
    ['📞', 'Coge la llamada', e.at('coge')],
    ['📝', 'Apunta servicio, nombre, teléfono y dirección', e.at('apunta')],
    ['📅', 'Agenda la cita', e.at('agenda')],
    ['🔔', 'Avisa al técnico', e.at('avisa')],
  ];
  const flecha = clamp01((l - pasos[0][2]) / Math.max(1, pasos[3][2] - pasos[0][2] + 6));
  return (
    <AbsoluteFill>
      <Fondo frame={frame} de="#1D3E9E" />
      <Txt top={110} size={66} color={K.oro} k={pop(l, 2)}>
        Agente de voz 24/7 🎧
      </Txt>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d={`M110,${310} L110,${310 + 660 * flecha}`} stroke={K.oro} strokeWidth={10} strokeLinecap="round" />
        {flecha > 0.02 && <path d={`M92,${300 + 660 * flecha} L110,${330 + 660 * flecha} L128,${300 + 660 * flecha}`} stroke={K.oro} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      {pasos.map(([ico, t, t0], i) => {
        const k = pop(l, t0, 0.18);
        return (
          <div key={i} style={{position: 'absolute', left: 60, width: 870, top: 240 + i * 200, height: 168, transform: `scale(${Math.max(0, k)})`, transformOrigin: '0 50%', opacity: k > 0 ? 1 : 0.0}}>
            <div style={{position: 'absolute', inset: 0, background: '#0B1638', border: `5px solid ${K.oro}`, borderRadius: 30, display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px', fontFamily: FUENTE}}>
              <div style={{width: 96, height: 96, borderRadius: 48, background: K.oro, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54, flexShrink: 0}}>{ico}</div>
              <div style={{fontWeight: 900, fontSize: i === 1 ? 46 : 56, color: '#fff', lineHeight: 1.1}}>{t}</div>
              <div style={{marginLeft: 'auto', fontWeight: 900, fontSize: 40, color: K.oro, flexShrink: 0}}>{i + 1}</div>
            </div>
          </div>
        );
      })}
      <Aura frame={frame} vol={0} ancho={430} clase="aura-b" saluda={l < 20} style={{left: 520, top: 1110}} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(330 1500) scale(${0.55 * rebote(l - 4, 1.2)})`}>
          <MovilGen frame={frame} vibra={l < pasos[0][2] ? 1 : 0} color={l >= pasos[0][2] ? K.verde : '#17338A'}>
            <text x={0} y={20} textAnchor="middle" fontSize={90} fontFamily={FUENTE}>
              {l >= pasos[0][2] ? '✅' : '📞'}
            </text>
          </MovilGen>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ───────── Truco gratis · mensaje de ausencia ─────────
const TrucoB: React.FC<Ctx> = ({l, frame, e, vol}) => {
  const tMsg = e.at('mensaje');
  const kMsg = pop(l, tMsg, 0.15);
  return (
    <Truco
      l={l}
      frame={frame}
      quien="riyad"
      vol={vol}
      subtitulo="Mensaje de ausencia automático"
      tSub={e.at('pon')}
      items={[
        ['👤', 'Nombre', e.at('nombre')],
        ['📍', 'Dirección', e.at('dirección')],
        ['❓', 'Qué ha pasado', e.at('pasado')],
      ]}
    >
      <g transform="translate(0 -110)">
        <rect x={-370} y={-120} width={740} height={320} rx={28} fill="#E9EEF7" stroke="#22408F" strokeWidth={4} />
        <rect x={-370} y={-120} width={740} height={56} rx={28} fill="#16327F" />
        <rect x={-370} y={-90} width={740} height={26} fill="#16327F" />
        <circle cx={-330} cy={-92} r={16} fill={K.turqCl} />
        <text x={-300} y={-82} fontFamily={FUENTE} fontWeight={800} fontSize={28} fill="#fff">
          Cliente · 03:12
        </text>
        <g opacity={clamp01((l - 4) / 6)}>
          <rect x={-350} y={-50} width={420} height={56} rx={18} fill="#fff" stroke="#C9D3E8" strokeWidth={3} />
          <text x={-330} y={-12} fontFamily={FUENTE} fontWeight={700} fontSize={28} fill="#1B2440">
            ¡Hola! Tengo una urgencia…
          </text>
        </g>
        <g transform={`translate(350 20) scale(${Math.max(0, kMsg)}) translate(-350 -20)`}>
          <rect x={-250} y={20} width={600} height={164} rx={20} fill="#CDEFD9" stroke="#7BC59A" strokeWidth={3} />
          {['Ahora no podemos atenderte. Déjanos', 'tu nombre, dirección y qué ha', 'pasado, y te llamamos.'].map((t, i) => (
            <text key={i} x={-230} y={62 + i * 42} fontFamily={FUENTE} fontWeight={700} fontSize={29} fill="#1B2440">
              {t}
            </text>
          ))}
          <text x={330} y={176} textAnchor="end" fontFamily={FUENTE} fontWeight={700} fontSize={20} fill="#4A7A5C">
            automático ✓✓
          </text>
        </g>
      </g>
    </Truco>
  );
};

const RosaAdios: React.FC<{frame: number}> = ({frame}) => (
  <Persona quien="rosa" frame={frame} vol={0} habla={false} x={540} y={1170} ancho={270} pose={{brazoD: -150 + Math.sin(frame * 0.5) * 18}} extra={`${oculta('movil-izq')}\n${oculta('movil-bolsillo')}`} />
);

export const VideoB: React.FC<PropsReel> = (props) => (
  <Reel
    props={props}
    minimos={MIN_B}
    escena={(c) => {
      switch (c.e.id) {
        case 'intro':
          return <Intro l={c.l} frame={c.frame} cfg={c.cfg} dia={2} vol={c.vol} />;
        case 'ayer':
          return <Ayer {...c} />;
        case 'rosa':
          return <Rosa3 {...c} />;
        case 'agente':
          return <Agente {...c} />;
        case 'truco':
          return <TrucoB {...c} />;
        default:
          return <Cierre l={c.l} frame={c.frame} e={c.e} vol={c.vol} cfg={c.cfg} fondo={<RosaAdios frame={c.frame} />} />;
      }
    }}
    sfx={(L: Linea): Sfx[] => {
      const r = L.esc('rosa')!;
      const a = L.esc('agente')!;
      const t = L.esc('truco')!;
      return [
        [r.desde + 2, 'telefono', 0.25],
        [r.desde + 6, 'tono2', 0.2],
        [r.desde + r.at('solo') + 14, 'tropiezo', 0.25],
        [r.desde + r.at('manos') + 14, 'tropiezo', 0.25],
        ...['coge', 'apunta', 'agenda', 'avisa'].map((w) => [a.desde + a.at(w), 'pop', 0.22] as Sfx),
        [t.desde + t.at('mensaje'), 'pop', 0.22],
        ...['nombre', 'dirección', 'pasado'].map((w) => [t.desde + t.at(w), 'tick', 0.3] as Sfx),
      ];
    }}
  />
);
