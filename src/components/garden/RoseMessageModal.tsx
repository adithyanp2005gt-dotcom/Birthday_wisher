import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart } from 'lucide-react';
import type { GardenRoseData } from '../../types/garden';
import { EditableText } from '../common/EditableText';
import { useWish } from '../../context/useWish';

interface RoseMessageModalProps {
  rose: GardenRoseData | null;
  onClose: () => void;
  reducedMotion?: boolean;
}

export const RoseMessageModal: React.FC<RoseMessageModalProps> = ({
  rose,
  onClose,
  reducedMotion = false,
}) => {
  const { config, updateRose, updateSection } = useWish();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (rose) {
      window.addEventListener('keydown', handleKeyDown);
      // Auto-focus close button for keyboard users
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [rose, onClose]);

  const cinematicEase = [0.16, 1, 0.3, 1] as const;

  return (
    <AnimatePresence>
      {rose && (
        <div
          className="rose-modal-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-rose-title"
        >
          <motion.div
            className="rose-modal-card"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside card
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.92, y: reducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.94, y: reducedMotion ? 0 : 15 }}
            transition={{ duration: reducedMotion ? 0.2 : 0.5, ease: cinematicEase }}
          >
            {/* Top Close Button */}
            <button
              type="button"
              ref={closeButtonRef}
              className="modal-close-icon-btn"
              onClick={onClose}
              aria-label="Close message and return to garden"
            >
              <X size={18} strokeWidth={2} />
            </button>

            {/* Radiant Ambient Core Halo */}
            <div className="modal-ambient-glow" />

            {/* Header Badge */}
            <div className="modal-rose-badge">
              <Sparkles size={12} className="modal-badge-sparkle" />
              <span>
                Rose {rose.id} of 10 • {rose.numeral}
              </span>
            </div>

            {/* Decorative Blooming Rose Icon */}
            <div className="modal-rose-emblem" aria-hidden="true">
              <svg viewBox="0 0 100 100" className="modal-emblem-svg">
                <radialGradient id="modalRoseGrad" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#f4728f" />
                  <stop offset="45%" stopColor="#c21945" />
                  <stop offset="85%" stopColor="#800e2b" />
                  <stop offset="100%" stopColor="#3d0312" />
                </radialGradient>
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
                <path
                  d="M 50 25 C 65 35 68 55 50 68 C 32 55 35 35 50 25 Z"
                  fill="url(#modalRoseGrad)"
                />
                <path
                  d="M 35 40 C 22 55 35 72 50 74 C 40 68 32 55 35 40 Z"
                  fill="#9e1338"
                />
                <path
                  d="M 65 40 C 78 55 65 72 50 74 C 60 68 68 55 65 40 Z"
                  fill="#9e1338"
                />
                <circle cx="50" cy="48" r="4" fill="#ffd470" />
              </svg>
            </div>

            {/* Rose Chapter Title */}
            <h3 id="modal-rose-title" className="modal-rose-title">
              <EditableText
                value={rose.title}
                onChange={(val) => updateRose(rose.id, { title: val })}
                placeholder="Rose Title"
              />
            </h3>

            {/* Personalized Message */}
            <blockquote className="modal-rose-message">
              "
              <EditableText
                multiline
                value={rose.message}
                onChange={(val) => updateRose(rose.id, { message: val })}
                placeholder="Heartfelt story for this rose..."
              />
              "
            </blockquote>

            {/* Signature */}
            <div className="modal-signature">
              <Heart size={13} fill="#a61238" className="signature-heart" />
              <EditableText
                value={config.garden.roseSignature}
                onChange={(val) => updateSection('garden', { roseSignature: val })}
                placeholder="With all my love, Mone"
              />
            </div>

            {/* Return Button */}
            <button
              type="button"
              className="modal-return-btn"
              onClick={onClose}
            >
              Return to Garden
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

