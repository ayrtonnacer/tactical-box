import { useState, useEffect, useCallback } from 'react';

export interface LeaderboardEntry {
  name: string;
  round: number;
  timestamp: number;
}

const LEADERBOARD_KEY = 'shadowbox-leaderboard';
const MAX_ENTRIES = 10;

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Check if a score qualifies for the leaderboard
  const isHighScore = useCallback((round: number): boolean => {
    if (leaderboard.length < MAX_ENTRIES) return true;
    const lowestScore = leaderboard[leaderboard.length - 1]?.round || 0;
    return round > lowestScore;
  }, [leaderboard]);

  // Get the position the score would be at (1-indexed, 0 if not qualifying)
  const getScorePosition = useCallback((round: number): number => {
    if (round === 0) return 0;
    
    for (let i = 0; i < leaderboard.length; i++) {
      if (round > leaderboard[i].round) {
        return i + 1;
      }
    }
    
    if (leaderboard.length < MAX_ENTRIES) {
      return leaderboard.length + 1;
    }
    
    return 0;
  }, [leaderboard]);

  // Add a new entry to the leaderboard
  const addEntry = useCallback((name: string, round: number) => {
    const newEntry: LeaderboardEntry = {
      name: name.trim().toUpperCase().slice(0, 3) || 'AAA',
      round,
      timestamp: Date.now(),
    };

    setLeaderboard(current => {
      const updated = [...current, newEntry]
        .sort((a, b) => b.round - a.round)
        .slice(0, MAX_ENTRIES);
      
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    leaderboard,
    isHighScore,
    getScorePosition,
    addEntry,
  };
}
