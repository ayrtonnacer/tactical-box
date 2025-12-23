import { useCallback, useRef } from 'react';

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'square',
    volume: number = 0.3
  ) => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  const playSuccess = useCallback(() => {
    // Ascending arpeggio - happy sound
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 'square', 0.2), i * 50);
    });
  }, [getAudioContext, playTone]);

  const playError = useCallback(() => {
    // Descending buzz - error sound
    playTone(200, 0.1, 'sawtooth', 0.3);
    setTimeout(() => playTone(150, 0.15, 'sawtooth', 0.25), 80);
  }, [playTone]);

  const playRoundComplete = useCallback(() => {
    // Victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'square', 0.25), i * 100);
    });
  }, [playTone]);

  const playGameOver = useCallback(() => {
    // Sad descending notes
    const notes = [392, 349.23, 293.66, 261.63]; // G4, F4, D4, C4
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'triangle', 0.3), i * 200);
    });
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(800, 0.05, 'square', 0.15);
  }, [playTone]);

  const playDrag = useCallback(() => {
    playTone(400, 0.02, 'sine', 0.1);
  }, [playTone]);

  return {
    playSuccess,
    playError,
    playRoundComplete,
    playGameOver,
    playClick,
    playDrag,
  };
}
