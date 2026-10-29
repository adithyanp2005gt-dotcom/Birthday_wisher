import { createContext } from 'react';
import type { WishConfig, RoseWishItem } from '../types/wish';

export interface WishContextType {
  config: WishConfig;
  updateConfig: (updater: (prev: WishConfig) => WishConfig) => void;
  updateSection: <K extends keyof WishConfig>(section: K, data: Partial<WishConfig[K]>) => void;
  updateRose: (id: number, data: Partial<RoseWishItem>) => void;
  updateLetterParagraph: (index: number, text: string) => void;
  addLetterParagraph: (text?: string) => void;
  removeLetterParagraph: (index: number) => void;
  quickPersonalize: (meta: {
    recipientName: string;
    senderName: string;
    occasion: string;
    relationship?: string;
  }) => void;
  resetToDefault: () => void;
  isCustomized: boolean;
  exportAsJson: () => string;
  importFromJson: (jsonStr: string) => boolean;
  getShareableUrl: () => string;
  isEditorOpen: boolean;
  setIsEditorOpen: (open: boolean) => void;
  activeEditorTab: string;
  setActiveEditorTab: (tab: string) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isReadOnly: boolean;
  setIsReadOnly: (readOnly: boolean) => void;
}

export const WishContext = createContext<WishContextType | undefined>(undefined);
