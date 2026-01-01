import { useCallback, useEffect, useRef, useState } from 'react';

// 8-bit style melody notes (frequencies in Hz)
const MELODY = [
  { note: 523.25, duration: 0.15 }, { note: 587.33, duration: 0.15 },
  { note: 659.25, duration: 0.15 }, { note: 783.99, duration: 0.3 },
  { note: 659.25, duration: 0.15 }, { note: 523.25, duration: 0.15 },
  { note: 392.00, duration: 0.3 },  { note: 0, duration: 0.15 },
  { note: 440.00, duration: 0.15 }, { note: 523.25, duration: 0.15 },
  { note: 587.33, duration: 0.15 }, { note: 659.25, duration: 0.3 },
  { note: 587.33, duration: 0.15 }, { note: 523.25, duration: 0.15 },
  { note: 440.00, duration: 0.3 },  { note: 0, duration: 0.15 },
  { note: 783.99, duration: 0.15 }, { note: 698.46, duration: 0.15 },
  { note: 659.25, duration: 0.15 }, { note: 587.33, duration: 0.15 },
  { note: 523.25, duration: 0.3 },  { note: 392.00, duration: 0.15 },
  { note: 440.00, duration: 0.15 }, { note: 523.25, duration: 0.3 },
  { note: 0, duration: 0.15 },      { note: 659.25, duration: 0.15 },
  { note: 783.99, duration: 0.15 }, { note: 880.00, duration: 0.3 },
  { note: 783.99, duration: 0.15 }, { note: 659.25, duration: 0.15 },
  { note: 523.25, duration: 0.3 },  { note: 587.33, duration: 0.15 },
  { note: 659.25, duration: 0.3 },
];

const BASS = [
  { note: 130.81, duration: 0.3 }, { note: 130.81, duration: 0.3 },
  { note: 146.83, duration: 0.3 }, { note: 146.83, duration: 0.3 },
  { note: 164.81, duration: 0.3 }, { note: 164.81, duration: 0.3 },
  { note: 130.81, duration: 0.3 }, { note: 196.00, duration: 0.3 },
];

export function useBackgroundMusic() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const melodyIndexRef = useRef(0);
  const bassIndexRef = useRef(0);
  const melodyTimeoutRef = useRef<number>(0);
  const bassTimeoutRef = useRef<number>(0);
  const isPlayingRef = useRef(false);
  const hasUserInteractedRef = useRef(false);

  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('musicEnabled', String(isMusicEnabled));
  }, [isMusicEnabled]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playNote = useCallback((frequency: number, duration: number, type: OscillatorType, volume: number) => {
    if (frequency === 0) return;
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration * 0.9);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  const scheduleMelody = useCallback(() => {
    if (!isPlayingRef.current) return;
    const note = MELODY[melodyIndexRef.current];
    playNote(note.note, note.duration, 'square', 0.08);
    melodyIndexRef.current = (melodyIndexRef.current + 1) % MELODY.length;
    melodyTimeoutRef.current = window.setTimeout(scheduleMelody, note.duration * 1000);
  }, [playNote]);

  const scheduleBass = useCallback(() => {
    if (!isPlayingRef.current) return;
    const note = BASS[bassIndexRef.current];
    playNote(note.note, note.duration, 'triangle', 0.06);
    bassIndexRef.current = (bassIndexRef.current + 1) % BASS.length;
    bassTimeoutRef.current = window.setTimeout(scheduleBass, note.duration * 1000);
  }, [playNote]);

  const stopMusic = useCallback(() => {
    isPlayingRef.current = false;
    if (melodyTimeoutRef.current) clearTimeout(melodyTimeoutRef.current);
    if (bassTimeoutRef.current) clearTimeout(bassTimeoutRef.current);
  }, []);

  const startMusicPlayback = useCallback(() => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    melodyIndexRef.current = 0;
    bassIndexRef.current = 0;
    scheduleMelody();
    scheduleBass();
  }, [scheduleMelody, scheduleBass]);

  const startMusic = useCallback(() => {
    hasUserInteractedRef.current = true;
    if (isMusicEnabled) {
      startMusicPlayback();
    }
  }, [isMusicEnabled, startMusicPlayback]);

  const toggleMusic = useCallback(() => {
    hasUserInteractedRef.current = true;
    if (isMusicEnabled) {
      stopMusic();
      setIsMusicEnabled(false);
    } else {
      setIsMusicEnabled(true);
      startMusicPlayback();
    }
  }, [isMusicEnabled, stopMusic, startMusicPlayback]);

  useEffect(() => {
    return () => {
      stopMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopMusic]);

  return { isMusicEnabled, toggleMusic, startMusic };
}
