import { useCallback, useEffect, useRef, useState } from 'react';

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/music/background.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('musicEnabled', String(isMusicEnabled));
    
    if (audioRef.current) {
      if (isMusicEnabled && !isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else if (!isMusicEnabled && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isMusicEnabled, isPlaying]);

  const startMusic = useCallback(() => {
    if (audioRef.current && isMusicEnabled && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isMusicEnabled, isPlaying]);

  const toggleMusic = useCallback(() => {
    setIsMusicEnabled(prev => !prev);
  }, []);

  return {
    isMusicEnabled,
    toggleMusic,
    startMusic,
  };
}
