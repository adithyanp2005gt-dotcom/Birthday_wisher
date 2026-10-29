import { GARDEN_ROSES, type GardenRoseData } from './garden';

export interface RoseWishItem {
  id: number;
  numeral: string;
  petalCount: number;
  title: string;
  message: string;
}

export interface WishMetaConfig {
  recipientName: string;
  senderName: string;
  relationship: string;
  occasion: string;
}

export interface OpeningSceneConfig {
  badgeText: string;
  headingPrefix: string;
  recipientHighlight: string;
  supportingText: string;
  buttonText: string;
  footerText: string;
  transitionTitle: string;
  transitionSubtitle: string;
}

export interface RoseGardenSceneConfig {
  sanctuaryTag: string;
  mainTitlePrefix: string;
  mainTitleAccent: string;
  description: string;
  roseSignature: string;
  completionQuote: string;
  completionSubtext: string;
  completionButtonText: string;
  roses: RoseWishItem[];
}

export interface LetterConfig {
  salutation: string;
  greeting: string;
  paragraphs: string[];
  closingLove: string;
  closingWish: string;
  signOff: string;
}

export interface FinaleSceneConfig {
  badgeText: string;
  mainHeadingPrefix: string;
  headingName: string;
  supportingText: string;
  memorySectionTitlePrefix: string;
  memorySectionTitleAccent: string;
  memorySectionTitleSuffix: string;
  memorySectionHint: string;
  letter: LetterConfig;
  finalQuote: string;
  returnButtonText: string;
  replayButtonText: string;
}

export interface WishConfig {
  meta: WishMetaConfig;
  opening: OpeningSceneConfig;
  garden: RoseGardenSceneConfig;
  finale: FinaleSceneConfig;
}

/**
 * EXACT DEFAULT CONTENT - 100% preserves original "Ammachi mon" / "Mone" content.
 */
export const DEFAULT_WISH_CONFIG: WishConfig = {
  meta: {
    recipientName: 'Ammachi mon',
    senderName: 'Mone',
    relationship: 'son',
    occasion: 'Birthday',
  },
  opening: {
    badgeText: 'A GARDEN MADE WITH LOVE',
    headingPrefix: 'For You,',
    recipientHighlight: 'Ammachi mon.',
    supportingText: 'Because someone as special as you deserves something extraordinary.',
    buttonText: 'Open Your Garden',
    footerText: 'Made with all my love, just for you.',
    transitionTitle: 'The Garden Gates Are Opening...',
    transitionSubtitle: 'Step into your sanctuary',
  },
  garden: {
    sanctuaryTag: 'Sanctuary of Ten Roses',
    mainTitlePrefix: 'The Digital',
    mainTitleAccent: 'Rose Garden',
    description:
      'Ten sacred red roses bloom in your honor, Ammachi mon. Tap each blossom to discover the heartfelt story and unspoken love woven into every petal.',
    roseSignature: 'With all my love, Mone',
    completionQuote: 'Every rose has a story, and every story begins with love.',
    completionSubtext:
      'All ten blossoms have unfolded their whispers for you. You are the heartbeat of our lives, cherished beyond measure every single day.',
    completionButtonText: 'Welcome ❤️',
    roses: GARDEN_ROSES.map((rose: GardenRoseData) => ({ ...rose })),
  },
  finale: {
    badgeText: 'A LITTLE GIFT FROM YOUR MONE',
    mainHeadingPrefix: 'Happy Birthday,',
    headingName: 'My Dearest Ammachi mon.',
    supportingText: 'Today is all about you, and I wanted to make something special just for you.',
    memorySectionTitlePrefix: 'Timeless',
    memorySectionTitleAccent: 'Memories',
    memorySectionTitleSuffix: 'With Ammachi mon',
    memorySectionHint:
      'woven in golden thread—each reflecting a lifetime of love, warmth, and grace.',
    letter: {
      salutation: 'My Dearest Ammachi mon,',
      greeting: 'Happy Birthday! ❤️',
      paragraphs: [
        'Sometimes, I may not express everything I feel, but I hope you know how special you are to me.',
        'Your love, your care, and all the little things you do mean more to me than I can ever explain.',
        'As I grow, learn, and work towards my dreams, I hope I can give you many reasons to smile and feel proud.',
        'I cannot promise that every day will be perfect, but I promise that I will always carry your love with me.',
        'If there is one thing I wish for today, it is that you receive as much happiness as you have given me.',
        'You deserve beautiful days, peaceful moments, good health, and countless reasons to smile.',
        'No matter how much I grow, no matter where life takes me, I will always be your Mone.',
      ],
      closingLove: 'I love you, Ammachi mon.',
      closingWish: 'Happy Birthday! ❤️',
      signOff: 'Forever your Mone.',
    },
    finalQuote: "Amma's love is a gift I will carry for my entire life.",
    returnButtonText: 'Revisit Your Rose Garden',
    replayButtonText: 'Replay Experience',
  },
};

/**
 * Intelligent helper to quickly propagate recipient & sender names across templates
 * if the user wants an instant 10-second customization.
 */
export function applyQuickPersonalization(
  base: WishConfig,
  recipient: string,
  sender: string,
  occasion: string = 'Birthday',
  relationship: string = ''
): WishConfig {
  const rName = recipient.trim() || 'You';
  const sName = sender.trim() || 'Me';
  const occ = occasion.trim() || 'Special Day';
  const rel = relationship.trim() || sName;

  const replaceOccasion = (text: string) => {
    return text.replace(/birthday/gi, (match) => {
      if (match === 'Birthday') return occ;
      if (match === 'BIRTHDAY') return occ.toUpperCase();
      return occ.toLowerCase();
    });
  };

  return {
    meta: {
      recipientName: rName,
      senderName: sName,
      relationship: rel,
      occasion: occ,
    },
    opening: {
      ...base.opening,
      recipientHighlight: `${rName}.`,
    },
    garden: {
      ...base.garden,
      description: `Ten sacred red roses bloom in your honor, ${rName}. Tap each blossom to discover the heartfelt story and unspoken love woven into every petal.`,
      roseSignature: `With all my love, ${sName}`,
      completionButtonText: `Welcome ❤️`,
      roses: base.garden.roses.map((rose, idx) => {
        let msg = rose.message;
        // In the first rose:
        if (idx === 0) {
          msg = `${rName}, your love is one of the most precious gifts in my life.`;
        }
        // In the 9th rose:
        if (idx === 8 && rel) {
          msg = `No matter how much I grow, I will always be your ${rel}.`;
        }
        return {
          ...rose,
          message: msg,
        };
      }),
    },
    finale: {
      ...base.finale,
      badgeText: `A LITTLE GIFT FROM ${sName.toUpperCase()}`,
      mainHeadingPrefix: `Happy ${occ},`,
      headingName: `My Dearest ${rName}.`,
      memorySectionTitleSuffix: `With ${rName}`,
      letter: {
        ...base.finale.letter,
        salutation: `My Dearest ${rName},`,
        greeting: `Happy ${occ}! ❤️`,
        paragraphs: base.finale.letter.paragraphs.map((p, idx) => {
          if (idx === base.finale.letter.paragraphs.length - 1 && rel) {
            return `No matter how much I grow, no matter where life takes me, I will always be your ${rel}.`;
          }
          return p;
        }),
        closingLove: `I love you, ${rName}.`,
        closingWish: `Happy ${occ}! ❤️`,
        signOff: `Forever your ${sName}.`,
      },
      finalQuote: replaceOccasion(`Your love is a gift I will carry for my entire life.`),
    },
  };
}

/**
 * Serialization helpers for URL sharing and storage.
 */
export function serializeWishConfig(config: WishConfig): string {
  try {
    const jsonStr = JSON.stringify(config);
    // Use UTF-8 safe base64
    return btoa(encodeURIComponent(jsonStr));
  } catch (err) {
    console.error('Error serializing wish config', err);
    return '';
  }
}

export function deserializeWishConfig(encoded: string): WishConfig | null {
  try {
    let clean = encoded.trim();
    // Normalize spaces back to plus signs (common in email clients and query strings)
    clean = clean.replace(/ /g, '+');
    // If it was percent-encoded by a messaging app or browser, decode that first
    if (clean.includes('%')) {
      try {
        clean = decodeURIComponent(clean);
      } catch {
        // Continue with clean as is
      }
    }
    const jsonStr = decodeURIComponent(atob(clean));
    const parsed = JSON.parse(jsonStr);
    // Merge safely with DEFAULT_WISH_CONFIG to handle partial data
    return {
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
        letter: {
          ...DEFAULT_WISH_CONFIG.finale.letter,
          ...(parsed.finale?.letter || {}),
          paragraphs: Array.isArray(parsed.finale?.letter?.paragraphs)
            ? parsed.finale.letter.paragraphs
            : DEFAULT_WISH_CONFIG.finale.letter.paragraphs,
        },
      },
    };
  } catch (err) {
    console.error('Error deserializing wish config', err);
    return null;
  }
}
