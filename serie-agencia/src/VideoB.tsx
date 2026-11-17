/**
 * Vídeo B · "Día 2: los tres móviles de Rosa" (multiservicios 24/7, agente de voz).
 * Estructura: gancho → introducción → cuerpo 1 → bucle → cuerpo 2 → bucle → cuerpo 3 (truco) → acción → frase que empalma con el gancho.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeIn, easeOut, rebote} from './anim';
import {Aura} from './Aura';
import {Cierre, Ctx, FUENTE, Fondo, Intro, K, Linea, MovilGen, Ondas, PropsReel, Reel, Sfx, Truco, Txt, VideoCfg, pop} from './comun';
import {Persona} from './Persona';

export const MIN_B: Record<string, number> = {gancho: 2.6, intro: 0, cae: 2.7, bucle1: 0, agente: 0, bucle2: 0, truco: 5.4, cierre: 6.4, bucle: 0};

const NUNCA = 1e9;

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

/** Pósit pequeño del seguidor del día (en el gancho). */
const PositGancho: React.FC<{l: number; cfg: VideoCfg}> = ({l, cfg}) => {
  const k = pop(l, 4, 0.2);
  return (
    <div style={{position: 'absolute', left: 60, top: 80, width: 400, height: 290, background: '#FFE066', borderRadius: 12, boxShadow: '0 18px 0 rgba(0,0,0,.25)', transform: `rotate(-4deg) scale(${Math.max(0, k)})`, opacity: k > 0 ? 1 : 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FUENTE}}>
      <div style={{position: 'absolute', top: -18, width: 140, height: 40, background: 'rgba(255,255,255,.55)', transform: 'rotate(3deg)'}} />
      <div style={{fontWeight: 900, fontSize: Math.min(56, Math.floor(370 / (cfg.SEGUIDOR.length * 0.6))), color: K.marino, whiteSpace: 'nowrap'}}>{cfg.SEGUIDOR}</div>
      <div style={{fontWeight: 800, fontSize: 40, color: K.marino, marginTop: 16}}>nos sigue 💛</div>
    </div>
  );
};

// ───────── Rosa y sus tres móviles (gancho, cuerpo 1 y bucle final) ─────────
const RX = 520;
const RY = 600;
const RA = 660;
const rk = RA / 600;
const rp = (x: number, y: number): [number, number] => [RX - RA / 2 + x * rk, RY + y * rk];

/** tCoge: coge el móvil de la izquierda · tSuelta: se le cae el de la derecha (fotogramas locales; NUNCA = no pasa). */
const RosaEscena: React.FC<{l: number; frame: number; tCoge?: number; tSuelta?: number; children?: React.ReactNode}> = ({l, frame, tCoge = NUNCA, tSuelta = NUNCA, children}) => {
  const coge = easeOut((l - tCoge) / 8);
  const [hdx, hdy] = rp(428, 836);
  const [bx, by] = rp(372, 700);
  const extra = [vibraCss('movil-izq', frame, l < tCoge), l < tSuelta ? vibraCss('movil-der', frame, true, 7) : oculta('movil-der'), vibraCss('movil-bolsillo', frame, true, 13)].join('\n');
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
        <rect x={60} y={1560} width={960} height={40} rx={12} fill="#8A5A33" stroke={K.navy} strokeWidth={6} />
        <rect x={100} y={1596} width={880} height={130} fill="#6A4527" stroke={K.navy} strokeWidth={6} />
        {l < tCoge && (
          <g transform={`translate(${rp(166, 812)[0]} ${rp(166, 812)[1]})`}>
            <Ondas frame={frame} r={40} />
          </g>
        )}
        {l < tSuelta && (
          <g transform={`translate(${hdx} ${hdy - 20})`}>
            <Ondas frame={frame + 3} r={40} />
          </g>
        )}
        <g transform={`translate(${bx} ${by})`}>
          <Ondas frame={frame + 5} r={34} />
        </g>
        <Bocadillo x={150} y={1150} k={l < tCoge ? pop(l, 2) : 0} />
        <Bocadillo x={880} y={1120} k={l < tSuelta ? pop(l, 6) : 0} />
        <Bocadillo x={860} y={860} k={pop(l, 10)} />
        {l >= tCoge && <Bocadillo x={150} y={870} k={pop(l, tCoge + 2)} texto="🗣️" />}
        {l >= tSuelta && <MovilCae x0={hdx} y0={hdy} x1={hdx + 60} y1={1800} p={(l - tSuelta) / 16} />}
      </svg>
      {children}
    </AbsoluteFill>
  );
};

// 1 · Gancho
const Gancho: React.FC<Ctx> = ({l, frame, e, cfg}) => (
  <RosaEscena l={l} frame={frame}>
    <PositGancho l={l} cfg={cfg} />
    <Txt top={430} size={70} k={pop(l, e.at('Tres'), 0.2)} rot={-2}>
      3 móviles 📱📱📱
    </Txt>
    <Txt top={520} size={60} k={pop(l, e.at('manos'), 0.2)} color={K.oro} rot={2}>
      … y 2 manos
    </Txt>
  </RosaEscena>
);

// 3 · Cuerpo 1: se le cae un móvil y la llamada se pierde
const Cae: React.FC<Ctx> = ({l, frame, e}) => {
  const tSuelta = e.at('cae');
  return (
    <RosaEscena l={l} frame={frame} tCoge={e.at('Coge')} tSuelta={tSuelta}>
      <Txt top={440} size={76} color={K.rojo} k={pop(l, tSuelta + 16, 0.25)} rot={-3}>
        📵 Llamada perdida
      </Txt>
    </RosaEscena>
  );
};

/** Móvil grande con la llamada perdida en pantalla. */
const MovilPerdida: React.FC<{x: number; y: number; k: number; frame: number}> = ({x, y, k, frame}) => (
  <g transform={`translate(${x} ${y}) scale(${Math.max(0.01, k) * 1.5}) rotate(${Math.sin(frame / 10) * 2})`}>
    <MovilGen color="#7A1F2B">
      <text x={0} y={-30} textAnchor="middle" fontSize={70} fontFamily={FUENTE}>
        📵
      </text>
      <text x={0} y={30} textAnchor="middle" fontSize={20} fontWeight={900} fill="#fff" fontFamily={FUENTE}>
        LLAMADA
      </text>
      <text x={0} y={56} textAnchor="middle" fontSize={20} fontWeight={900} fill="#fff" fontFamily={FUENTE}>
        PERDIDA
      </text>
    </MovilGen>
  </g>
);

// 4 · Bucle: "Pero lo peor no es perder la llamada…"
const Bucle1: React.FC<Ctx> = ({l, frame, e, vol}) => (
  <AbsoluteFill>
    <Fondo frame={frame} de="#2A2F6E" />
    <Txt top={150} size={80} color={K.oro} k={pop(l, e.at('peor'), 0.2)}>
      Lo peor…
    </Txt>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <MovilPerdida x={465} y={620} k={rebote(l - 2, 1.2)} frame={frame} />
    </svg>
    <Persona quien="riyad" frame={frame} vol={vol('riyad')} habla={vol('riyad') > 0} x={500} y={1215} ancho={470} pose={{brazoD: -40, cabeza: -5}} />
  </AbsoluteFill>
);

/** Edificio genérico (sin marca). */
const Edificio: React.FC<{x: number; y: number; k: number}> = ({x, y, k}) => (
  <g transform={`translate(${x} ${y}) scale(${Math.max(0.01, k)})`}>
    <rect x={-130} y={-200} width={260} height={360} rx={12} fill="#5A6280" stroke={K.navy} strokeWidth={6} />
    {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={-95 + c * 110} y={-165 + r * 90} width={80} height={60} rx={8} fill="#BFD0F2" />))}
    <rect x={-35} y={95} width={70} height={65} rx={6} fill="#2E3450" />
  </g>
);

// 5 · Cuerpo 2: el cliente llama a otro → el agente de voz
const Agente: React.FC<Ctx> = ({l, frame, e}) => {
  const tAg = e.at('agente');
  if (l < tAg - 2) {
    const tOtro = e.at('otro');
    const flecha = clamp01((l - e.at('llama')) / 10);
    return (
      <AbsoluteFill>
        <Fondo frame={frame} de="#2A2F6E" />
        <Txt top={150} size={70} color={K.oro} k={pop(l, e.at('llama'), 0.2)}>
          …y llama a otro 😬
        </Txt>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <g transform={`translate(230 760) scale(${Math.max(0.01, pop(l, e.at('cliente')))})`}>
            <circle r={110} fill="#F7F9FC" stroke={K.navy} strokeWidth={6} />
            <text y={40} textAnchor="middle" fontSize={120} fontFamily={FUENTE}>
              👤
            </text>
            <text y={170} textAnchor="middle" fontSize={44} fontWeight={900} fill="#fff" fontFamily={FUENTE}>
              Cliente
            </text>
          </g>
          <path d={`M370,760 L${370 + 260 * flecha},760`} stroke={K.oro} strokeWidth={10} strokeDasharray="22 16" strokeLinecap="round" />
          {flecha > 0.9 && <path d="M612,738 L640,760 L612,782" stroke={K.oro} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          <Edificio x={790} y={740} k={pop(l, tOtro, 0.2)} />
          <text x={790} y={970} textAnchor="middle" fontSize={44} fontWeight={900} fill="#fff" fontFamily={FUENTE} opacity={l >= tOtro ? 1 : 0}>
            Otra empresa
          </text>
        </svg>
      </AbsoluteFill>
    );
  }
  const la = l - (tAg - 2);
  const pasos: [string, string, number][] = [
    ['📞', 'Coge la llamada', e.at('coge')],
    ['📝', 'Apunta los datos del cliente', e.at('apunta')],
    ['📅', 'Agenda la cita', e.at('agenda')],
    ['🔔', 'Avisa al técnico', e.at('avisa')],
  ];
  const flecha = clamp01((l - pasos[0][2]) / Math.max(1, pasos[3][2] - pasos[0][2] + 6));
  return (
    <AbsoluteFill>
      <Fondo frame={frame} de="#1D3E9E" />
      <Txt top={110} size={66} color={K.oro} k={pop(la, 2)}>
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
              <div style={{fontWeight: 900, fontSize: 52, color: '#fff', lineHeight: 1.1}}>{t}</div>
              <div style={{marginLeft: 'auto', fontWeight: 900, fontSize: 40, color: K.oro, flexShrink: 0}}>{i + 1}</div>
            </div>
          </div>
        );
      })}
      <Aura frame={frame} vol={0} ancho={430} clase="aura-b" saluda={la < 20} style={{left: 520, top: 1110}} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(330 1500) scale(${0.55 * rebote(la - 4, 1.2)})`}>
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

// 6 · Bucle: "¿Y si todavía no quieres nada de esto? Para eso es el truco gratis."
const Bucle2: React.FC<Ctx> = ({l, frame, e, vol}) => {
  const tT = e.at('truco');
  const k = rebote(l - tT, 1.1);
  return (
    <AbsoluteFill>
      <Fondo frame={frame} />
      <Txt top={150} size={80} k={pop(l, e.at('todavía'), 0.2)}>
        ¿Todavía no? 🤔
      </Txt>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {l >= tT && (
          <g transform={`translate(465 640) rotate(${-4 + Math.sin(frame / 12) * 2}) scale(${Math.max(0.01, k)})`}>
            <rect x={-330} y={-170} width={660} height={340} rx={36} fill="#0B1638" stroke={K.oro} strokeWidth={8} />
            <text x={0} y={-30} textAnchor="middle" fontFamily={FUENTE} fontSize={110}>
              🎁
            </text>
            <text x={0} y={110} textAnchor="middle" fontFamily={FUENTE} fontWeight={900} fontSize={84} fill={K.oro}>
              TRUCO GRATIS
            </text>
          </g>
        )}
      </svg>
      <Persona quien="kevin" frame={frame} vol={vol('kevin')} habla={vol('kevin') > 0} x={500} y={1215} ancho={470} pose={{brazoD: l >= tT ? -120 * easeOut((l - tT) / 8) : -10, cabeza: 4}} />
    </AbsoluteFill>
  );
};

// 7 · Cuerpo 3: truco gratis · mensaje de ausencia
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

/** Pastilla "Comenta 24H" dentro de la pared del cierre. */
const Comenta: React.FC<{k: number}> = ({k}) => (
  <div style={{position: 'absolute', left: 0, right: 150, top: 840, display: 'flex', justifyContent: 'center', opacity: k > 0 ? 1 : 0}}>
    <div style={{transform: `scale(${Math.max(0, k)}) rotate(-2deg)`, background: K.oro, color: K.marino, fontFamily: FUENTE, fontWeight: 900, fontSize: 62, padding: '10px 40px', borderRadius: 50, boxShadow: '0 10px 0 rgba(6,12,40,.45)', whiteSpace: 'nowrap'}}>💬 Comenta 24H</div>
  </div>
);

export const VideoB: React.FC<PropsReel> = (props) => (
  <Reel
    props={props}
    minimos={MIN_B}
    sinEntrada={['gancho']}
    escena={(c) => {
      switch (c.e.id) {
        case 'gancho':
          return <Gancho {...c} />;
        case 'intro':
          return <Intro l={c.l} frame={c.frame} cfg={c.cfg} dia={2} vol={c.vol} />;
        case 'cae':
          return <Cae {...c} />;
        case 'bucle1':
          return <Bucle1 {...c} />;
        case 'agente':
          return <Agente {...c} />;
        case 'bucle2':
          return <Bucle2 {...c} />;
        case 'truco':
          return <TrucoB {...c} />;
        case 'cierre':
          return (
            <Cierre l={c.l} frame={c.frame} e={c.e} vol={c.vol} cfg={c.cfg} fondo={<RosaAdios frame={c.frame} />}>
              <Comenta k={pop(c.l, c.e.at('Comenta'), 0.2)} />
            </Cierre>
          );
        default:
          // frase final que empalma con el gancho: Rosa vuelve a estar con los tres móviles sonando
          return <RosaEscena l={c.l} frame={c.frame} />;
      }
    }}
    sfx={(L: Linea): Sfx[] => {
      const g = L.esc('gancho')!;
      const ca = L.esc('cae')!;
      const a = L.esc('agente')!;
      const b2 = L.esc('bucle2')!;
      const t = L.esc('truco')!;
      const c = L.esc('cierre')!;
      const f = L.esc('bucle')!;
      return [
        [g.desde + 2, 'telefono', 0.25],
        [g.desde + 6, 'tono2', 0.2],
        [ca.desde + ca.at('cae') + 14, 'tropiezo', 0.25],
        [ca.desde + ca.at('cae') + 16, 'boing', 0.2],
        [a.desde + a.at('otro'), 'pop', 0.22],
        [a.desde + a.at('agente') - 2, 'whoosh', 0.25],
        ...['coge', 'apunta', 'agenda', 'avisa'].map((w) => [a.desde + a.at(w), 'pop', 0.22] as Sfx),
        [b2.desde + b2.at('truco'), 'ding', 0.25],
        [t.desde + t.at('mensaje'), 'pop', 0.22],
        ...['nombre', 'dirección', 'pasado'].map((w) => [t.desde + t.at(w), 'tick', 0.3] as Sfx),
        [c.desde + c.at('Comenta'), 'pop', 0.22],
        [f.desde + 2, 'telefono', 0.25],
      ];
    }}
  />
);
