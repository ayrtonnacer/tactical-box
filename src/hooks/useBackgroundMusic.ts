import { useCallback, useEffect, useRef, useState } from 'react';

// 8-bit style melody notes (frequencies in Hz)
const MELODY = [
  // Main theme - upbeat and energetic
  { note: 523.25, duration: 0.15 }, // C5
  { note: 587.33, duration: 0.15 }, // D5
  { note: 659.25, duration: 0.15 }, // E5
  { note: 783.99, duration: 0.3 },  // G5
  { note: 659.25, duration: 0.15 }, // E5
  { note: 523.25, duration: 0.15 }, // C5
  { note: 392.00, duration: 0.3 },  // G4
  { note: 0, duration: 0.15 },      // rest
  
  { note: 440.00, duration: 0.15 }, // A4
  { note: 523.25, duration: 0.15 }, // C5
  { note: 587.33, duration: 0.15 }, // D5
  { note: 659.25, duration: 0.3 },  // E5
  { note: 587.33, duration: 0.15 }, // D5
  { note: 523.25, duration: 0.15 }, // C5
  { note: 440.00, duration: 0.3 },  // A4
  { note: 0, duration: 0.15 },      // rest
  
  // Variation
  { note: 783.99, duration: 0.15 }, // G5
  { note: 698.46, duration: 0.15 }, // F5
  { note: 659.25, duration: 0.15 }, // E5
  { note: 587.33, duration: 0.15 }, // D5
  { note: 523.25, duration: 0.3 },  // C5
  { note: 392.00, duration: 0.15 }, // G4
  { note: 440.00, duration: 0.15 }, // A4
  { note: 523.25, duration: 0.3 },  // C5
  { note: 0, duration: 0.15 },      // rest
  
  { note: 659.25, duration: 0.15 }, // E5
  { note: 783.99, duration: 0.15 }, // G5
  { note: 880.00, duration: 0.3 },  // A5
  { note: 783.99, duration: 0.15 }, // G5
  { note: 659.25, duration: 0.15 }, // E5
  { note: 523.25, duration: 0.3 },  // C5
  { note: 587.33, duration: 0.15 }, // D5
  { note: 659.25, duration: 0.3 },  // E5
];

// Bass line for accompaniment
const BASS = [
  { note: 130.81, duration: 0.3 }, // C3
  { note: 130.81, duration: 0.3 },
  { note: 146.83, duration: 0.3 }, // D3
  { note: 146.83, duration: 0.3 },
  { note: 164.81, duration: 0.3 }, // E3
  { note: 164.81, duration: 0.3 },
  { note: 130.81, duration: 0.3 }, // C3
  { note: 196.00, duration: 0.3 }, // G3
];

export function useBackgroundMusic() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const melodyTimeoutRef = useRef<number | null>(null);
  const bassTimeoutRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  
  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const hasUserInteracted = useRef(false);

  // Save preference to localStorage
  useEffect(() => {
    localStorage.setItem('musicEnabled', String(isMusicEnabled));
  }, [isMusicEnabled]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playNote = useCallback((frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.1) => {
    if (frequency === 0) return; // Rest note
    
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration * 0.9);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  const playMelodyLoop = useCallback((index: number = 0) => {
    if (!isPlayingRef.current) return;
    
    const note = MELODY[index];
    playNote(note.note, note.duration, 'square', 0.08);
    
    const nextIndex = (index + 1) % MELODY.length;
    melodyTimeoutRef.current = window.setTimeout(() => {
      playMelodyLoop(nextIndex);
    }, note.duration * 1000);
  }, [playNote]);

  const playBassLoop = useCallback((index: number = 0) => {
    if (!isPlayingRef.current) return;
    
    const note = BASS[index];
    playNote(note.note, note.duration, 'triangle', 0.06);
    
    const nextIndex = (index + 1) % BASS.length;
    bassTimeoutRef.current = window.setTimeout(() => {
      playBassLoop(nextIndex);
    }, note.duration * 1000);
  }, [playNote]);

  const stopMusic = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    
    if (melodyTimeoutRef.current) {
      clearTimeout(melodyTimeoutRef.current);
      melodyTimeoutRef.current = null;
    }
    if (bassTimeoutRef.current) {
      clearTimeout(bassTimeoutRef.current);
      bassTimeoutRef.current = null;
    }
  }, []);

  const startMusicPlayback = useCallback(() => {
    if (isPlayingRef.current) return;
    
    isPlayingRef.current = true;
    setIsPlaying(true);
    playMelodyLoop(0);
    playBassLoop(0);
  }, [playMelodyLoop, playBassLoop]);

  const startMusic = useCallback(() => {
    hasUserInteracted.current = true;
    
    if (isMusicEnabled && !isPlayingRef.current) {
      startMusicPlayback();
    }
  }, [isMusicEnabled, startMusicPlayback]);

  const toggleMusic = useCallback(() => {
    hasUserInteracted.current = true;
    
    if (isMusicEnabled) {
      stopMusic();
      setIsMusicEnabled(false);
    } else {
      setIsMusicEnabled(true);
      startMusicPlayback();
    }
  }, [isMusicEnabled, stopMusic, startMusicPlayback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stopMusic]);

  return {
    isMusicEnabled,
    toggleMusic,
    startMusic,
  };
}
