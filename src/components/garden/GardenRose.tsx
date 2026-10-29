import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import type { GardenRoseData } from '../../types/garden';

interface GardenRoseProps {
  rose: GardenRoseData;
  isOpened: boolean;
  onClick: () => void;
  index: number;
  reducedMotion?: boolean;
}

export const GardenRose: React.FC<GardenRoseProps> = ({
  rose,
  isOpened,
  onClick,
  index,
  reducedMotion = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const cinematicEase = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.button
      type="button"
      className={`garden-rose-item ${isOpened ? 'is-bloomed' : 'is-bud'}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 25, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: reducedMotion ? 0.05 : index * 0.07,
        duration: reducedMotion ? 0.3 : 0.7,
        ease: cinematicEase,
      }}
      whileHover={reducedMotion ? {} : { scale: 1.06, y: -4 }}
      whileTap={reducedMotion ? {} : { scale: 0.96 }}
      aria-label={`Rose ${rose.id}: ${rose.title}. ${isOpened ? 'Discovered.' : 'Click to discover whisper.'}`}
      aria-haspopup="dialog"
    >
      {/* Background radial glow */}
      <div className={`rose-glow-aura ${isOpened ? 'glow-opened' : 'glow-unopened'}`} />

      {/* Rose SVG illustration */}
      <div className="rose-graphic-wrapper">
        <svg
          viewBox="0 0 160 160"
          className="garden-rose-svg"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={`budGrad-${rose.id}`} cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor={isOpened ? '#f4728f' : '#d92550'} />
              <stop offset="45%" stopColor={isOpened ? '#c21945' : '#a61238'} />
              <stop offset="85%" stopColor={isOpened ? '#7a0a26' : '#59081c'} />
              <stop offset="100%" stopColor="#24020a" />
            </radialGradient>

            <radialGradient id={`outerPetals-${rose.id}`} cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor={isOpened ? '#e6395e' : '#ba143d'} />
              <stop offset="65%" stopColor={isOpened ? '#800e2b' : '#6b0a22'} />
              <stop offset="100%" stopColor="#2b030d" />
            </radialGradient>

            <radialGradient id={`goldCore-${rose.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff3b0" />
              <stop offset="35%" stopColor="#f3cf7a" />
              <stop offset="70%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#7a0a26" />
            </radialGradient>
          </defs>

          {/* Stem & Leaves */}
          <path
            d="M 80 120 Q 78 140 82 155"
            stroke="#1c3817"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 80 132 C 60 128 48 138 40 150 C 56 150 72 142 80 137 Z"
            fill="#274d20"
            opacity="0.85"
          />
          <path
            d="M 80 138 C 100 134 112 144 120 156 C 104 156 88 148 80 143 Z"
            fill="#274d20"
            opacity="0.85"
          />

          {/* Outer Layer Petals (Expands if opened) */}
          <g className={`rose-petals-outer ${isOpened ? 'bloomed-layer' : ''}`}>
            <path
              d={
                isOpened
                  ? 'M 48 85 C 25 105 45 130 80 130 C 115 130 135 105 112 85 C 130 115 105 136 80 136 C 55 136 30 115 48 85 Z'
                  : 'M 55 90 C 40 105 55 125 80 125 C 105 125 120 105 105 90 C 118 110 100 128 80 128 C 60 128 42 110 55 90 Z'
              }
              fill={`url(#outerPetals-${rose.id})`}
              stroke="rgba(255, 200, 215, 0.2)"
              strokeWidth="0.6"
            />
            <path
              d={
                isOpened
                  ? 'M 35 65 C 15 85 25 115 65 120 C 35 108 30 85 35 65 Z'
                  : 'M 45 70 C 30 85 38 108 65 114 C 42 104 38 85 45 70 Z'
              }
              fill={`url(#outerPetals-${rose.id})`}
            />
            <path
              d={
                isOpened
                  ? 'M 125 65 C 145 85 135 115 95 120 C 125 108 130 85 125 65 Z'
                  : 'M 115 70 C 130 85 122 108 95 114 C 118 104 122 85 115 70 Z'
              }
              fill={`url(#outerPetals-${rose.id})`}
            />
          </g>

          {/* Middle Petals Cup */}
          <g className="rose-petals-mid">
            <path
              d="M 52 55 C 38 75 52 108 80 112 C 108 108 122 75 108 55 C 118 85 98 108 80 108 C 62 108 42 85 52 55 Z"
              fill={`url(#budGrad-${rose.id})`}
              stroke="rgba(255, 220, 230, 0.25)"
              strokeWidth="0.75"
            />
            <path
              d="M 58 72 C 55 96 105 96 102 72 C 108 90 52 90 58 72 Z"
              fill={`url(#budGrad-${rose.id})`}
            />
          </g>

          {/* Inner Heart / Golden Core */}
          <g className="rose-petals-heart">
            <ellipse
              cx="80"
              cy="65"
              rx={isOpened ? 18 : 14}
              ry={isOpened ? 15 : 12}
              fill={`url(#budGrad-${rose.id})`}
            />
            <path
              d="M 72 62 Q 80 54 88 62 Q 80 72 72 62"
              fill={`url(#goldCore-${rose.id})`}
              opacity={isOpened ? 0.95 : 0.75}
            />
            <circle
              cx="80"
              cy="63"
              r={isOpened ? 2.5 : 1.8}
              fill="#fff7d1"
              opacity={isOpened ? 1 : 0.8}
            />
          </g>

          {/* Golden Morning Dew Droplet on opened roses */}
          {isOpened && (
            <g className="rose-dewdrop">
              <ellipse cx="62" cy="94" rx="2.5" ry="3.2" fill="rgba(255, 255, 255, 0.9)" />
              <circle cx="61.5" cy="93" r="0.8" fill="#ffffff" />
            </g>
          )}
        </svg>
      </div>

      {/* Badge & Numeral Label */}
      <div className="rose-info-badge">
        <div className="rose-numeral-pill">
          {isOpened ? (
            <span className="rose-check-icon" aria-hidden="true">
              <Check size={11} strokeWidth={3} />
            </span>
          ) : (
            <span className="rose-sparkle-icon" aria-hidden="true">
              <Sparkles size={10} />
            </span>
          )}
          <span className="rose-number-text">{rose.numeral}</span>
        </div>
        <span className="rose-card-title">{rose.title}</span>
      </div>
    </motion.button>
  );
};
