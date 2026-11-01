import React from 'react';

interface NutriSwasthLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  layout?: 'horizontal' | 'vertical' | 'icon-only';
  textColor?: string;
  subtitle?: string;
}

export const NutriSwasthLogo: React.FC<NutriSwasthLogoProps> = ({
  className = '',
  size = 40,
  showText = false,
  layout = 'horizontal',
  textColor = '#1c221a',
  subtitle,
}) => {
  const iconElement = (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
      className={`shrink-0 ${className}`}
    >
      {/* Outer Circle Ring */}
      <circle
        cx="100"
        cy="100"
        r="90"
        stroke="#527b32"
        strokeWidth="15"
        fill="none"
      />

      {/* Citrus Wedge Segments (Golden Yellow Outlines) */}
      <g stroke="#ea9f1d" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Arc Baseline for citrus */}
        <path d="M 45 92 C 60 76, 140 76, 155 92" />

        {/* Left Segment Wedge */}
        <path d="M 44 80 C 46 62, 60 46, 76 38 C 76 56, 68 70, 52 78 Z" />

        {/* Middle Segment Wedge */}
        <path d="M 86 33 C 95 31, 105 31, 114 33 C 112 52, 110 66, 100 71 C 90 66, 88 52, 86 33 Z" />

        {/* Right Segment Wedge */}
        <path d="M 124 38 C 140 46, 154 62, 156 80 C 140 78, 132 56, 124 38 Z" />
      </g>

      {/* Bottom Leaf Shape (Solid Green) */}
      <path
        d="M 40 106 C 58 84, 118 72, 162 108 C 148 152, 108 178, 54 164 C 40 144, 36 126, 40 106 Z"
        fill="#527b32"
      />

      {/* Organic Curved White Vein / Leaf Cutout */}
      <path
        d="M 42 152 C 72 144, 120 126, 158 108 C 114 134, 76 150, 42 152 Z"
        fill="#ffffff"
      />
    </svg>
  );

  if (!showText && layout === 'icon-only') {
    return iconElement;
  }

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {iconElement}
        <div className="mt-2">
          <span
            className="text-lg font-bold font-serif-heading tracking-tight block"
            style={{ color: textColor }}
          >
            NutriSwasth
          </span>
          {subtitle && (
            <span className="text-[10px] uppercase font-bold text-[#527b32] tracking-wider block">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {iconElement}
      <div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-xl font-bold font-serif-heading tracking-tight leading-tight"
            style={{ color: textColor }}
          >
            NutriSwasth
          </span>
        </div>
        {subtitle && (
          <p className="text-[10px] uppercase font-bold text-[#527b32] tracking-wider leading-none mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
