import { useCallback, useEffect, useRef, useState } from 'react';

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const hasUserInteracted = useRef(false);

  // Initialize audio element
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

  // Save preference to localStorage
  useEffect(() => {
    localStorage.setItem('musicEnabled', String(isMusicEnabled));
  }, [isMusicEnabled]);

  // Handle play/pause based on enabled state
  useEffect(() => {
    if (!audioRef.current || !hasUserInteracted.current) return;

    if (isMusicEnabled && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log('Audio play failed:', e));
    } else if (!isMusicEnabled && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isMusicEnabled, isPlaying]);

  const startMusic = useCallback(() => {
    hasUserInteracted.current = true;
    
    if (audioRef.current && isMusicEnabled) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log('Audio play failed:', e));
    }
  }, [isMusicEnabled]);

  const toggleMusic = useCallback(() => {
    hasUserInteracted.current = true;
    
    setIsMusicEnabled(prev => {
      const newValue = !prev;
      
      if (audioRef.current) {
        if (newValue) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch((e) => console.log('Audio play failed:', e));
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
      
      return newValue;
    });
  }, []);

  return {
    isMusicEnabled,
    toggleMusic,
    startMusic,
  };
}
