import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { PetalCanvas } from '../common/PetalCanvas';
import { RoseArtwork } from '../common/RoseArtwork';
import { EditableText } from '../common/EditableText';
import { useWish } from '../../context/useWish';
import './OpeningScene.css';

interface OpeningSceneProps {
  onEnterGarden: () => void;
}

export const OpeningScene: React.FC<OpeningSceneProps> = ({ onEnterGarden }) => {
  const { config, updateSection } = useWish();
  const shouldReduceMotion = useReducedMotion();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEnterClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents accidental navigation
    if (isTransitioning) return;

    setIsTransitioning(true);
    // Allow the cinematic transition curtain to animate before signaling parent
    setTimeout(() => {
      onEnterGarden();
    }, 1200);
  };

  const cinematicEase = [0.16, 1, 0.3, 1] as const;

  // Staggered motion variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0.05 : 0.22,
        delayChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: { duration: 0.8, ease: cinematicEase },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.4 : 0.9,
        ease: cinematicEase,
      },
    },
  };

  return (
    <div className="opening-scene-container">
      {/* Background ambient lighting */}
      <div className="ambient-lighting" />

      {/* Floating Rose Petals and Shimmering Gold Particles */}
      <PetalCanvas reducedMotion={!!shouldReduceMotion} />

      {/* Main Content Stage */}
      <motion.main
        className="opening-content-stage"
        variants={containerVariants}
        initial="hidden"
        animate={isTransitioning ? 'exit' : 'visible'}
      >
        {/* Intro Label */}
        <motion.div variants={itemVariants} className="opening-intro-pill">
          <Sparkles size={13} className="pill-sparkle" />
          <EditableText
            value={config.opening.badgeText}
            onChange={(val) => updateSection('opening', { badgeText: val })}
            placeholder="A GARDEN MADE WITH LOVE"
          />
        </motion.div>

        {/* Central Rose Artwork Focal Point */}
        <motion.div variants={itemVariants}>
          <RoseArtwork reducedMotion={!!shouldReduceMotion} />
        </motion.div>

        {/* Main Heading */}
        <motion.h1 variants={itemVariants} className="opening-heading">
          <EditableText
            value={config.opening.headingPrefix}
            onChange={(val) => updateSection('opening', { headingPrefix: val })}
            placeholder="For You,"
          />{' '}
          <EditableText
            className="opening-heading-accent"
            value={config.opening.recipientHighlight}
            onChange={(val) => updateSection('opening', { recipientHighlight: val })}
            placeholder="Ammachi mon."
          />
        </motion.h1>

        {/* Supporting Message */}
        <motion.p variants={itemVariants} className="opening-supporting-text">
          <EditableText
            multiline
            value={config.opening.supportingText}
            onChange={(val) => updateSection('opening', { supportingText: val })}
            placeholder="Because someone as special as you deserves something extraordinary."
          />
        </motion.p>

        {/* Primary Action Button */}
        <motion.div variants={itemVariants} className="enter-button-wrapper">
          <motion.button
            type="button"
            className="enter-button"
            onClick={handleEnterClick}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            aria-label={config.opening.buttonText}
          >
            <EditableText
              value={config.opening.buttonText}
              onChange={(val) => updateSection('opening', { buttonText: val })}
              placeholder="Open Your Garden"
            />
            <span className="button-icon-aura">
              <ArrowRight size={17} strokeWidth={2.2} />
            </span>
          </motion.button>
        </motion.div>
      </motion.main>

      {/* Editorial Footer */}
      <motion.footer
        className="opening-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduceMotion ? 0.3 : 1.4, duration: 1 }}
      >
        <Heart size={13} fill="#a61238" className="footer-heart" />
        <EditableText
          value={config.opening.footerText}
          onChange={(val) => updateSection('opening', { footerText: val })}
          placeholder="Made with all my love, just for you."
        />
      </motion.footer>


      {/* Cinematic Transition Curtain (State trigger for the upcoming garden) */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="transition-curtain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: cinematicEase }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <RoseArtwork reducedMotion={!!shouldReduceMotion} />
            </motion.div>
            <motion.p
              className="transition-message"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {config.opening.transitionTitle}
            </motion.p>
            <motion.span
              className="transition-subtext"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {config.opening.transitionSubtitle}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

