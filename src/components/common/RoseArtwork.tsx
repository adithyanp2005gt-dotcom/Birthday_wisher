import React from 'react';
import { motion } from 'framer-motion';

interface RoseArtworkProps {
  reducedMotion?: boolean;
}

export const RoseArtwork: React.FC<RoseArtworkProps> = ({ reducedMotion = false }) => {
  return (
    <div className="rose-artwork-wrapper">
      {/* Cinematic ambient backlit glow aura */}
      <div className="rose-backlight" />
      <div className="rose-gold-corona" />

      {/* Layered Botanical Rose Illustration */}
      <motion.div
        className="rose-svg-container"
        initial={{ scale: 0.88, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{
          duration: reducedMotion ? 0.6 : 1.8,
          ease: [0.16, 1, 0.3, 1] as const,
        }}
      >
        <svg
          viewBox="0 0 400 400"
          className="rose-svg"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="A beautifully blooming crimson royal rose with delicate golden light"
        >
          <defs>
            {/* Gradients for rich velvet petals */}
            <radialGradient id="deepPetalGrad1" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#d92550" />
              <stop offset="40%" stopColor="#a61238" />
              <stop offset="85%" stopColor="#54081c" />
              <stop offset="100%" stopColor="#29020b" />
            </radialGradient>

            <radialGradient id="outerPetalGrad" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#bf153e" />
              <stop offset="55%" stopColor="#800e2b" />
              <stop offset="95%" stopColor="#3d0312" />
            </radialGradient>

            <radialGradient id="highlightPetalGrad" cx="35%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#f4728f" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#c21945" />
              <stop offset="100%" stopColor="#6e0b24" />
            </radialGradient>

            <radialGradient id="innerCoreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd280" />
              <stop offset="25%" stopColor="#e6395e" />
              <stop offset="70%" stopColor="#7a0a26" />
              <stop offset="100%" stopColor="#2b020c" />
            </radialGradient>

            <linearGradient id="goldStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#233d1c" />
              <stop offset="60%" stopColor="#142610" />
              <stop offset="100%" stopColor="#0a1408" />
            </linearGradient>

            <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3d6b30" />
              <stop offset="50%" stopColor="#1e3817" />
              <stop offset="100%" stopColor="#0e1d0b" />
            </linearGradient>

            <radialGradient id="dewGlow" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#ffd9e2" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ff708f" stopOpacity="0" />
            </radialGradient>

            {/* Velvet texture subtle filter */}
            <filter id="softGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Stem & Sepals */}
          <g className="rose-stem-group">
            <path
              d="M 200 290 Q 196 345 204 380 Q 206 390 203 400"
              stroke="url(#goldStemGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Leaf */}
            <path
              d="M 197 325 C 160 320 135 340 120 370 C 145 372 175 355 198 338 Z"
              fill="url(#leafGrad1)"
              opacity="0.9"
            />
            <path
              d="M 197 325 Q 160 345 125 368"
              stroke="rgba(212, 175, 55, 0.35)"
              strokeWidth="1"
              fill="none"
            />
            {/* Right Leaf */}
            <path
              d="M 202 340 C 240 332 268 350 282 380 C 255 384 225 365 200 350 Z"
              fill="url(#leafGrad1)"
              opacity="0.85"
            />
            <path
              d="M 202 340 Q 242 356 278 378"
              stroke="rgba(212, 175, 55, 0.35)"
              strokeWidth="1"
              fill="none"
            />
          </g>

          {/* Tier 1: Outer Wide Guard Petals */}
          <g className="rose-outer-petals">
            {/* Bottom Guard Petal */}
            <path
              d="M 130 220 C 130 285 170 310 200 310 C 230 310 270 285 270 220 C 285 260 250 315 200 318 C 150 315 115 260 130 220 Z"
              fill="url(#outerPetalGrad)"
              stroke="rgba(255, 180, 200, 0.15)"
              strokeWidth="0.75"
            />
            {/* Left Outer Petal */}
            <path
              d="M 125 180 C 80 205 85 265 140 280 C 110 260 100 215 125 180 Z"
              fill="url(#outerPetalGrad)"
              stroke="rgba(255, 180, 200, 0.2)"
              strokeWidth="0.75"
            />
            {/* Right Outer Petal */}
            <path
              d="M 275 180 C 320 205 315 265 260 280 C 290 260 300 215 275 180 Z"
              fill="url(#outerPetalGrad)"
              stroke="rgba(255, 180, 200, 0.2)"
              strokeWidth="0.75"
            />
            {/* Bottom-left flaring petal */}
            <path
              d="M 140 240 C 145 285 185 305 205 300 C 175 295 150 275 140 240 Z"
              fill="url(#deepPetalGrad1)"
            />
            {/* Bottom-right flaring petal */}
            <path
              d="M 260 240 C 255 285 215 305 195 300 C 225 295 250 275 260 240 Z"
              fill="url(#deepPetalGrad1)"
            />
          </g>

          {/* Tier 2: Mid Bloom Petals */}
          <g className="rose-mid-petals">
            {/* Upper left sweeping petal */}
            <path
              d="M 140 145 C 105 160 115 225 180 250 C 135 230 120 180 140 145 Z"
              fill="url(#highlightPetalGrad)"
              stroke="rgba(255, 200, 220, 0.25)"
              strokeWidth="0.75"
            />
            {/* Upper right sweeping petal */}
            <path
              d="M 260 145 C 295 160 285 225 220 250 C 265 230 280 180 260 145 Z"
              fill="url(#highlightPetalGrad)"
              stroke="rgba(255, 200, 220, 0.25)"
              strokeWidth="0.75"
            />
            {/* Center Front Cup Petal */}
            <path
              d="M 155 210 C 150 265 250 265 245 210 C 255 248 145 248 155 210 Z"
              fill="url(#deepPetalGrad1)"
              stroke="rgba(255, 220, 230, 0.3)"
              strokeWidth="1"
            />
            {/* Left cradle petal */}
            <path
              d="M 160 170 C 140 195 150 245 200 255 C 160 245 150 205 160 170 Z"
              fill="url(#highlightPetalGrad)"
            />
            {/* Right cradle petal */}
            <path
              d="M 240 170 C 260 195 250 245 200 255 C 240 245 250 205 240 170 Z"
              fill="url(#highlightPetalGrad)"
            />
          </g>

          {/* Tier 3: Inner Velvet Heart / Spiral */}
          <g className="rose-inner-heart">
            {/* Back swirl */}
            <path
              d="M 170 145 C 180 120 220 120 230 145 C 245 185 155 185 170 145 Z"
              fill="url(#deepPetalGrad1)"
            />
            {/* Center cup left swirl */}
            <path
              d="M 175 160 C 170 140 215 135 225 155 C 230 185 175 190 175 160 Z"
              fill="url(#innerCoreGrad)"
            />
            {/* Center core spiral bud */}
            <path
              d="M 188 150 C 195 142 205 142 212 150 C 215 165 185 165 188 150 Z"
              fill="url(#innerCoreGrad)"
            />
            {/* Delicate inner petal roll highlights */}
            <path
              d="M 175 152 Q 200 138 225 152"
              stroke="rgba(255, 235, 180, 0.55)"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 182 165 Q 200 152 218 165"
              stroke="rgba(255, 220, 160, 0.45)"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 165 190 Q 200 210 235 190"
              stroke="rgba(255, 210, 225, 0.4)"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Morning Dew Drops & Golden Light Flares */}
          <g className="rose-dew-drops">
            {/* Drop on outer left petal */}
            <ellipse cx="122" cy="226" rx="3.5" ry="4.5" fill="url(#dewGlow)" />
            <circle cx="121" cy="224" r="1.2" fill="#ffffff" />

            {/* Drop on center front petal */}
            <ellipse cx="230" cy="235" rx="3" ry="4" fill="url(#dewGlow)" />
            <circle cx="229" cy="233" r="1" fill="#ffffff" />

            {/* Drop on right petal */}
            <ellipse cx="270" cy="215" rx="2.5" ry="3.5" fill="url(#dewGlow)" />
            <circle cx="269" cy="214" r="0.8" fill="#ffffff" />

            {/* Delicate golden pollen dust sparkles */}
            <circle cx="198" cy="148" r="1.2" fill="#ffeaa7" opacity="0.9" filter="url(#softGlowFilter)" />
            <circle cx="204" cy="154" r="1" fill="#ffeaa7" opacity="0.8" />
            <circle cx="192" cy="158" r="0.9" fill="#f6e58d" opacity="0.75" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
};
