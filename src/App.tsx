import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Send, MousePointerClick } from 'lucide-react';
import { OpeningScene } from './components/scenes/OpeningScene';
import { RoseGardenScene } from './components/scenes/RoseGardenScene';
import { BirthdayFinaleScene } from './components/scenes/BirthdayFinaleScene';
import { WishProvider } from './context/WishContext';
import { useWish } from './context/useWish';
import { SurpriseShareModal } from './components/customizer/SurpriseShareModal';
import { LoginPage } from './components/auth/LoginPage';
import type { SceneId } from './types/scene';
import './App.css';

/**
 * Returns true when the current URL is a generated surprise link.
 * Generated links always contain `#wish=` in the hash.
 * These links bypass login entirely — no auth needed for recipients.
 */
function isGeneratedSurpriseLink(): boolean {
  try {
    return window.location.hash.startsWith('#wish=');
  } catch {
    return false;
  }
}

/**
 * Returns true when the user has an active login session in this tab/window.
 */
function hasActiveSession(): boolean {
  try {
    return sessionStorage.getItem('amma_auth_session') === 'true';
  } catch {
    return false;
  }
}

function AppContent() {
  const { config, isShareModalOpen, setIsShareModalOpen, isReadOnly } = useWish();
  const [currentScene, setCurrentScene] = useState<SceneId>('prologue');
  const [openedRoseIds, setOpenedRoseIds] = useState<Set<number>>(new Set());

  const totalRoses = config.garden.roses.length;

  // Handle single rose opened (preserves unique count)
  const handleRoseOpened = (id: number) => {
    setOpenedRoseIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleOpenGarden = () => {
    setCurrentScene('garden_gate');
  };

  const handleBackToOpening = () => {
    setCurrentScene('prologue');
  };

  const handleProceedToFinale = () => {
    // Strictly guard: finale can only be opened when all roses have been discovered
    if (openedRoseIds.size >= totalRoses) {
      setCurrentScene('birthday_wishes');
    }
  };

  const handleReturnToGardenFromFinale = () => {
    // Returns to the garden with progress completely intact
    setCurrentScene('garden_gate');
  };

  const handleReplayExperience = () => {
    // Reset to beginning for a complete fresh replay
    setOpenedRoseIds(new Set());
    setCurrentScene('prologue');
  };

  const cinematicEase = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="app-viewport">
      {/* Top UI Action Bar: Only shown in the last page (birthday_wishes) when in creator mode */}
      {!isReadOnly && currentScene === 'birthday_wishes' && (
        <aside className="top-ui-edit-ribbon" aria-label="Direct in-UI customization controls">
          <div className="ui-edit-hint">
            <MousePointerClick size={14} className="hint-mouse-icon" />
            <span>Click any text to edit directly</span>
          </div>

          <button
            type="button"
            className="btn-ribbon-generate"
            onClick={() => setIsShareModalOpen(true)}
            title="Done editing? Generate your surprise link"
          >
            <Sparkles size={14} className="ribbon-sparkle" />
            <span>Generate Surprise Link</span>
            <Send size={13} />
          </button>
        </aside>
      )}

      <AnimatePresence mode="wait">
        {currentScene === 'prologue' && (
          <motion.div
            key="prologue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: cinematicEase }}
            style={{ width: '100%', minHeight: '100vh' }}
          >
            <OpeningScene onEnterGarden={handleOpenGarden} />
          </motion.div>
        )}

        {currentScene === 'garden_gate' && (
          <motion.div
            key="garden_gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: cinematicEase }}
            style={{ width: '100%', minHeight: '100vh' }}
          >
            <RoseGardenScene
              onBackToOpening={handleBackToOpening}
              onProceedToFinale={handleProceedToFinale}
              openedRoseIds={openedRoseIds}
              onRoseOpened={handleRoseOpened}
            />
          </motion.div>
        )}

        {currentScene === 'birthday_wishes' && openedRoseIds.size >= totalRoses && (
          <motion.div
            key="birthday_wishes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: cinematicEase }}
            style={{ width: '100%', minHeight: '100vh' }}
          >
            <BirthdayFinaleScene
              onReturnToGarden={handleReturnToGardenFromFinale}
              onReplayExperience={handleReplayExperience}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Surprise Forwarding Link & Anonymous Sharing Modal (Hidden on generated surprise link) */}
      {!isReadOnly && (
        <SurpriseShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  // Generated surprise links skip login — recipients should never see a login wall.
  // The editor (creator) must log in; session persists across page refreshes in the same tab.
  const skipLogin = isGeneratedSurpriseLink();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    skipLogin || hasActiveSession()
  );

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <WishProvider>
      <AppContent />
    </WishProvider>
  );
}


