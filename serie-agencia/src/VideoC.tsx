/** Vídeo C · "Día 2: Jordi y las preguntas de siempre" (climatización, chatbot web). */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeOut, rebote} from './anim';
import {Aura} from './Aura';
import {Cierre, Ctx, FUENTE, Intro, K, Linea, Ondas, PropsReel, Reel, Sfx, Truco, Txt, pop} from './comun';
import {Persona} from './Persona';

export const MIN_C: Record<string, number> = {intro: 3.4, jordi: 5.4, chatbot: 7.6, truco: 5.6, cierre: 0};

const PREGUNTAS = ['¿Venís a Tarragona?', '¿Cuánto tardáis?', '¿Hacéis calderas?', '¿Venís a Tarragona?', '¿Cuánto tardáis?'];

/** Fachada con la máquina de aire (genérica) y la escalera. */
const Fachada: React.FC<{frame: number}> = ({frame}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <rect width={1080} height={1920} fill="#7FB2E5" />
    <circle cx={140} cy={160} r={70} fill="#FFE08A" />
    <rect x={180} y={260} width={900} height={1500} fill="#E8D3B0" stroke={K.navy} strokeWidth={8} />
    {[...Array(14)].map((_, i) => <rect key={i} x={180} y={300 + i * 104} width={900} height={4} fill="#D8BF96" />)}
    {[[230, 340], [230, 1000]].map(([x, y], i) => (
      <g key={i}>
        <rect x={x} y={y} width={200} height={260} rx={10} fill="#9CC2EE" stroke={K.navy} strokeWidth={7} />
        <rect x={x + 94} y={y} width={12} height={260} fill={K.navy} />
        <rect x={x - 14} y={y + 260} width={228} height={18} rx={6} fill="#C9B08A" stroke={K.navy} strokeWidth={5} />
      </g>
    ))}
    {/* máquina de aire acondicionado genérica, sin marca */}
    <g transform="translate(640 640)">
      <rect x={0} y={0} width={380} height={250} rx={22} fill="#F4F6FA" stroke={K.navy} strokeWidth={7} />
      <circle cx={130} cy={125} r={92} fill="#DCE3EE" stroke={K.navy} strokeWidth={6} />
      <g transform={`rotate(${frame * 9} 130 125)`}>
        {[0, 1, 2, 3].map((i) => <path key={i} d="M130,125 Q150,60 130,48 Q110,60 130,125" fill="#9FAAB6" transform={`rotate(${i * 90} 130 125)`} />)}
      </g>
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={250} y={50 + i * 34} width={100} height={12} rx={6} fill="#C9D1DE" />)}
      <rect x={40} y={250} width={20} height={60} fill="#9FAAB6" />
      <rect x={320} y={250} width={20} height={60} fill="#9FAAB6" />
    </g>
    <rect x={0} y={1760} width={1080} height={160} fill="#8A8F99" />
  </svg>
);

/** Escalera + Jordi subido (piernas dibujadas sobre los peldaños). `giro` en grados alrededor del pie de la escalera. */
const JordiEscalera: React.FC<{frame: number; vol?: number; giro?: number; brazoD?: number; brazoI?: number; extra?: string; x?: number; ancho?: number; y?: number}> = ({frame, giro = 0, brazoD = -120, brazoI = 10, extra = '', x = 560, ancho = 440, y = 760}) => {
  const k = ancho / 600;
  const cad = y + 900 * k; // cadera
  return (
    <div style={{position: 'absolute', inset: 0, transform: `rotate(${giro}deg)`, transformOrigin: `${x}px 1800px`}}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {/* piernas */}
        {[-1, 1].map((s) => (
          <g key={s}>
            <rect x={x + s * 52 * k * 1.6 - 34} y={cad - 20} width={68} height={260} rx={24} fill="#6E747E" stroke={K.navy} strokeWidth={5} />
            <path d={`M${x + s * 83 * k - 40},${cad + 230} L${x + s * 83 * k + 50},${cad + 230} L${x + s * 83 * k + 54},${cad + 268} L${x + s * 83 * k - 44},${cad + 268} Z`} fill="#2E3237" stroke={K.navy} strokeWidth={5} strokeLinejoin="round" />
          </g>
        ))}
      </svg>
      <Persona quien="jordi" frame={frame} vol={0} habla={false} x={x} y={y} ancho={ancho} pose={{brazoD, brazoI, cabeza: 0}} extra={extra} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {/* escalera delante de las piernas */}
        <g stroke="#B7BEC9" strokeWidth={22} strokeLinecap="round">
          <line x1={x - 150} y1={1800} x2={x - 120} y2={cad - 80} />
          <line x1={x + 150} y1={1800} x2={x + 120} y2={cad - 80} />
        </g>
        {[...Array(6)].map((_, i) => {
          const yy = 1760 - i * ((1760 - cad + 40) / 5.5);
          return <line key={i} x1={x - 145 + i * 5} y1={yy} x2={x + 145 - i * 5} y2={yy} stroke="#9AA3B0" strokeWidth={16} strokeLinecap="round" />;
        })}
      </svg>
    </div>
  );
};

const Burbuja: React.FC<{x: number; y: number; k: number; t: string}> = ({x, y, k, t}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `scale(${Math.max(0, k)})`, transformOrigin: '0 100%', opacity: k > 0 ? 1 : 0, fontFamily: FUENTE, fontWeight: 800, fontSize: 48, color: '#1B2440', background: '#fff', border: `5px solid ${K.navy}`, borderRadius: 26, padding: '12px 22px', whiteSpace: 'nowrap', boxShadow: '0 8px 0 rgba(6,12,40,.3)'}}>
    💬 {t}
  </div>
);

// ───────── Escena · Jordi en la escalera, preguntas que se repiten ─────────
const JordiEsc: React.FC<Ctx> = ({l, frame, e}) => {
  const t0 = e.at('cada') - 10;
  const vibra = l >= 6;
  return (
    <AbsoluteFill>
      <Fachada frame={frame} />
      <JordiEscalera frame={frame} brazoD={-118 + Math.sin(frame / 5) * 6} extra={vibra ? '{c} #movil-jordi { display: none; }' : ''} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {vibra && (
          <g transform="translate(470 1500)">
            <Ondas frame={frame} r={46} />
            <text x={0} y={18} textAnchor="middle" fontSize={50} fontFamily={FUENTE} transform={`rotate(${Math.sin(frame * 2.7) * 10})`}>
              📳
            </text>
          </g>
        )}
      </svg>
      {PREGUNTAS.map((p, i) => (
        <Burbuja key={i} x={40 + (i % 2) * 50} y={150 + i * 100} k={pop(l, Math.max(6, t0) + i * 12, 0.2)} t={p} />
      ))}
    </AbsoluteFill>
  );
};

// ───────── Escena sin voz · la escalera se tambalea ─────────
const Escalera: React.FC<Ctx> = ({l, frame}) => {
  // 0-0.5 s: saca el móvil · 0.5-1.6 s: tambaleo · 1.6 s: se agarra a la máquina · 2 s: "uff"
  const amp = l < 14 ? 0 : l < 48 ? 7 * Math.sin(((l - 14) / 34) * Math.PI) : 0;
  const giro = Math.sin(l * 0.75) * amp;
  const agarra = l >= 46;
  return (
    <AbsoluteFill>
      <Fachada frame={frame} />
      <JordiEscalera
        frame={frame}
        giro={giro}
        brazoI={agarra ? 10 : -150 * easeOut(l / 8)}
        brazoD={agarra ? -125 : -60 + Math.sin(frame) * 30 * (amp / 7)}
        extra={agarra ? '{c} #movil-jordi { display: none; }' : '{c} #movil-jordi { display: inline !important; }'}
      />
      {amp > 0.5 && (
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {[-1, 1].map((s) => (
            <path key={s} d={`M${560 + s * 220},${1700} q${s * 20},-30 0,-60 q${-s * 20},-30 0,-60`} stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.8} />
          ))}
        </svg>
      )}
      {l >= 52 && (
        <div style={{position: 'absolute', left: 120, top: 380, transform: `scale(${pop(l, 52, 0.25)}) rotate(-6deg)`, fontFamily: FUENTE, fontWeight: 900, fontSize: 96, color: '#fff', WebkitTextStroke: '10px #0A1A44', paintOrder: 'stroke fill'}}>uff… 😮‍💨</div>
      )}
    </AbsoluteFill>
  );
};

// ───────── Escena · Chatbot en la web ─────────
const Chatbot: React.FC<Ctx> = ({l, frame, e}) => {
  const tR = e.at('responde');
  const tD = e.at('recoge');
  const tA = e.at('agenda');
  const msgs: [boolean, string, number][] = [
    [false, '¿Venís a Tarragona?', 6],
    [true, '¡Sí! ¿Te agendo una visita?', tR + 4],
    [true, 'Dime tu nombre, teléfono y dirección 👇', tD],
  ];
  const campos = ['Nombre', 'Teléfono', 'Dirección'];
  return (
    <AbsoluteFill style={{background: '#16224F'}}>
      <div style={{position: 'absolute', left: 30, top: 110, width: 900, height: 1040, borderRadius: 30, background: '#F7F9FC', border: `8px solid ${K.navy}`, overflow: 'hidden', fontFamily: FUENTE, transform: `scale(${0.9 + 0.1 * easeOut(l / 10)})`}}>
        <div style={{height: 60, background: '#E3E8F2', display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 22}}>
          {['#E5484D', '#F2B932', '#2FD27A'].map((c) => <div key={c} style={{width: 20, height: 20, borderRadius: 10, background: c}} />)}
          <div style={{marginLeft: 16, flex: 1, marginRight: 22, height: 36, borderRadius: 18, background: '#fff', fontSize: 24, color: '#7A84A0', display: 'flex', alignItems: 'center', paddingLeft: 18}}>web de ejemplo</div>
        </div>
        <div style={{height: 110, background: '#D23B32', display: 'flex', alignItems: 'center', padding: '0 30px', color: '#fff', fontWeight: 900, fontSize: 48}}>❄️ Jordi Climatización</div>
        <div style={{padding: '30px 30px 0', color: '#1B2440'}}>
          <div style={{fontWeight: 900, fontSize: 46, lineHeight: 1.1}}>Instalación y mantenimiento de aire acondicionado</div>
          <div style={{marginTop: 20, display: 'flex', gap: 16}}>
            {[0, 1].map((i) => <div key={i} style={{flex: 1, height: 120, borderRadius: 18, background: '#DCE3EE'}} />)}
          </div>
        </div>
        {/* ventana del chat con Aura */}
        <div style={{position: 'absolute', right: 20, bottom: 20, width: 640, height: 640, borderRadius: 28, background: '#fff', border: `5px solid ${K.azul}`, boxShadow: '0 12px 30px rgba(14,30,74,.35)', transform: `scale(${pop(l, 3, 0.12)})`, transformOrigin: '100% 100%', overflow: 'hidden'}}>
          <div style={{height: 90, background: K.marino, display: 'flex', alignItems: 'center', paddingLeft: 110, color: '#fff', fontWeight: 900, fontSize: 34}}>
            Aura · asistente
            <span style={{marginLeft: 12, width: 14, height: 14, borderRadius: 7, background: K.verde, display: 'inline-block'}} />
          </div>
          <div style={{position: 'absolute', left: 6, top: -6, width: 100, height: 100, overflow: 'hidden'}}>
            <Aura frame={frame} vol={0} ancho={150} clase="aura-c" style={{left: -25, top: -14}} />
          </div>
          <div style={{padding: 18, display: 'flex', flexDirection: 'column', gap: 12}}>
            {msgs.map(([bot, t, t0], i) => {
              const k = pop(l, t0, 0.12);
              return (
                <div key={i} style={{alignSelf: bot ? 'flex-start' : 'flex-end', maxWidth: 470, fontSize: 30, fontWeight: 700, lineHeight: 1.2, padding: '12px 18px', borderRadius: 20, background: bot ? '#E3ECFF' : K.oro, color: '#1B2440', transform: `scale(${Math.max(0, k)})`, opacity: k > 0 ? 1 : 0, transformOrigin: bot ? '0 50%' : '100% 50%'}}>
                  {t}
                </div>
              );
            })}
            <div style={{display: 'flex', gap: 10}}>
              {campos.map((c, i) => {
                const k = pop(l, tD + 8 + i * 5, 0.15);
                return (
                  <div key={c} style={{flex: 1, fontSize: 24, fontWeight: 800, color: '#1B2440', background: '#F1F4FA', border: '3px solid #C9D3E8', borderRadius: 14, padding: '10px 8px', textAlign: 'center', transform: `scale(${Math.max(0, k)})`, opacity: k > 0 ? 1 : 0}}>
                    {c} ✓
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* calendario con la visita */}
        <div style={{position: 'absolute', left: 24, bottom: 40, width: 220, borderRadius: 20, background: '#fff', border: `5px solid ${K.navy}`, overflow: 'hidden', transform: `scale(${Math.max(0, pop(l, tA, 0.2))}) rotate(-4deg)`, opacity: l >= tA ? 1 : 0}}>
          <div style={{height: 44, background: K.rojo, color: '#fff', fontWeight: 900, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>📅 Agenda</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, padding: 10}}>
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{height: 34, borderRadius: 8, background: i === 6 ? K.oro : '#E3E8F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: K.marino}}>
                {i === 6 ? '✓' : ''}
              </div>
            ))}
          </div>
          <div style={{textAlign: 'center', fontWeight: 900, fontSize: 26, color: K.marino, paddingBottom: 10}}>Visita ✓</div>
        </div>
      </div>
      <Persona quien="jordi" frame={frame} vol={0} habla={false} x={760} y={1300} ancho={420} pose={{brazoD: l >= tA ? -150 : 0, cabeza: -3}} extra="{c} #destornillador { display: none; }" />
    </AbsoluteFill>
  );
};

// ───────── Truco gratis · preguntas frecuentes ─────────
const TrucoC: React.FC<Ctx> = ({l, frame, e, vol}) => {
  const tA = e.at('apunta');
  const tW = e.at('ponlas');
  const pega = easeOut((l - tW) / 10);
  const lista = ['¿Venís a Tarragona?', '¿Cuánto tardáis?', '¿Hacéis calderas?', '…'];
  return (
    <Truco
      l={l}
      frame={frame}
      quien="kevin"
      vol={vol}
      subtitulo="Las preguntas de siempre, en tu web"
      tSub={tA}
      items={[
        ['✍️', 'Apunta las 10', tA],
        ['🌐', 'Ponlas en tu web', e.at('web')],
      ]}
    >
      {/* libreta que se rellena */}
      <g transform={`translate(${-190 + pega * 0} -100)`}>
        <rect x={-180} y={-120} width={340} height={300} rx={18} fill="#FFF7D6" stroke="#C9A64A" strokeWidth={4} />
        {lista.map((p, i) => (
          <text key={i} x={-160} y={-70 + i * 64} fontFamily={FUENTE} fontWeight={800} fontSize={27} fill="#1B2440" opacity={clamp01((l - tA - 2 - i * 5) / 4)}>
            {p}
          </text>
        ))}
      </g>
      {/* flecha y web con la sección de preguntas frecuentes */}
      <path d="M-10,-40 L40,-40" stroke={K.oro} strokeWidth={8} strokeLinecap="round" opacity={pega} />
      <path d="M30,-56 L48,-40 L30,-24" stroke={K.oro} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={pega} />
      <g transform="translate(220 -100)">
        <rect x={-160} y={-120} width={320} height={300} rx={18} fill="#F7F9FC" stroke="#22408F" strokeWidth={4} />
        <rect x={-160} y={-120} width={320} height={40} rx={18} fill="#D23B32" />
        <rect x={-160} y={-96} width={320} height={16} fill="#D23B32" />
        <text x={0} y={-50} textAnchor="middle" fontFamily={FUENTE} fontWeight={900} fontSize={26} fill="#1B2440">
          Preguntas frecuentes
        </text>
        {[0, 1, 2].map((i) => (
          <g key={i} opacity={clamp01((pega - i * 0.2) * 2)} transform={`translate(0 ${(1 - clamp01((pega - i * 0.2) * 2)) * -30})`}>
            <rect x={-140} y={-24 + i * 64} width={280} height={50} rx={12} fill="#E3ECFF" />
            <text x={-124} y={10 + i * 64} fontFamily={FUENTE} fontWeight={800} fontSize={22} fill="#1B2440">
              {['▸ ¿Venís a Tarragona?', '▸ ¿Cuánto tardáis?', '▸ ¿Hacéis calderas?'][i]}
            </text>
          </g>
        ))}
      </g>
    </Truco>
  );
};

const JordiAdios: React.FC<{frame: number}> = ({frame}) => (
  <div style={{position: 'absolute', inset: 0, transform: 'translate(0px, 70px) scale(0.5)', transformOrigin: '540px 1300px'}}>
    <JordiEscalera frame={frame} x={540} ancho={420} y={500} brazoD={-150 + Math.sin(frame * 0.5) * 22} />
  </div>
);

export const VideoC: React.FC<PropsReel> = (props) => (
  <Reel
    props={props}
    minimos={MIN_C}
    escena={(c) => {
      switch (c.e.id) {
        case 'intro':
          return <Intro l={c.l} frame={c.frame} cfg={c.cfg} dia={2} vol={c.vol} />;
        case 'jordi':
          return <JordiEsc {...c} />;
        case 'escalera':
          return <Escalera {...c} />;
        case 'chatbot':
          return <Chatbot {...c} />;
        case 'truco':
          return <TrucoC {...c} />;
        default:
          return <Cierre l={c.l} frame={c.frame} e={c.e} vol={c.vol} cfg={c.cfg} fondo={<JordiAdios frame={c.frame} />} />;
      }
    }}
    sfx={(L: Linea): Sfx[] => {
      const j = L.esc('jordi')!;
      const s = L.esc('escalera')!;
      const ch = L.esc('chatbot')!;
      const t = L.esc('truco')!;
      const t0 = Math.max(6, j.at('cada') - 10);
      return [
        [j.desde + 6, 'vibra', 0.35],
        ...PREGUNTAS.map((_, i) => [j.desde + t0 + i * 12, 'pop', 0.18] as Sfx),
        [s.desde + 2, 'vibra', 0.3],
        [s.desde + 14, 'boing', 0.35],
        [s.desde + 46, 'tropiezo', 0.2],
        [s.desde + 52, 'uff', 0.5],
        [ch.desde + 6, 'pop', 0.2],
        [ch.desde + ch.at('responde') + 4, 'pop', 0.2],
        [ch.desde + ch.at('recoge'), 'pop', 0.2],
        [ch.desde + ch.at('agenda'), 'ding', 0.2],
        ...['apunta', 'web'].map((w) => [t.desde + t.at(w), 'tick', 0.3] as Sfx),
      ];
    }}
  />
);

export const _r = rebote;
