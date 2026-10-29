import React, { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Sparkles, ArrowLeft, Heart, Flower2 } from 'lucide-react';
import type { GardenRoseData } from '../../types/garden';
import { GardenRose } from '../garden/GardenRose';
import { RoseMessageModal } from '../garden/RoseMessageModal';
import { PetalCanvas } from '../common/PetalCanvas';
import { EditableText } from '../common/EditableText';
import { useWish } from '../../context/useWish';
import { playHappyBirthday } from '../../services/audioService';
import './RoseGardenScene.css';

interface RoseGardenSceneProps {
  onBackToOpening: () => void;
  onProceedToFinale: () => void;
  openedRoseIds: Set<number>;
  onRoseOpened: (id: number) => void;
}

export const RoseGardenScene: React.FC<RoseGardenSceneProps> = ({
  onBackToOpening,
  onProceedToFinale,
  openedRoseIds,
  onRoseOpened,
}) => {
  const { config, updateSection } = useWish();
  const shouldReduceMotion = useReducedMotion();
  const [selectedRose, setSelectedRose] = useState<GardenRoseData | null>(null);

  const cinematicEase = [0.16, 1, 0.3, 1] as const;

  const handleRoseClick = (rose: GardenRoseData) => {
    // Notify parent to record the opened rose
    onRoseOpened(rose.id);
    setSelectedRose(rose);
  };

  const handleCloseModal = () => {
    setSelectedRose(null);
  };

  const roses = config.garden.roses;
  const discoveredCount = openedRoseIds.size;
  const totalRoses = roses.length;
  const allDiscovered = discoveredCount === totalRoses;
  const progressPercent = (discoveredCount / totalRoses) * 100;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0.04 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 0.8,
        ease: cinematicEase,
      },
    },
  };

  return (
    <div className="rose-garden-container">
      {/* Background ambient lighting & floating petals */}
      <div className="garden-ambient-lighting" />
      <PetalCanvas reducedMotion={!!shouldReduceMotion} />

      {/* Header and Controls */}
      <motion.header
        className="garden-header-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="garden-top-bar">
          <button
            type="button"
            className="garden-back-btn"
            onClick={onBackToOpening}
            aria-label="Return to opening screen"
          >
            <ArrowLeft size={14} />
            <span>Entrance</span>
          </button>

          <div className="garden-sanctuary-tag">
            <Sparkles size={11} />
            <EditableText
              value={config.garden.sanctuaryTag}
              onChange={(val) => updateSection('garden', { sanctuaryTag: val })}
              placeholder="Sanctuary of Ten Roses"
            />
          </div>

          <div style={{ width: 85 }} aria-hidden="true" />
        </div>

        <motion.h1 variants={itemVariants} className="garden-main-title">
          <EditableText
            value={config.garden.mainTitlePrefix}
            onChange={(val) => updateSection('garden', { mainTitlePrefix: val })}
            placeholder="The Digital"
          />{' '}
          <em>
            <EditableText
              value={config.garden.mainTitleAccent}
              onChange={(val) => updateSection('garden', { mainTitleAccent: val })}
              placeholder="Rose Garden"
            />
          </em>
        </motion.h1>

        <motion.p variants={itemVariants} className="garden-description">
          <EditableText
            multiline
            value={config.garden.description}
            onChange={(val) => updateSection('garden', { description: val })}
            placeholder="Ten sacred red roses bloom in your honor..."
          />
        </motion.p>

        {/* Progress Tracker Card */}
        <motion.div variants={itemVariants} className="garden-progress-card">
          <div className="progress-header-row">
            <Flower2 size={16} color="#d4af37" />
            <span className="progress-count-text">
              {discoveredCount} of {totalRoses} roses discovered
            </span>
          </div>
          <div
            className="progress-track-bar"
            role="progressbar"
            aria-valuenow={discoveredCount}
            aria-valuemin={0}
            aria-valuemax={totalRoses}
            aria-label="Roses discovered progress"
          >
            <div
              className="progress-fill-bar"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </motion.div>
      </motion.header>

      {/* Ten Interactive Roses Composition Grid */}
      <main className="roses-garden-grid" aria-label="Interactive roses garden">
        {roses.map((rose, index) => (
          <GardenRose
            key={rose.id}
            rose={rose}
            index={index}
            isOpened={openedRoseIds.has(rose.id)}
            onClick={() => handleRoseClick(rose)}
            reducedMotion={!!shouldReduceMotion}
          />
        ))}
      </main>

      {/* Gentle Completion Celebration Banner (Appears when all 10 are discovered) */}
      {allDiscovered && (
        <motion.section
          className="garden-completion-banner"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: cinematicEase }}
          aria-live="polite"
        >
          <div className="completion-emblem">
            <Heart size={24} fill="#a61238" />
          </div>

          <h2 className="completion-message">
            "
            <EditableText
              value={config.garden.completionQuote}
              onChange={(val) => updateSection('garden', { completionQuote: val })}
              placeholder="Every rose has a story, and every story begins with love."
            />
            "
          </h2>

          <p className="completion-subtext">
            <EditableText
              multiline
              value={config.garden.completionSubtext}
              onChange={(val) => updateSection('garden', { completionSubtext: val })}
              placeholder="All ten blossoms have unfolded their whispers for you..."
            />
          </p>

          <button
            type="button"
            className="stage-transition-btn"
            onClick={() => {
              playHappyBirthday();
              onProceedToFinale();
            }}
            aria-label={config.garden.completionButtonText}
          >
            <EditableText
              value={config.garden.completionButtonText}
              onChange={(val) => updateSection('garden', { completionButtonText: val })}
              placeholder="One Last Surprise ❤️"
            />
          </button>
        </motion.section>
      )}


      {/* Message Modal for Selected Rose */}
      <RoseMessageModal
        rose={selectedRose}
        onClose={handleCloseModal}
        reducedMotion={!!shouldReduceMotion}
      />
    </div>
  );
};

