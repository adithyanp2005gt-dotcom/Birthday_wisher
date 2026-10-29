/**
 * audioService.ts
 * Classic, heartwarming traditional "Happy Birthday" tune.
 * Synthesises a sweet, clean music-box / acoustic chime melody with gentle
 * 3/4 waltz harmony, pure and recognizable.
 *
 * Loops continuously until stopped.
 */

// Note frequency lookup table (Hz)
const NOTE: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50,
};

// Standard 3/4 tempo (96 BPM)
const BPM = 96;
const BEAT = 60 / BPM; // ~0.625s per beat

// Classic Happy Birthday melody in C major: [Note, duration in beats]
const CLASSIC_MELODY: [string, number][] = [
  // "Happy Birthday to you"
  ['G4', 0.75], ['G4', 0.25], ['A4', 1.0], ['G4', 1.0], ['C5', 1.0], ['B4', 2.0],
  // "Happy Birthday to you"
  ['G4', 0.75], ['G4', 0.25], ['A4', 1.0], ['G4', 1.0], ['D5', 1.0], ['C5', 2.0],
  // "Happy Birthday dear Ammachi / loved one"
  ['G4', 0.75], ['G4', 0.25], ['G5', 1.0], ['E5', 1.0], ['C5', 1.0], ['B4', 1.0], ['A4', 2.0],
  // "Happy Birthday to you"
  ['F5', 0.75], ['F5', 0.25], ['E5', 1.0], ['C5', 1.0], ['D5', 1.0], ['C5', 3.0],
];

// Gentle waltz chord accompaniment notes: [Note, startBeat, durationBeats]
const GENTLE_CHORDS: [string, number, number][] = [
  // Measure 1-2 (G / C)
  ['C3', 1.0, 2.0], ['E4', 2.0, 1.0], ['G4', 2.0, 1.0],
  ['G3', 3.0, 2.0], ['D4', 4.0, 1.0], ['G4', 4.0, 1.0],
  // Measure 3-4 (G / C)
  ['G3', 7.0, 2.0], ['D4', 8.0, 1.0], ['G4', 8.0, 1.0],
  ['C3', 9.0, 2.0], ['E4', 10.0, 1.0], ['G4', 10.0, 1.0],
  // Measure 5-6 (C / F)
  ['C3', 13.0, 2.0], ['E4', 14.0, 1.0], ['G4', 14.0, 1.0],
  ['F3', 17.0, 2.0], ['A4', 18.0, 1.0], ['C5', 18.0, 1.0],
  // Measure 7-8 (C - G - C)
  ['C3', 19.0, 2.0], ['E4', 20.0, 1.0], ['G4', 20.0, 1.0],
  ['G3', 21.0, 1.0], ['B3', 22.0, 1.0],
  ['C3', 23.0, 3.0], ['G4', 23.0, 3.0], ['C5', 23.0, 3.0],
];

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let stopTimer: ReturnType<typeof setTimeout> | null = null;
let activeOscillators: OscillatorNode[] = [];
let isPlaying = false;

/**
 * Plays a clean, warm music-box / celesta chime note
 */
function playChimeNote(
  ctx: AudioContext,
  dest: AudioNode,
  frequency: number,
  startTime: number,
  duration: number,
  volume = 0.35
): void {
  if (frequency <= 0) return;

  // Primary tone (warm sine)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(frequency, startTime);

  // Soft musical attack & exponential natural decay
  gain1.gain.setValueAtTime(0.0001, startTime);
  gain1.gain.linearRampToValueAtTime(volume, startTime + 0.008);
  gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc1.connect(gain1);
  gain1.connect(dest);

  osc1.start(startTime);
  osc1.stop(startTime + duration + 0.05);
  activeOscillators.push(osc1);

  // Delicate overtone (music box sparkle)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(frequency * 2, startTime);

  gain2.gain.setValueAtTime(0.0001, startTime);
  gain2.gain.linearRampToValueAtTime(volume * 0.22, startTime + 0.006);
  gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.min(duration, 0.45));

  osc2.connect(gain2);
  gain2.connect(dest);

  osc2.start(startTime);
  osc2.stop(startTime + Math.min(duration, 0.5));
  activeOscillators.push(osc2);
}

/**
 * Schedules one complete iteration of the melody + chords,
 * and sets up the next loop repeat.
 */
function scheduleLoop(startTime: number): void {
  if (!isPlaying || !audioCtx || !masterGain || audioCtx.state === 'closed') {
    return;
  }

  const ctx = audioCtx;
  let cursor = startTime;
  let totalBeats = 0;

  // 1. Play main classic melody
  CLASSIC_MELODY.forEach(([noteName, beats]) => {
    const freq = NOTE[noteName] || 0;
    const durSec = beats * BEAT;
    playChimeNote(ctx, masterGain!, freq, cursor, durSec * 1.2, 0.38);
    cursor += durSec;
    totalBeats += beats;
  });

  // 2. Play gentle accompaniment chords
  GENTLE_CHORDS.forEach(([noteName, startBeat, durBeats]) => {
    const freq = NOTE[noteName] || 0;
    const chordTime = startTime + startBeat * BEAT;
    const chordDur = durBeats * BEAT;
    playChimeNote(ctx, masterGain!, freq, chordTime, chordDur * 1.1, 0.16);
  });

  // 3. Repeat: natural 1.5 beat breath pause between loops
  const pauseBeats = 1.5;
  const cycleSeconds = (totalBeats + pauseBeats) * BEAT;
  const nextLoopTime = startTime + cycleSeconds;

  // Schedule next iteration slightly before it occurs
  const waitMs = Math.max(100, (cycleSeconds - 1.0) * 1000);
  stopTimer = setTimeout(() => {
    if (isPlaying) {
      scheduleLoop(nextLoopTime);
    }
  }, waitMs);
}

/**
 * Starts the normal Happy Birthday tune with repeating loop
 */
export function playHappyBirthday(): void {
  stopHappyBirthday();

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  } catch {
    console.warn('Web Audio API not supported in this browser.');
    return;
  }

  isPlaying = true;
  const ctx = audioCtx;

  // Master gain with soft warm acoustics
  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.75, ctx.currentTime);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(5500, ctx.currentTime);
  filter.Q.setValueAtTime(0.7, ctx.currentTime);

  masterGain.connect(filter);
  filter.connect(ctx.destination);

  const initialStartTime = ctx.currentTime + 0.15;
  scheduleLoop(initialStartTime);
}

/**
 * Stops playback immediately and cancels repeating loops
 */
export function stopHappyBirthday(): void {
  isPlaying = false;

  if (stopTimer !== null) {
    clearTimeout(stopTimer);
    stopTimer = null;
  }

  cleanup();
}

function cleanup(): void {
  activeOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // already stopped/disconnected
    }
  });
  activeOscillators = [];

  if (audioCtx) {
    try {
      audioCtx.close();
    } catch {
      // ignored
    }
    audioCtx = null;
  }
  masterGain = null;
}
