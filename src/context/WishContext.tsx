import React, { useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_WISH_CONFIG,
  applyQuickPersonalization,
  serializeWishConfig,
  deserializeWishConfig,
  type WishConfig,
  type RoseWishItem,
} from '../types/wish';
import type { MemoryItem } from '../types/memory';
import { WishContext } from './wish-context-def';

const STORAGE_KEY = 'amma_custom_wish_v2';

export const WishProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [config, setConfig] = useState<WishConfig>(() => {
    // 1. Try URL Hash or Query param first
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#wish=')) {
        const encoded = hash.slice(6);
        const parsed = deserializeWishConfig(encoded);
        if (parsed) return parsed;
      }
      const searchParams = new URLSearchParams(window.location.search);
      const queryWish = searchParams.get('wish');
      if (queryWish) {
        const parsed = deserializeWishConfig(queryWish);
        if (parsed) return parsed;
      }
    } catch (e) {
      console.warn('Could not parse wish from URL', e);
    }

    // Clean up any legacy dynamic memories stored in local storage
    try {
      localStorage.removeItem('project_amma_memories_dynamic');
    } catch {
      // ignore
    }

    // 2. Try localStorage (for creator text changes, but photos are never stored permanently)
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const gardenOverrides = parsed.garden || {};

          // Migration: reset completionButtonText if it still holds the old value
          const STALE_BUTTON_TEXTS = [
            'One Last Surprise, Ammachi mon ❤️',
          ];
          if (STALE_BUTTON_TEXTS.includes(gardenOverrides.completionButtonText)) {
            gardenOverrides.completionButtonText = DEFAULT_WISH_CONFIG.garden.completionButtonText;
          }

          return {
            meta: { ...DEFAULT_WISH_CONFIG.meta, ...(parsed.meta || {}) },
            opening: { ...DEFAULT_WISH_CONFIG.opening, ...(parsed.opening || {}) },
            garden: {
              ...DEFAULT_WISH_CONFIG.garden,
              ...gardenOverrides,
              roses: Array.isArray(parsed.garden?.roses)
                ? parsed.garden.roses
                : DEFAULT_WISH_CONFIG.garden.roses,
            },
            finale: {
              ...DEFAULT_WISH_CONFIG.finale,
              ...(parsed.finale || {}),
              // The editable site always starts with clean default template photos (not permanent)
              memories: DEFAULT_WISH_CONFIG.finale.memories,
              letter: {
                ...DEFAULT_WISH_CONFIG.finale.letter,
                ...(parsed.finale?.letter || {}),
                paragraphs: Array.isArray(parsed.finale?.letter?.paragraphs)
                  ? parsed.finale.letter.paragraphs
                  : DEFAULT_WISH_CONFIG.finale.letter.paragraphs,
              },
            },
          };
        }
      }
    } catch (e) {
      console.warn('Could not read saved wish from storage', e);
    }

    // 3. Fallback to default (original content untouched)
    return DEFAULT_WISH_CONFIG;
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState('quick');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const checkIsReadOnly = useCallback((): boolean => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#wish=')) return true;
      const searchParams = new URLSearchParams(window.location.search);
      if (
        searchParams.has('wish') ||
        searchParams.get('mode') === 'view' ||
        searchParams.get('view') === 'true' ||
        searchParams.get('readonly') === 'true'
      ) {
        return true;
      }
    } catch (e) {
      console.warn('Error checking read-only mode', e);
    }
    return false;
  }, []);

  const [isReadOnly, setIsReadOnly] = useState<boolean>(checkIsReadOnly);

  useEffect(() => {
    const handleUrlChange = () => {
      setIsReadOnly(checkIsReadOnly());
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [checkIsReadOnly]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  }, []);

  // Save changes to localStorage only when in creator / editing mode
  // Exclude memories so uploaded pictures are NEVER permanently saved to the editable site
  useEffect(() => {
    if (isReadOnly) return;
    try {
      const configToPersist = {
        ...config,
        finale: {
          ...config.finale,
          memories: undefined, // uploaded pictures are for link generation only, not permanent storage
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configToPersist));
    } catch (e) {
      console.warn('Could not save wish configuration', e);
    }
  }, [config, isReadOnly]);

  const updateConfig = useCallback((updater: (prev: WishConfig) => WishConfig) => {
    setConfig(updater);
  }, []);

  const updateSection = useCallback(
    <K extends keyof WishConfig>(section: K, data: Partial<WishConfig[K]>) => {
      setConfig((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          ...data,
        },
      }));
    },
    []
  );

  const updateRose = useCallback((id: number, data: Partial<RoseWishItem>) => {
    setConfig((prev) => ({
      ...prev,
      garden: {
        ...prev.garden,
        roses: prev.garden.roses.map((r) => (r.id === id ? { ...r, ...data } : r)),
      },
    }));
  }, []);

  const updateMemories = useCallback((memories: MemoryItem[]) => {
    setConfig((prev) => ({
      ...prev,
      finale: {
        ...prev.finale,
        memories,
      },
    }));
  }, []);

  const updateLetterParagraph = useCallback((index: number, text: string) => {
    setConfig((prev) => {
      const nextParagraphs = [...prev.finale.letter.paragraphs];
      nextParagraphs[index] = text;
      return {
        ...prev,
        finale: {
          ...prev.finale,
          letter: {
            ...prev.finale.letter,
            paragraphs: nextParagraphs,
          },
        },
      };
    });
  }, []);

  const addLetterParagraph = useCallback((text = 'A new heartfelt paragraph for you...') => {
    setConfig((prev) => ({
      ...prev,
      finale: {
        ...prev.finale,
        letter: {
          ...prev.finale.letter,
          paragraphs: [...prev.finale.letter.paragraphs, text],
        },
      },
    }));
  }, []);

  const removeLetterParagraph = useCallback((index: number) => {
    setConfig((prev) => {
      if (prev.finale.letter.paragraphs.length <= 1) return prev;
      const nextParagraphs = prev.finale.letter.paragraphs.filter((_, i) => i !== index);
      return {
        ...prev,
        finale: {
          ...prev.finale,
          letter: {
            ...prev.finale.letter,
            paragraphs: nextParagraphs,
          },
        },
      };
    });
  }, []);

  const quickPersonalize = useCallback(
    (meta: {
      recipientName: string;
      senderName: string;
      occasion: string;
      relationship?: string;
    }) => {
      setConfig((prev) =>
        applyQuickPersonalization(
          prev,
          meta.recipientName,
          meta.senderName,
          meta.occasion,
          meta.relationship
        )
      );
      showToast('✨ Quick customization applied to all scenes!');
    },
    [showToast]
  );

  const resetToDefault = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('project_amma_memories_dynamic');
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch {
      // Ignored
    }
    setConfig(DEFAULT_WISH_CONFIG);
    showToast('Original default content restored.');
  }, [showToast]);

  const exportAsJson = useCallback(() => {
    return JSON.stringify(config, null, 2);
  }, [config]);

  const importFromJson = useCallback(
    (jsonStr: string): boolean => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed && typeof parsed === 'object' && parsed.opening && parsed.garden && parsed.finale) {
          setConfig({
            meta: { ...DEFAULT_WISH_CONFIG.meta, ...(parsed.meta || {}) },
            opening: { ...DEFAULT_WISH_CONFIG.opening, ...(parsed.opening || {}) },
            garden: {
              ...DEFAULT_WISH_CONFIG.garden,
              ...(parsed.garden || {}),
              roses: Array.isArray(parsed.garden?.roses)
                ? parsed.garden.roses
                : DEFAULT_WISH_CONFIG.garden.roses,
            },
            finale: {
              ...DEFAULT_WISH_CONFIG.finale,
              ...(parsed.finale || {}),
              memories: Array.isArray(parsed.finale?.memories)
                ? parsed.finale.memories
                : DEFAULT_WISH_CONFIG.finale.memories,
              letter: {
                ...DEFAULT_WISH_CONFIG.finale.letter,
                ...(parsed.finale?.letter || {}),
                paragraphs: Array.isArray(parsed.finale?.letter?.paragraphs)
                  ? parsed.finale.letter.paragraphs
                  : DEFAULT_WISH_CONFIG.finale.letter.paragraphs,
              },
            },
          });
          showToast('Custom wish successfully imported!');
          return true;
        }
      } catch (err) {
        console.error('Import error', err);
      }
      showToast('Could not import JSON: Invalid format.');
      return false;
    },
    [showToast]
  );

  const getShareableUrl = useCallback(() => {
    const encoded = serializeWishConfig(config);
    return `${window.location.origin}${window.location.pathname}?view=true#wish=${encoded}`;
  }, [config]);

  // Check if current config differs from DEFAULT_WISH_CONFIG
  const isCustomized =
    config.meta.recipientName !== DEFAULT_WISH_CONFIG.meta.recipientName ||
    config.meta.senderName !== DEFAULT_WISH_CONFIG.meta.senderName ||
    config.meta.occasion !== DEFAULT_WISH_CONFIG.meta.occasion;

  return (
    <WishContext.Provider
      value={{
        config,
        updateConfig,
        updateSection,
        updateRose,
        updateMemories,
        updateLetterParagraph,
        addLetterParagraph,
        removeLetterParagraph,
        quickPersonalize,
        resetToDefault,
        isCustomized,
        exportAsJson,
        importFromJson,
        getShareableUrl,
        isEditorOpen,
        setIsEditorOpen,
        activeEditorTab,
        setActiveEditorTab,
        isShareModalOpen,
        setIsShareModalOpen,
        toastMessage,
        showToast,
        isReadOnly,
        setIsReadOnly,
      }}
    >
      {children}
    </WishContext.Provider>
  );
};

