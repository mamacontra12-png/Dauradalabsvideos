import React from 'react';

/**
 * Símbolo oficial DL (copiado de dl_mark.svg, viewBox 0 0 340 300). No se redibuja: mismos trazados y colores.
 * Se dibuja centrado en (0,0) con el ancho indicado. `trazo` permite engordar las líneas para que se lea en móvil (13 → 17).
 */
export const DlMark: React.FC<{ancho: number; uid: string; trazo?: number}> = ({ancho, uid, trazo = 17}) => {
  const s = ancho / 340;
  return (
    <g transform={`scale(${s}) translate(-174 -158)`}>
      <defs>
        <linearGradient id={`${uid}Gold`} gradientUnits="userSpaceOnUse" x1="30" y1="280" x2="260" y2="30">
          <stop offset="0" stopColor="#BF8B4B" />
          <stop offset="0.55" stopColor="#E2BC74" />
          <stop offset="1" stopColor="#F0D597" />
        </linearGradient>
        <linearGradient id={`${uid}Teal`} gradientUnits="userSpaceOnUse" x1="60" y1="270" x2="300" y2="40">
          <stop offset="0" stopColor="#3E9AAE" />
          <stop offset="1" stopColor="#86D2D7" />
        </linearGradient>
        <linearGradient id={`${uid}Hair`} gradientUnits="userSpaceOnUse" x1="0" y1="27" x2="0" y2="60">
          <stop offset="0" stopColor="#E9E3C4" />
          <stop offset="1" stopColor="#7FCFD5" />
        </linearGradient>
        <radialGradient id={`${uid}Glow`}>
          <stop offset="0" stopColor="#DFFBFF" stopOpacity="1" />
          <stop offset="0.35" stopColor="#9BEAF2" stopOpacity="0.7" />
          <stop offset="1" stopColor="#5FD0DE" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={trazo}>
        <path d="M181 26 L181 126 A88 88 0 1 0 179 250 L256 140 L256 46" stroke={`url(#${uid}Gold)`} />
        <path d="M256 46 A18 18 0 0 0 220 46" stroke={`url(#${uid}Hair)`} />
        <path d="M220 46 L220 146" stroke={`url(#${uid}Teal)`} />
        <path d="M158 158 A50 50 0 1 0 112 238 L200 166" stroke={`url(#${uid}Teal)`} />
        <path d="M250 180 L250 214 Q250 229 265 229 L300 229" stroke={`url(#${uid}Teal)`} />
        <path d="M222 206 L222 240 Q222 265 247 265 L300 265" stroke={`url(#${uid}Teal)`} />
      </g>
      <circle cx="306" cy="230" r="30" fill={`url(#${uid}Glow)`} />
      <circle cx="306" cy="230" r="10" fill="#E8FDFF" />
    </g>
  );
};
