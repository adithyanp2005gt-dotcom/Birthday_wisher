import React, { useEffect } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Sparkles, Heart, RotateCcw, Flower2, Plus, Trash2, Send } from 'lucide-react';
import { PetalCanvas } from '../common/PetalCanvas';
import { RoseArtwork } from '../common/RoseArtwork';
import { MemoryChain } from '../finale/MemoryChain';
import { EditableText } from '../common/EditableText';
import { useWish } from '../../context/useWish';
import { stopHappyBirthday } from '../../services/audioService';
import './BirthdayFinaleScene.css';

interface BirthdayFinaleSceneProps {
  onReturnToGarden: () => void;
  onReplayExperience: () => void;
}

export const BirthdayFinaleScene: React.FC<BirthdayFinaleSceneProps> = ({
  onReturnToGarden,
  onReplayExperience,
}) => {
  const {
    config,
    updateSection,
    updateLetterParagraph,
    addLetterParagraph,
    removeLetterParagraph,
    setIsShareModalOpen,
    isReadOnly,
  } = useWish();
  const shouldReduceMotion = useReducedMotion();

  // Scroll to top smoothly upon mounting and stop music on leaving scene
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
    return () => {
      stopHappyBirthday();
    };
  }, [shouldReduceMotion]);

  const cinematicEase = [0.16, 1, 0.3, 1] as const;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0.05 : 0.18,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 0.85,
        ease: cinematicEase,
      },
    },
  };

  const letter = config.finale.letter;

  return (
    <div className="finale-scene-container">
      {/* Background ambient deep velvet glow & floating petals */}
      <div className="finale-ambient-glow" />
      <PetalCanvas reducedMotion={!!shouldReduceMotion} />

      {/* Top Navigation */}
      <header className="finale-nav-bar">
        <button
          type="button"
          className="finale-nav-btn"
          onClick={onReturnToGarden}
          aria-label="Revisit the Rose Garden"
        >
          <Flower2 size={14} />
          <span>The Rose Garden</span>
        </button>

        <button
          type="button"
          className="finale-nav-btn"
          onClick={onReplayExperience}
          aria-label="Replay from the beginning"
        >
          <RotateCcw size={13} />
          <span>Replay Journey</span>
        </button>
      </header>

      {/* Main Content Stage */}
      <motion.main
        className="finale-content-stage"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Small Intro Heading */}
        <motion.div variants={itemVariants} className="finale-intro-pill">
          <Sparkles size={12} className="finale-pill-sparkle" />
          <EditableText
            value={config.finale.badgeText}
            onChange={(val) => updateSection('finale', { badgeText: val })}
            placeholder="A LITTLE GIFT FROM YOUR MONE"
          />
        </motion.div>

        {/* Central Rose Artwork */}
        <motion.div variants={itemVariants} className="finale-rose-wrapper">
          <RoseArtwork reducedMotion={!!shouldReduceMotion} />
        </motion.div>

        {/* Main Heading */}
        <motion.h1 variants={itemVariants} className="finale-main-heading">
          <EditableText
            value={config.finale.mainHeadingPrefix}
            onChange={(val) => updateSection('finale', { mainHeadingPrefix: val })}
            placeholder="Happy Birthday,"
          />{' '}
          <br />
          <span className="finale-heading-name">
            <EditableText
              value={config.finale.headingName}
              onChange={(val) => updateSection('finale', { headingName: val })}
              placeholder="My Dearest Ammachi mon."
            />
          </span>
        </motion.h1>

        {/* Supporting Text */}
        <motion.p variants={itemVariants} className="finale-supporting-text">
          <EditableText
            multiline
            value={config.finale.supportingText}
            onChange={(val) => updateSection('finale', { supportingText: val })}
            placeholder="Today is all about you..."
          />
        </motion.p>

        {/* The Golden Memory Chain */}
        <motion.div variants={itemVariants} style={{ width: '100%' }}>
          <MemoryChain reducedMotion={!!shouldReduceMotion} />
        </motion.div>

        {/* The Personal Letter */}
        <motion.article
          variants={itemVariants}
          className="letter-parchment-card"
          aria-label={`Personal Letter to ${config.meta.recipientName}`}
        >
          <div className="letter-ornament-header" aria-hidden="true">
            <span className="letter-ornament-line" />
            <Heart size={14} fill="#d92550" color="#d92550" />
            <span className="letter-ornament-line" />
          </div>

          <div className="letter-body">
            <p className="letter-salutation">
              <EditableText
                value={letter.salutation}
                onChange={(val) =>
                  updateSection('finale', { letter: { ...letter, salutation: val } })
                }
                placeholder="My Dearest Ammachi mon,"
              />
            </p>

            <p className="letter-greeting-burst">
              <EditableText
                value={letter.greeting}
                onChange={(val) =>
                  updateSection('finale', { letter: { ...letter, greeting: val } })
                }
                placeholder="Happy Birthday! ❤️"
              />
            </p>

            {letter.paragraphs.map((para, idx) => (
              <div key={idx} style={{ position: 'relative', margin: '0.9rem 0' }}>
                <p className="letter-paragraph" style={{ margin: 0 }}>
                  <EditableText
                    multiline
                    value={para}
                    onChange={(val) => updateLetterParagraph(idx, val)}
                    placeholder="Write a heartfelt paragraph..."
                  />
                </p>
                {!isReadOnly && letter.paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLetterParagraph(idx)}
                    title="Remove paragraph"
                    style={{
                      position: 'absolute',
                      right: -30,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(217, 37, 80, 0.4)',
                      cursor: 'pointer',
                      padding: 4,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ff4d6d')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(217, 37, 80, 0.4)')}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}

            {!isReadOnly && (
              <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                <button
                  type="button"
                  onClick={() => addLetterParagraph('A new heartfelt paragraph for you...')}
                  style={{
                    background: 'rgba(212, 175, 55, 0.08)',
                    border: '1px dashed rgba(212, 175, 55, 0.35)',
                    color: '#ffd470',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 6,
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Plus size={13} />
                  <span>Add Another Paragraph to Letter</span>
                </button>
              </div>
            )}

            <p className="letter-closing-love">
              <EditableText
                value={letter.closingLove}
                onChange={(val) =>
                  updateSection('finale', { letter: { ...letter, closingLove: val } })
                }
                placeholder="I love you, Ammachi mon."
              />
            </p>

            <p className="letter-closing-wish">
              <EditableText
                value={letter.closingWish}
                onChange={(val) =>
                  updateSection('finale', { letter: { ...letter, closingWish: val } })
                }
                placeholder="Happy Birthday! ❤️"
              />
            </p>

            <div className="letter-signature-block">
              <Heart size={16} fill="#a61238" className="signature-gold-heart" />
              <EditableText
                value={letter.signOff}
                onChange={(val) =>
                  updateSection('finale', { letter: { ...letter, signOff: val } })
                }
                placeholder="Forever your Mone."
              />
            </div>
          </div>
        </motion.article>

        {/* Final Visual Moment: Prominent Emotional Line */}
        <motion.aside
          variants={itemVariants}
          className="final-moment-plaque"
          aria-label="Eternal dedication"
        >
          <blockquote className="final-moment-quote">
            "
            <EditableText
              value={config.finale.finalQuote}
              onChange={(val) => updateSection('finale', { finalQuote: val })}
              placeholder="Amma's love is a gift I will carry for my entire life."
            />
            "
          </blockquote>
        </motion.aside>

        {/* PROMINENT ACTION: GENERATE SURPRISE LINK & SHARE (Hidden in read-only / recipient view) */}
        {!isReadOnly && (
          <motion.div
            variants={itemVariants}
            style={{
              width: '100%',
              maxWidth: 580,
              margin: '2rem auto 1rem',
              textAlign: 'center',
            }}
          >
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                width: '100%',
                padding: '1.05rem 2rem',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #b08a1c 0%, #d4af37 50%, #8c6a0c 100%)',
                border: '1px solid rgba(255, 238, 170, 0.7)',
                color: '#1a060d',
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(212, 175, 55, 0.45), 0 0 40px rgba(212, 175, 55, 0.25)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 36px rgba(212, 175, 55, 0.65), 0 0 50px rgba(212, 175, 55, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow =
                  '0 8px 30px rgba(212, 175, 55, 0.45), 0 0 40px rgba(212, 175, 55, 0.25)';
              }}
            >
              <Sparkles size={18} />
              <span>Generate Surprise Link</span>
              <Send size={16} />
            </button>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginTop: '0.55rem',
              }}
            >
              Finished editing in the UI? Generate your custom forwarding link to share with your loved one!
            </p>
          </motion.div>
        )}

        {/* Action Controls */}
        <motion.div variants={itemVariants} className="finale-actions-row">
          <button
            type="button"
            className="btn-primary-finale"
            onClick={onReturnToGarden}
            aria-label={config.finale.returnButtonText}
          >
            <Flower2 size={16} />
            <EditableText
              value={config.finale.returnButtonText}
              onChange={(val) => updateSection('finale', { returnButtonText: val })}
              placeholder="Revisit Your Rose Garden"
            />
          </button>

          <button
            type="button"
            className="btn-secondary-finale"
            onClick={onReplayExperience}
            aria-label={config.finale.replayButtonText}
          >
            <RotateCcw size={15} />
            <EditableText
              value={config.finale.replayButtonText}
              onChange={(val) => updateSection('finale', { replayButtonText: val })}
              placeholder="Replay Experience"
            />
          </button>
        </motion.div>
      </motion.main>
    </div>
  );
};


