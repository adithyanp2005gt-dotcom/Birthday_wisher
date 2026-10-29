export interface MemoryItem {
  id: string;
  title: string;
  subtitle: string;
  caption: string;
  imageSrc?: string;
  themeColor?: string;
  rotation: number;
}

export const MAX_MEMORIES = 25;

export const DEFAULT_MEMORY_THEMES = [
  {
    title: 'Warmest Embrace',
    subtitle: 'Childhood Days',
    caption: 'In your arms was always the safest, warmest place in the whole world.',
    rotation: -2.5,
  },
  {
    title: 'A Guiding Hand',
    subtitle: 'Every Step Forward',
    caption: 'Teaching me kindness, patience, and courage through every little moment.',
    rotation: 1.8,
  },
  {
    title: 'Laughter & Joy',
    subtitle: 'Unforgettable Smiles',
    caption: 'Your bright, genuine smile is my favorite memory and greatest inspiration.',
    rotation: -1.5,
  },
  {
    title: 'Celebrations of Love',
    subtitle: 'Milestones Together',
    caption: 'No achievement in my life feels complete without seeing you proud.',
    rotation: 2.2,
  },
  {
    title: 'Silent Sacrifices',
    subtitle: 'Selfless Devotion',
    caption: 'All the things you gave up quietly just to make sure I had everything I needed.',
    rotation: -2.0,
  },
  {
    title: 'Comfort in Your Voice',
    subtitle: 'Gentle Reassurance',
    caption: 'A single word from you has the power to wash away my heaviest worries.',
    rotation: 1.4,
  },
  {
    title: 'Festive Blessings',
    subtitle: 'Traditions with You',
    caption: 'Every celebration and festival is radiant and joyful because of your presence.',
    rotation: -2.2,
  },
  {
    title: 'Quiet Evenings',
    subtitle: 'Peaceful Conversations',
    caption: 'Sitting beside you and talking about life remains my most cherished peace.',
    rotation: 1.6,
  },
  {
    title: 'Patience & Grace',
    subtitle: 'A Living Example',
    caption: 'You taught me how to handle life with humility, strength, and boundless love.',
    rotation: -1.8,
  },
  {
    title: 'The Warmth of Home',
    subtitle: 'Care in Every Detail',
    caption: 'Everything made by your hands carries a taste of pure love and comfort.',
    rotation: 2.0,
  },
  {
    title: 'Strength in Tears',
    subtitle: 'Unshakable Courage',
    caption: 'You showed me how to stay brave and resilient even through stormy weather.',
    rotation: -1.2,
  },
  {
    title: 'A Mother’s Prayer',
    subtitle: 'Guiding Light',
    caption: 'Your silent prayers have protected me in paths I didn’t even know were perilous.',
    rotation: 2.5,
  },
  {
    title: 'Unspoken Care',
    subtitle: 'Eyes That Understand',
    caption: 'You know what I feel before I even say a single word out loud.',
    rotation: -2.1,
  },
  {
    title: 'Proudest Moments',
    subtitle: 'Cheering Me On',
    caption: 'Seeing the sparkle in your eyes when I succeed is my life’s greatest reward.',
    rotation: 1.7,
  },
  {
    title: 'Through Thick & Thin',
    subtitle: 'Always by My Side',
    caption: 'No matter how turbulent the world gets, your belief in me never wavers.',
    rotation: -1.6,
  },
  {
    title: 'Little Secrets',
    subtitle: 'Shared Laughter',
    caption: 'The inside jokes and smiles that only you and I truly understand.',
    rotation: 2.3,
  },
  {
    title: 'Endless Wisdom',
    subtitle: 'Lessons of the Heart',
    caption: 'Your advice has been the compass guiding every important step in my journey.',
    rotation: -1.9,
  },
  {
    title: 'Days of Sunshine',
    subtitle: 'Cherished Outings',
    caption: 'Memories of walks, travels, and simple days filled with your laughter.',
    rotation: 1.5,
  },
  {
    title: 'Sweet Comfort',
    subtitle: 'Healing Touch',
    caption: 'Whenever I was unwell or down, your touch had the magic to make things right.',
    rotation: -2.4,
  },
  {
    title: 'Home Is With You',
    subtitle: 'My Sanctuary',
    caption: 'Home is never a physical place—it is wherever your presence is felt.',
    rotation: 1.9,
  },
  {
    title: 'A Heart of Pure Gold',
    subtitle: 'Kindness to All',
    caption: 'Your generous heart inspires me every day to be a better human being.',
    rotation: -1.4,
  },
  {
    title: 'Growing Together',
    subtitle: 'A Lifetime of Love',
    caption: 'From my first steps to who I am today, your love has sculpted my soul.',
    rotation: 2.1,
  },
  {
    title: 'Cherished Laughter',
    subtitle: 'Pure Happiness',
    caption: 'May you always have reasons to throw your head back and laugh with joy.',
    rotation: -1.7,
  },
  {
    title: 'Forever Your Mone',
    subtitle: 'An Eternal Bond',
    caption: 'Years may fly by and seasons may change, but I will always remain your little boy.',
    rotation: 2.4,
  },
  {
    title: 'Unconditional Blessing',
    subtitle: 'Eternally Cherished',
    caption: 'Having you as my Ammachi mon is the greatest blessing I will ever know.',
    rotation: -2.3,
  },
];

export const createMemoryItem = (index: number, imageSrc?: string): MemoryItem => {
  const theme = DEFAULT_MEMORY_THEMES[index % DEFAULT_MEMORY_THEMES.length];
  return {
    id: `memory-${index + 1}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: theme.title,
    subtitle: theme.subtitle,
    caption: theme.caption,
    imageSrc: imageSrc || `/memories/memory-${index + 1}.jpg`,
    rotation: theme.rotation,
  };
};

export const INITIAL_MEMORIES: MemoryItem[] = Array.from({ length: 6 }).map((_, i) =>
  createMemoryItem(i)
);
