/**
 * Vídeo SUELTO (no es de la serie): "4 reseñas contra 300" · Laura, recepcionista de una clínica dental. Comenta RESEÑAS.
 * Sin "DÍA X" ni pared de seguidores. Lolo es la mascota y cierra con "Comenta RESEÑAS + dauradalabs.com".
 * Escenas: carteles → pide → zinco → persigue (3 planos) → lolo → cartel (sin voz) → truco → final.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeInOut, easeOut, lerp, rebote} from './anim';
import {Ctx, DlMark, FUENTE, Fondo, K, Linea, PropsReel, Reel, Sfx, Txt, pop} from './comun';
import {Persona, PoseP} from './Persona';
import {EXPR, POSE} from './rig/datos';
import {LoloA} from './rig/LoloA';

export const MIN_L: Record<string, number> = {carteles: 0, pide: 0, zinco: 2.3, persigue: 3.6, lolo: 0, truco: 4.5, final: 0};

const SVG: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);

// ───────── Variantes del paciente (mismo SVG, otro color) ─────────
const variante = (ropa: string, pelo: string, dormido = false) => `{c} .ropa { fill: ${ropa}; } {c} .pelo { fill: ${pelo}; }${dormido ? '' : ' {c} #hinchazon, {c} #algodon { display: none; }'}`;
const PAC_DORMIDO = variante('#E07B39', '#9CA0A8', true);
const PAC_AZUL = variante('#3C7BD6', '#2F1D14');
const PAC_VERDE = variante('#3FA66B', '#C9A24A');
const PAC_MORADO = variante('#8E5CC8', '#4A4A4A');
const LAURA_PALMADA = '{c} #arm-right { display: none; } {c} #facepalm { display: inline; }';
const LAURA_GUINO = '{c} #eyes .eye:nth-of-type(2) { display: none; } {c} #guino { display: inline; }';

/** Piernas dibujadas bajo un personaje de `Persona` (que llega hasta la cintura). `paso`: fase de la zancada (0 = quieto). */
const Piernas: React.FC<{x: number; y: number; ancho: number; pantalon: string; zapato: string; paso?: number}> = ({x, y, ancho, pantalon, zapato, paso = 0}) => {
  const k = ancho / 600;
  const yc = y + 880 * k;
  const largo = 260 * k;
  const pierna = (dx: number, giro: number) => (
    <g transform={`translate(${x + dx * k} ${yc}) rotate(${giro})`}>
      <rect x={-38 * k} y={0} width={76 * k} height={largo} rx={30 * k} fill={pantalon} />
      <ellipse cx={14 * k} cy={largo + 4 * k} rx={56 * k} ry={24 * k} fill={zapato} />
    </g>
  );
  const g = Math.sin(paso) * 28;
  return (
    <g>
      {pierna(-62, g)}
      {pierna(62, -g)}
    </g>
  );
};

/** Gancho en texto arriba (desde el segundo 0). */
const GanchoTxt: React.FC = () => (
  <div style={{position: 'absolute', top: 44, left: 40, right: 150, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: 'rgba(10,20,60,.88)', border: `5px solid ${K.oro}`, borderRadius: 30, padding: '14px 26px', fontFamily: FUENTE, fontWeight: 900, fontSize: 56, lineHeight: 1.1, color: '#fff', textAlign: 'center', boxShadow: '0 10px 0 rgba(0,0,0,.3)'}}>
      <span style={{color: K.oro}}>4</span> reseñas contra <span style={{color: K.oro}}>300</span> de la competencia ⭐
    </div>
  </div>
);

// ───────── Calle: la clínica de enfrente (arriba) y la de Laura (abajo) ─────────
const Calle: React.FC<{
  frame: number;
  /** 0 = cartel de Laura pequeño, apagado y torcido; 1 = encendido y más grande que el de enfrente. */
  crece?: number;
  resenas?: number;
  /** Bamboleo del cartel pequeño (fotogramas desde el golpe). */
  golpe?: number;
  /** El cartel de enfrente chisporrotea. */
  falla?: boolean;
  laura?: {x: number; y: number; ancho: number; pose?: PoseP};
}> = ({frame, crece = 0, resenas = 4, golpe = -1, falla = false, laura = {x: 300, y: 1190, ancho: 420}}) => {
  const parpadeo = Math.sin(frame / 4) > -0.2 ? 1 : 0.55;
  const brilloEnf = falla ? (Math.sin(frame * 2.3) > 0.3 ? 0.35 : 0.9) : parpadeo;
  const c = easeOut(crece);
  const bam = golpe >= 0 ? Math.exp(-golpe / 10) * Math.sin(golpe * 0.8) * 12 : 0;
  return (
    <AbsoluteFill>
      <SVG>
        <defs>
          <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1B3577" />
            <stop offset="1" stopColor="#2A4C9A" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#cielo)" />
        {/* edificio de enfrente */}
        <rect x={50} y={250} width={980} height={730} rx={8} fill="#56649A" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={110 + i * 230} y={640} width={170} height={150} rx={10} fill="#BFD0F2" opacity={0.85} />
        ))}
        <rect x={420} y={820} width={240} height={160} rx={8} fill="#2E3760" />
        <rect x={50} y={240} width={980} height={22} fill="#3F4B7C" />
        {/* calle */}
        <rect x={0} y={980} width={1080} height={130} fill="#3A3F52" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={40 + i * 230} y={1038} width={130} height={14} rx={7} fill="#E9E3C8" />
        ))}
        {/* fachada de Laura */}
        <rect x={0} y={1110} width={1080} height={810} fill="#EFE3CF" />
        <rect x={0} y={1110} width={1080} height={26} fill="#D8C7AA" />
        <rect x={640} y={1290} width={270} height={480} rx={10} fill="#CFE8F5" stroke="#3E9AAE" strokeWidth={12} />
        <path d="M748 1470 Q748 1452 764 1452 Q776 1452 776 1464 Q776 1452 788 1452 Q804 1452 804 1470 Q804 1500 796 1520 L788 1500 L776 1520 L764 1500 L756 1520 Q748 1500 748 1470 Z" fill="#fff" stroke="#3E9AAE" strokeWidth={5} strokeLinejoin="round" />
        <rect x={0} y={1770} width={1080} height={150} fill="#C9B79A" />
      </SVG>
      {/* cartel luminoso de enfrente */}
      <div style={{position: 'absolute', left: 100, top: 300, width: 760, height: 280, borderRadius: 34, background: '#0B1638', border: `8px solid ${K.oro}`, boxShadow: `0 0 ${60 * brilloEnf}px ${18 * brilloEnf}px rgba(242,185,50,${0.55 * brilloEnf})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FUENTE, fontWeight: 900, opacity: 0.55 + 0.45 * brilloEnf}}>
        <div style={{fontSize: 120, color: K.oro, lineHeight: 1}}>⭐ 4,9</div>
        <div style={{fontSize: 62, color: '#fff', marginTop: 8}}>300 reseñas</div>
      </div>
      <div style={{position: 'absolute', left: 100, top: 590, width: 760, textAlign: 'center', fontFamily: FUENTE, fontWeight: 800, fontSize: 34, color: '#E3E9FA', opacity: 0.8}}>CLÍNICA DENTAL</div>
      <Persona quien="laura" frame={frame} vol={0} habla={false} x={laura.x} y={laura.y} ancho={laura.ancho} pose={laura.pose} />
      {/* cartel de Laura: pequeño y medio caído → encendido y gigante */}
      <div
        style={{
          position: 'absolute',
          left: lerp(650, 335, c),
          top: lerp(1360, 1060, c),
          width: 260,
          height: 92,
          borderRadius: 14,
          transform: `scale(${lerp(1, 3.2, c)}) rotate(${lerp(11, 0, c) + bam}deg)`,
          transformOrigin: lerp(0, 1, c) > 0.5 ? 'center' : '10% 0%',
          background: c > 0.05 ? '#0B1638' : '#6B6F80',
          border: `${c > 0.05 ? 3 : 4}px solid ${c > 0.05 ? K.oro : '#4A4E5E'}`,
          boxShadow: c > 0.05 ? `0 0 ${24 * c}px ${6 * c}px rgba(242,185,50,.55)` : '0 6px 0 rgba(0,0,0,.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FUENTE,
          fontWeight: 900,
          fontSize: 34,
          color: c > 0.05 ? '#fff' : '#C9CCD6',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{color: c > 0.05 ? K.oro : '#C9CCD6'}}>⭐</span>&nbsp;{resenas} reseñas
      </div>
      {/* cuerda del cartel caído */}
      {c < 0.05 && (
        <SVG>
          <path d="M662 1300 L656 1362 M890 1300 L884 1408" stroke="#4A4E5E" strokeWidth={4} />
        </SVG>
      )}
    </AbsoluteFill>
  );
};

// 1 · Los carteles
const Carteles: React.FC<Ctx> = ({l, frame, e}) => (
  <AbsoluteFill>
    <Calle frame={frame} golpe={l - e.at('cuatro')} laura={{x: 300, y: 1190, ancho: 420, pose: {cabeza: l >= e.at('cuatro') ? 8 : 0}}} />
    <GanchoTxt />
  </AbsoluteFill>
);

// 2 · El paciente con la boca dormida
const Bocadillo: React.FC<{k: number; left: number; top: number; width: number; cola: 'izq' | 'der'; children: React.ReactNode; rot?: number}> = ({k, left, top, width, cola, children, rot = 0}) => (
  <div style={{position: 'absolute', left, top, width, transform: `scale(${Math.max(0, k)}) rotate(${rot}deg)`, transformOrigin: cola === 'izq' ? '20% 100%' : '80% 100%', opacity: k > 0 ? 1 : 0}}>
    <div style={{background: '#fff', border: `6px solid ${K.navy}`, borderRadius: 34, padding: '20px 26px', fontFamily: FUENTE, fontWeight: 900, fontSize: 52, color: K.navy, textAlign: 'center', lineHeight: 1.1}}>{children}</div>
    <svg width={80} height={60} style={{position: 'absolute', bottom: -52, [cola === 'izq' ? 'left' : 'right']: 70}}>
      <path d={cola === 'izq' ? 'M8,0 L60,0 L10,56 Z' : 'M20,0 L72,0 L70,56 Z'} fill="#fff" stroke={K.navy} strokeWidth={6} strokeLinejoin="round" />
      <rect x={4} y={-8} width={72} height={12} fill="#fff" />
    </svg>
  </div>
);

const Recepcion: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill>
    <SVG>
      <rect width={1080} height={1920} fill="#DCEEF7" />
      <rect x={0} y={1500} width={1080} height={420} fill="#B9D3E1" />
      <rect x={0} y={1490} width={1080} height={16} fill="#9FBFD1" />
      {/* puerta de la consulta */}
      <rect x={420} y={560} width={300} height={940} rx={10} fill="#5D7FA0" />
      <rect x={440} y={580} width={260} height={900} rx={6} fill="#2E4460" />
      <rect x={470} y={600} width={200} height={70} rx={10} fill="#fff" />
      <text x={570} y={648} textAnchor="middle" fontFamily={FUENTE} fontWeight={900} fontSize={34} fill="#3E9AAE">
        CONSULTA
      </text>
      {/* cuadro con un diente */}
      <rect x={80} y={420} width={180} height={150} rx={12} fill="#fff" stroke="#3E9AAE" strokeWidth={8} />
      <path d="M140 470 Q140 452 156 452 Q168 452 168 464 Q168 452 180 452 Q196 452 196 470 Q196 500 188 520 L180 500 L168 520 L156 500 L148 520 Q140 500 140 470 Z" fill="#E9F4FA" stroke="#3E9AAE" strokeWidth={5} strokeLinejoin="round" transform="translate(2 0)" />
    </SVG>
    {children}
  </AbsoluteFill>
);

const Pide: React.FC<Ctx> = ({l, frame, vol}) => {
  const entra = easeOut(l / 12);
  return (
    <Recepcion>
      <Persona quien="paciente" frame={frame} vol={0} habla={false} x={lerp(570, 790, entra)} y={790} ancho={480} pose={{cabeza: Math.sin(frame / 6) * 4}} extra={PAC_DORMIDO} />
      <Persona quien="laura" frame={frame} vol={vol('laura')} habla={vol('laura') > 0} x={290} y={790} ancho={480} pose={{brazoD: -30, cabeza: 6}} />
      <Bocadillo k={pop(l, 3, 0.2)} left={60} top={330} width={520} cola="izq">
        ¿Nos dejas una reseña? ⭐
      </Bocadillo>
      <GanchoTxt />
    </Recepcion>
  );
};

const Zinco: React.FC<Ctx> = ({l, frame, e, vol}) => {
  const fin = e.finVoz - e.desde;
  const sale = clamp01((l - fin - 2) / 18);
  const palmada = l >= fin + 8;
  const temblor = (i: number) => Math.sin(frame * 0.9 + i) * 6;
  return (
    <Recepcion>
      <Persona quien="paciente" frame={frame} vol={vol('paciente')} habla={vol('paciente') > 0} x={lerp(790, 1500, easeInOut(sale))} y={790 + (sale > 0 ? Math.abs(Math.sin(frame / 2.5)) * -14 : 0)} ancho={480} pose={{cabeza: Math.sin(frame / 5) * 7, brazoD: sale > 0 ? -25 : -60}} extra={PAC_DORMIDO} />
      <Persona quien="laura" frame={frame} vol={0} habla={false} x={290} y={790} ancho={480} pose={{cabeza: palmada ? -10 : 6, y: palmada ? 6 : 0}} extra={palmada ? LAURA_PALMADA : ''} />
      {l < fin + 4 && (
        <Bocadillo k={pop(l, 2, 0.3)} left={420} top={290} width={500} cola="der" rot={3}>
          <span style={{color: K.rojo}}>
            {['¡ZIINCO', 'EZZTRELLUAZ!'].map((pal, j) => (
              <div key={pal} style={{whiteSpace: 'nowrap'}}>
                {pal.split('').map((ch, n) => (
                  <span key={n} style={{display: 'inline-block', transform: `translateY(${temblor(n + j * 9)}px) rotate(${temblor(n + j * 9 + 3)}deg)`}}>
                    {ch}
                  </span>
                ))}
              </div>
            ))}
          </span>
        </Bocadillo>
      )}
      {palmada && (
        <Txt top={560} size={90} k={pop(l, fin + 8, 0.3)} left={40} right={560} rot={-8}>
          🤦‍♀️
        </Txt>
      )}
      <GanchoTxt />
    </Recepcion>
  );
};

// 3 · Montaje: Laura persigue reseñas
const CartelResena: React.FC<{x: number; y: number; rot?: number}> = ({x, y, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-6} y={0} width={12} height={170} rx={6} fill="#8A5A33" />
    <rect x={-150} y={-110} width={300} height={120} rx={18} fill="#fff" stroke={K.navy} strokeWidth={6} />
    <text x={0} y={-36} textAnchor="middle" fontFamily={FUENTE} fontWeight={900} fontSize={46} fill={K.navy}>
      ¿Reseña? 🙏
    </text>
  </g>
);

const LineasVelocidad: React.FC<{x: number; y: number; frame: number}> = ({x, y, frame}) => (
  <g stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.7}>
    {[0, 1, 2, 3].map((i) => {
      const d = ((frame * 9 + i * 37) % 120) - 60;
      return <path key={i} d={`M${x - 120 - d} ${y + i * 60} L${x - 40 - d} ${y + i * 60}`} />;
    })}
  </g>
);

const Acera: React.FC = () => (
  <SVG>
    <rect width={1080} height={1920} fill="#EFE3CF" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={60 + i * 340} y={420} width={260} height={360} rx={14} fill="#CFE8F5" stroke="#B8A486" strokeWidth={10} />
    ))}
    <rect x={0} y={1600} width={1080} height={320} fill="#C9B79A" />
    <rect x={0} y={1600} width={1080} height={14} fill="#B3A083" />
  </SVG>
);

const Persigue: React.FC<Ctx> = ({l, frame, e}) => {
  const plano = Math.min(2, Math.floor((l / e.dur) * 3));
  const lp = l - (plano * e.dur) / 3;
  const dp = e.dur / 3;
  const t = lp / dp;
  const A = 360; // ancho de los personajes de cuerpo entero
  const ty = 1600 - 880 * (A / 600) - 260 * (A / 600) + 10;
  const bob = (f: number) => -Math.abs(Math.sin(f / 2.2)) * 18;
  const ManoLaura = (x: number, y: number) => <CartelResena x={x + 112} y={y - 40} rot={Math.sin(frame / 3) * 8} />;
  if (plano === 0) {
    // Laura corre detrás de un paciente
    const xp = lerp(520, 1250, t);
    const xl = lerp(-40, 640, t);
    return (
      <AbsoluteFill>
        <Acera />
        <SVG>
          <LineasVelocidad x={xp - 120} y={ty + 260} frame={frame} />
          <Piernas x={xp} y={ty + bob(frame)} ancho={A} pantalon="#2E3A55" zapato="#5A3A22" paso={frame * 0.9} />
          <Piernas x={xl} y={ty + bob(frame + 3)} ancho={A} pantalon="#8FC3DD" zapato="#FFFFFF" paso={frame * 0.9 + 1.5} />
        </SVG>
        <Persona quien="paciente" uid="a" frame={frame} vol={0} habla={false} x={xp} y={ty + bob(frame)} ancho={A} pose={{brazoD: -45, brazoI: 45, cabeza: -10}} extra={PAC_AZUL} />
        <Persona quien="laura" frame={frame} vol={0} habla={false} x={xl} y={ty + bob(frame + 3)} ancho={A} pose={{brazoD: -150, brazoI: 30, cabeza: 6}} />
        <SVG>{ManoLaura(xl, ty + bob(frame + 3))}</SVG>
      </AbsoluteFill>
    );
  }
  if (plano === 1) {
    // otro se escapa en patinete
    const xp = lerp(420, 1400, easeInOut(t));
    const xl = lerp(140, 300, t);
    const k = A / 600;
    const base = ty + 1150 * k; // los pies, sobre la tabla
    const manos = -(1150 - 820) * k;
    return (
      <AbsoluteFill>
        <Acera />
        <SVG>
          <LineasVelocidad x={xp - 160} y={ty + 200} frame={frame} />
          {/* patinete genérico */}
          <g transform={`translate(${xp} ${base})`}>
            <rect x={-150} y={0} width={300} height={22} rx={11} fill="#1D3E9E" />
            <circle cx={-120} cy={34} r={30} fill="#222" />
            <circle cx={130} cy={34} r={30} fill="#222" />
            <path d={`M130 0 L${80 * k + 60} ${manos}`} stroke="#9AA3B5" strokeWidth={14} strokeLinecap="round" />
            <path d={`M${40 * k} ${manos} L${160 * k + 60} ${manos}`} stroke="#333" strokeWidth={16} strokeLinecap="round" />
          </g>
          <Piernas x={xp} y={ty} ancho={A} pantalon="#5B4636" zapato="#222" />
          <Piernas x={xl} y={ty + bob(frame)} ancho={A} pantalon="#8FC3DD" zapato="#FFFFFF" paso={frame * 0.9} />
        </SVG>
        <Persona quien="paciente" uid="b" frame={frame} vol={0} habla={false} x={xp} y={ty} ancho={A} pose={{brazoD: -28, brazoI: 10, cabeza: 8}} extra={PAC_VERDE} />
        <Persona quien="laura" frame={frame} vol={0} habla={false} x={xl} y={ty + bob(frame)} ancho={A} pose={{brazoD: -150, brazoI: 120, cabeza: -4}} />
        <SVG>{ManoLaura(xl, ty + bob(frame))}</SVG>
        <Txt top={960} size={70} k={pop(lp, 4, 0.25)} left={500} right={150} rot={-6}>
          💨
        </Txt>
      </AbsoluteFill>
    );
  }
  // otro se esconde detrás de una planta
  const asoma = Math.sin(clamp01(t * 1.6) * Math.PI);
  const xl = lerp(120, 260, t);
  return (
    <AbsoluteFill>
      <Acera />
      <Persona quien="paciente" uid="c" frame={frame} vol={0} habla={false} x={lerp(660, 770, asoma)} y={ty + 40} ancho={A} pose={{cabeza: 10 * asoma}} extra={PAC_MORADO} />
      <SVG>
        {/* planta */}
        <g transform="translate(660 1600)">
          {[-60, -35, -12, 12, 35, 60].map((a, i) => (
            <ellipse key={i} cx={0} cy={-300} rx={70} ry={300} fill={i % 2 ? '#3E8E55' : '#4FA866'} transform={`rotate(${a + Math.sin(frame / 8 + i) * 2} 0 -40)`} />
          ))}
          <path d="M-120 -60 L120 -60 L95 0 L-95 0 Z" fill="#C8743C" />
          <rect x={-130} y={-80} width={260} height={30} rx={10} fill="#B0602E" />
        </g>
        <Piernas x={xl} y={ty} ancho={A} pantalon="#8FC3DD" zapato="#FFFFFF" paso={Math.sin(frame / 4) * 0.4} />
      </SVG>
      <Persona quien="laura" frame={frame} vol={0} habla={false} x={xl} y={ty} ancho={A} pose={{brazoD: -150, cabeza: Math.sin(frame / 7) * 12}} />
      <SVG>{ManoLaura(xl, ty)}</SVG>
      <Txt top={1000} size={64} k={pop(lp, 10, 0.25)} left={620} right={150}>
        👀
      </Txt>
    </AbsoluteFill>
  );
};

// 4 · Lolo y la automatización
const Lolo: React.FC<Ctx> = ({l, frame, e, vol}) => {
  const kTel = pop(l, e.at('Horas') - 4, 0.12);
  const tMsg = e.at('WhatsApp');
  const tEnl = e.at('enlace');
  return (
    <AbsoluteFill>
      <Fondo frame={frame} />
      <Txt top={100} size={66} color={K.oro} k={pop(l, 2)}>
        Tranquila, Laura 😌
      </Txt>
      {/* móvil genérico con el mensaje */}
      <div style={{position: 'absolute', left: 300, top: 240, width: 500, height: 760, transform: `scale(${Math.max(0, kTel)})`, opacity: kTel > 0 ? 1 : 0, background: '#1E2230', borderRadius: 56, border: `8px solid ${K.navy}`, boxShadow: '0 20px 0 rgba(0,0,0,.3)'}}>
        <div style={{position: 'absolute', left: 18, right: 18, top: 18, bottom: 18, borderRadius: 40, background: '#ECE5DD', overflow: 'hidden', fontFamily: FUENTE}}>
          <div style={{background: '#1F6E5C', color: '#fff', fontWeight: 900, fontSize: 30, padding: '26px 24px 18px', display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{width: 52, height: 52, borderRadius: 26, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: '#3E9AAE', fontWeight: 900}}>✚</div>
            Clínica dental
          </div>
          <div style={{margin: '22px auto 0', width: 'fit-content', background: '#D7EEF7', borderRadius: 14, padding: '6px 16px', fontWeight: 800, fontSize: 28, color: '#2E4460', opacity: clamp01((l - e.at('después')) / 6)}}>⏰ 3 h después de la cita</div>
          <div style={{margin: '20px 20px 0', background: '#fff', borderRadius: 22, padding: '20px 22px', fontWeight: 700, fontSize: 34, lineHeight: 1.25, color: '#1B2440', transform: `scale(${Math.max(0, pop(l, tMsg, 0.15))})`, transformOrigin: '0 0'}}>
            ¡Hola! ¿Qué tal la visita? 😊 Si te ha gustado, déjanos tu reseña:
            <div style={{marginTop: 16, background: K.oro, borderRadius: 16, padding: '14px 10px', textAlign: 'center', fontWeight: 900, fontSize: 38, color: K.navy, transform: `scale(${Math.max(0, pop(l, tEnl, 0.25))})`}}>⭐ Dejar reseña</div>
          </div>
        </div>
      </div>
      <SVG>
        <LoloA pf={() => (l < e.at('Horas') ? POSE.senalarse : POSE.senalaAbajo)} ef={() => EXPR.feliz} frame={frame} x={230} y={1500} s={0.72} vol={vol('lolo')} habla={vol('lolo') > 0} uid="lolo-l" />
      </SVG>
      <Persona quien="laura" frame={frame} vol={0} habla={false} x={820} y={1330} ancho={300} pose={{cabeza: -6}} />
    </AbsoluteFill>
  );
};

// 5 · Sube el contador y el cartel de Laura se enciende
const PASOS = [4, 20, 60, 120];
const Cartel: React.FC<Ctx> = ({l, frame, e}) => {
  const paso = (i: number) => 3 + i * Math.max(6, Math.floor((e.dur - 14) / 4));
  const n = PASOS.reduce((acc, v, i) => (l >= paso(i) ? v : acc), 4);
  const crece = clamp01((l - paso(1)) / 22);
  return (
    <AbsoluteFill>
      <Calle frame={frame} crece={crece} resenas={n} falla={crece > 0.6} laura={{x: 230, y: 1300, ancho: 400, pose: {brazoD: -150 * easeOut(crece), brazoI: 150 * easeOut(crece), y: -Math.abs(Math.sin(frame / 3)) * 10 * crece}}} />
      <div style={{position: 'absolute', top: 44, left: 40, right: 150, display: 'flex', justifyContent: 'center'}}>
        <div style={{background: 'rgba(10,20,60,.9)', border: `5px solid ${K.oro}`, borderRadius: 30, padding: '12px 26px', fontFamily: FUENTE, fontWeight: 900, fontSize: 64, color: '#fff', display: 'flex', gap: 16, alignItems: 'center'}}>
          {PASOS.map((v, i) => (
            <React.Fragment key={v}>
              {i > 0 && <span style={{color: K.oro, opacity: l >= paso(i) ? 1 : 0.25}}>→</span>}
              <span style={{color: i === 3 ? K.oro : '#fff', opacity: l >= paso(i) ? 1 : 0.25, display: 'inline-block', transform: `scale(${l >= paso(i) ? pop(l, paso(i), 0.3) : 1})`}}>{v}</span>
            </React.Fragment>
          ))}
          <span>⭐</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 6 · Truco gratis
const Truco: React.FC<Ctx> = ({l, frame, e, vol}) => {
  const tarjeta = rebote(l - 2, 1.1);
  const tG = e.at('gracias');
  return (
    <AbsoluteFill>
      <Fondo frame={frame} de="#1D3E9E" />
      <div style={{position: 'absolute', left: 60, top: 110, width: 870, transform: `scale(${Math.max(0.01, tarjeta)})`, background: '#0B1638', border: `8px solid ${K.oro}`, borderRadius: 40, padding: '34px 40px 40px', fontFamily: FUENTE, color: '#fff', boxSizing: 'border-box'}}>
        <div style={{textAlign: 'center', fontWeight: 900, fontSize: 92, color: K.oro}}>TRUCO GRATIS</div>
        <div style={{marginTop: 18, fontWeight: 900, fontSize: 52, lineHeight: 1.15, textAlign: 'center', opacity: clamp01((l - e.at('responde') + 2) / 6)}}>
          Responde a <span style={{color: K.oro}}>todas</span> tus reseñas, aunque sea con un “gracias”.
        </div>
        {/* reseña de ejemplo (genérica) y respuesta */}
        <div style={{marginTop: 30, background: '#fff', borderRadius: 24, padding: '20px 24px', color: '#1B2440', opacity: clamp01((l - e.at('reseñas')) / 6)}}>
          <div style={{fontSize: 38}}>⭐⭐⭐⭐⭐</div>
          <div style={{fontWeight: 700, fontSize: 34, marginTop: 6}}>“Muy amables y sin esperas.”</div>
          <div style={{marginTop: 16, marginLeft: 60, background: '#E3F3E9', borderRadius: 18, padding: '12px 18px', fontWeight: 800, fontSize: 34, transform: `scale(${Math.max(0, pop(l, tG, 0.2))})`, transformOrigin: '0 0', opacity: l >= tG ? 1 : 0}}>↪ ¡Gracias! 💛</div>
        </div>
        <div style={{marginTop: 26, fontWeight: 800, fontSize: 40, textAlign: 'center', color: '#86D2D7', opacity: clamp01((l - tG - 10) / 8)}}>Google lo ve y los clientes también 👀</div>
      </div>
      <SVG>
        <LoloA pf={() => POSE.senalaCamara} ef={() => EXPR.feliz} frame={frame} x={465} y={1540} s={0.72} vol={vol('lolo')} habla={vol('lolo') > 0} uid="lolo-t" />
      </SVG>
    </AbsoluteFill>
  );
};

// 7 · Final: Laura guiña el ojo y pantalla "Comenta RESEÑAS + dauradalabs.com"
const Final: React.FC<Ctx> = ({l, frame, e, vol}) => {
  const tC = e.at('Comenta');
  if (l < tC - 2) {
    const guina = l >= 14 && l < 34;
    return (
      <AbsoluteFill>
        <Fondo frame={frame} />
        <Persona quien="laura" frame={frame} vol={0} habla={false} x={465} y={620} ancho={760} pose={{cabeza: guina ? -7 : 0, brazoD: guina ? -40 : 0}} extra={guina ? LAURA_GUINO : ''} />
        {guina && (
          <Txt top={560} size={90} k={pop(l, 14, 0.3)} left={560} right={150}>
            ✨
          </Txt>
        )}
      </AbsoluteFill>
    );
  }
  const lc = l - (tC - 2);
  return (
    <AbsoluteFill>
      <Fondo frame={frame} />
      <SVG>
        <g transform={`translate(465 230) scale(${Math.max(0.01, rebote(lc, 1.1))})`}>
          <DlMark ancho={190} uid="fin-dl" trazo={17} />
        </g>
      </SVG>
      <Txt top={380} size={96} k={pop(lc, 2)}>
        Comenta
      </Txt>
      <Txt top={490} size={150} color={K.oro} k={pop(l, e.at('RESEÑAS'), 0.25)} nowrap>
        RESEÑAS
      </Txt>
      <div style={{position: 'absolute', top: 700, left: 40, right: 150, display: 'flex', justifyContent: 'center', opacity: clamp01((lc - 10) / 8)}}>
        <div style={{background: K.oro, color: K.navy, fontFamily: FUENTE, fontWeight: 900, fontSize: 58, padding: '12px 40px', borderRadius: 50, boxShadow: '0 10px 0 rgba(6,12,40,.45)'}}>dauradalabs.com</div>
      </div>
      <SVG>
        <LoloA pf={() => POSE.senalaCamara} ef={() => EXPR.feliz} frame={frame} x={465} y={1530} s={0.78} vol={vol('lolo')} habla={vol('lolo') > 0} uid="lolo-f" />
      </SVG>
    </AbsoluteFill>
  );
};

export const VideoLaura: React.FC<PropsReel> = (props) => (
  <Reel
    props={props}
    minimos={MIN_L}
    sinEntrada={['carteles', 'zinco']}
    escena={(c) => {
      switch (c.e.id) {
        case 'carteles':
          return <Carteles {...c} />;
        case 'pide':
          return <Pide {...c} />;
        case 'zinco':
          return <Zinco {...c} />;
        case 'persigue':
          return <Persigue {...c} />;
        case 'lolo':
          return <Lolo {...c} />;
        case 'cartel':
          return <Cartel {...c} />;
        case 'truco':
          return <Truco {...c} />;
        default:
          return <Final {...c} />;
      }
    }}
    sfx={(L: Linea): Sfx[] => {
      const ca = L.esc('carteles')!;
      const z = L.esc('zinco')!;
      const p = L.esc('persigue')!;
      const lo = L.esc('lolo')!;
      const ct = L.esc('cartel')!;
      const t = L.esc('truco')!;
      const f = L.esc('final')!;
      const fin = z.finVoz - z.desde;
      const tercio = p.dur / 3;
      const paso = (i: number) => 3 + i * Math.max(6, Math.floor((ct.dur - 14) / 4));
      return [
        [ca.desde + ca.at('cuatro'), 'boing', 0.25],
        [z.desde + fin + 2, 'whoosh', 0.25],
        [z.desde + fin + 8, 'uff', 0.3],
        [p.desde + Math.round(tercio), 'whoosh', 0.25],
        [p.desde + Math.round(2 * tercio), 'whoosh', 0.25],
        [p.desde + Math.round(tercio) + 4, 'risa', 0.15],
        [lo.desde + lo.at('WhatsApp'), 'vibra', 0.25],
        [lo.desde + lo.at('enlace'), 'pop', 0.22],
        ...PASOS.map((_, i) => [ct.desde + paso(i), 'tick', 0.3] as Sfx),
        [ct.desde + paso(3) + 4, 'ding', 0.3],
        [ct.desde + paso(2), 'zzzt', 0.15],
        [t.desde + t.at('gracias'), 'pop', 0.22],
        [f.desde + 14, 'ding', 0.2],
        [f.desde + f.at('Comenta') - 2, 'whoosh', 0.25],
      ];
    }}
  />
);

/** Ficha de personajes nuevos (para enseñarlos antes de renderizar). */
export const FichaLaura: React.FC = () => (
  <AbsoluteFill>
    <Fondo frame={0} />
    <Txt top={60} size={70} color={K.oro}>
      Laura y el paciente
    </Txt>
    <Persona quien="laura" frame={0} vol={0} habla={false} x={270} y={220} ancho={440} />
    <Persona quien="paciente" uid="f" frame={0} vol={0} habla={false} x={760} y={220} ancho={440} extra={PAC_DORMIDO} />
    <Persona quien="laura" uid="p" frame={0} vol={0} habla={false} x={200} y={1000} ancho={300} extra={LAURA_PALMADA} />
    <Persona quien="laura" uid="g" frame={0} vol={0} habla={false} x={450} y={1000} ancho={300} extra={LAURA_GUINO} />
    <Persona quien="paciente" uid="v1" frame={0} vol={0} habla={false} x={680} y={1000} ancho={260} extra={PAC_AZUL} />
    <Persona quien="paciente" uid="v2" frame={0} vol={0} habla={false} x={900} y={1000} ancho={260} extra={PAC_VERDE} />
    <Txt top={1500} size={36} peso={700}>
      Normal · palmada · guiño · pacientes de la persecución
    </Txt>
  </AbsoluteFill>
);
