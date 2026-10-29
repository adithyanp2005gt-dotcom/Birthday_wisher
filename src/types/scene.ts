export type SceneId = 
  | 'prologue'          // Initial whisper / anticipation
  | 'garden_gate'       // The entrance to the digital rose garden
  | 'rose_unfolding'    // Interactive blooming rose with golden light
  | 'memory_constellation' // Heartfelt letters, milestones & memories
  | 'birthday_wishes'   // The grand emotional birthday reveal
  | 'ambient_stargaze'; // Endless rose petal sanctuary

export interface SceneConfig {
  id: SceneId;
  title: string;
  subtitle?: string;
  ambientTrack?: string;
  lightingTone?: 'warm_gold' | 'deep_burgundy' | 'midnight_violet' | 'dawn_rose';
}
