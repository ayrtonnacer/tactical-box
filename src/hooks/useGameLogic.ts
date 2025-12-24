import { useState, useCallback, useEffect, useRef } from 'react';
import { Circle, SelectionBox, GameState } from '@/types/game';
import { useSoundEffects } from './useSoundEffects';

const CIRCLE_RADIUS = 20;
const CIRCLE_SPACING = 50;
const GAME_DURATION = 60; // 60 seconds total
const RESPAWN_DELAY = 3000; // 3 seconds to respawn circles

// Define safe margins to avoid HUD elements
const HUD_MARGINS = {
  top: 100,
  left: 140,
  right: 100,
  bottom: 50,
};

// Get config based on round
function getConfigForRound(round: number): { yellowCount: number; whiteCount: number } {
  const yellowCount = Math.min(2 + round, 15);
  const whiteCount = Math.min(1 + Math.floor(round * 0.8), 12);
  return { yellowCount, whiteCount };
}

function generateCircles(yellowCount: number, whiteCount: number, canvasWidth: number, canvasHeight: number): Circle[] {
  const circles: Circle[] = [];
  
  // Calculate playable area (excluding HUD zones)
  const playableArea = {
    left: HUD_MARGINS.left,
    top: HUD_MARGINS.top,
    right: canvasWidth - HUD_MARGINS.right,
    bottom: canvasHeight - HUD_MARGINS.bottom,
  };
  
  const availableWidth = playableArea.right - playableArea.left - CIRCLE_RADIUS * 2;
  const availableHeight = playableArea.bottom - playableArea.top - CIRCLE_RADIUS * 2;
  
  // Calculate grid dimensions within playable area
  const cols = Math.floor(availableWidth / CIRCLE_SPACING);
  const rows = Math.floor(availableHeight / CIRCLE_SPACING);
  
  // Create all possible positions within playable area
  const positions: { x: number; y: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({
        x: playableArea.left + CIRCLE_RADIUS + col * CIRCLE_SPACING + CIRCLE_SPACING / 2,
        y: playableArea.top + CIRCLE_RADIUS + row * CIRCLE_SPACING + CIRCLE_SPACING / 2,
      });
    }
  }
  
  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  
  // Pick a cluster center for yellow circles
  const totalCircles = yellowCount + whiteCount;
  const usedPositions = positions.slice(0, Math.min(totalCircles * 3, positions.length));
  
  if (usedPositions.length === 0) return circles;
  
  // Pick center for yellow cluster
  const clusterCenterIdx = Math.floor(Math.random() * usedPositions.length);
  const clusterCenter = usedPositions[clusterCenterIdx];
  
  // Sort positions by distance to cluster center
  const sortedByDistance = [...usedPositions].sort((a, b) => {
    const distA = Math.sqrt((a.x - clusterCenter.x) ** 2 + (a.y - clusterCenter.y) ** 2);
    const distB = Math.sqrt((b.x - clusterCenter.x) ** 2 + (b.y - clusterCenter.y) ** 2);
    return distA - distB;
  });
  
  // Place yellow circles in cluster
  for (let i = 0; i < yellowCount && i < sortedByDistance.length; i++) {
    circles.push({
      id: `good-${i}`,
      x: sortedByDistance[i].x,
      y: sortedByDistance[i].y,
      radius: CIRCLE_RADIUS,
      type: 'good',
      captured: false,
    });
  }
  
  // Place white circles around (not in cluster)
  const remainingPositions = sortedByDistance.slice(yellowCount);
  for (let i = 0; i < whiteCount && i < remainingPositions.length; i++) {
    circles.push({
      id: `bad-${i}`,
      x: remainingPositions[i].x,
      y: remainingPositions[i].y,
      radius: CIRCLE_RADIUS,
      type: 'bad',
      captured: false,
    });
  }
  
  return circles;
}

function isCircleInBox(circle: Circle, box: SelectionBox): boolean {
  const { x, y, radius } = circle;
  const minX = Math.min(box.x1, box.x2);
  const maxX = Math.max(box.x1, box.x2);
  const minY = Math.min(box.y1, box.y2);
  const maxY = Math.max(box.y1, box.y2);
  
  // Check if circle center is within box (with small tolerance)
  const tolerance = radius * 0.3;
  return (
    x - tolerance >= minX &&
    x + tolerance <= maxX &&
    y - tolerance >= minY &&
    y + tolerance <= maxY
  );
}

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [circles, setCircles] = useState<Circle[]>([]);
  const [hearts, setHearts] = useState(3);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [round, setRound] = useState(1);
  const [bestRound, setBestRound] = useState(() => {
    const saved = localStorage.getItem('shadowbox-best-round');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [shakeScreen, setShakeScreen] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const respawnTimerRef = useRef<number | null>(null);
  const canvasSize = useRef({ width: 800, height: 600 });
  const sounds = useSoundEffects();

  // Clear respawn timer
  const clearRespawnTimer = useCallback(() => {
    if (respawnTimerRef.current) {
      clearTimeout(respawnTimerRef.current);
      respawnTimerRef.current = null;
    }
  }, []);

  // Start respawn timer - if 3s pass without completing, spawn new circles
  const startRespawnTimer = useCallback((currentRound: number) => {
    clearRespawnTimer();
    
    respawnTimerRef.current = window.setTimeout(() => {
      const config = getConfigForRound(currentRound);
      const newCircles = generateCircles(
        config.yellowCount, 
        config.whiteCount, 
        canvasSize.current.width, 
        canvasSize.current.height
      );
      setCircles(newCircles);
      // Restart the timer for the new set
      startRespawnTimer(currentRound);
    }, RESPAWN_DELAY);
  }, [clearRespawnTimer]);

  const spawnCirclesForRound = useCallback((roundNum: number) => {
    const config = getConfigForRound(roundNum);
    const newCircles = generateCircles(
      config.yellowCount, 
      config.whiteCount, 
      canvasSize.current.width, 
      canvasSize.current.height
    );
    setCircles(newCircles);
    startRespawnTimer(roundNum);
  }, [startRespawnTimer]);

  const startGame = useCallback(() => {
    setHearts(3);
    setTimer(GAME_DURATION);
    setRound(1);
    setGameState('playing');
    spawnCirclesForRound(1);
    sounds.playClick();
  }, [sounds, spawnCirclesForRound]);

  const nextRound = useCallback(() => {
    const newRound = round + 1;
    setRound(newRound);
    spawnCirclesForRound(newRound);
    sounds.playRoundComplete();
  }, [round, sounds, spawnCirclesForRound]);

  const endGame = useCallback(() => {
    clearRespawnTimer();
    setGameState('gameover');
    sounds.playGameOver();
    
    // Save best round
    if (round > bestRound) {
      setBestRound(round);
      localStorage.setItem('shadowbox-best-round', round.toString());
    }
  }, [round, bestRound, sounds, clearRespawnTimer]);

  const handleSelectionComplete = useCallback((box: SelectionBox) => {
    if (gameState !== 'playing') return;
    
    let capturedGood = 0;
    let capturedBad = 0;

    const updatedCircles = circles.map(circle => {
      if (isCircleInBox(circle, box)) {
        if (circle.type === 'good') {
          capturedGood++;
          return { ...circle, captured: true };
        } else {
          capturedBad++;
          return { ...circle, captured: true };
        }
      }
      return circle;
    });

    // Apply captured state immediately for visual feedback
    setCircles(updatedCircles);
    
    if (capturedGood > 0 || capturedBad > 0) {
      window.setTimeout(() => {
        setCircles(curr => curr.filter(c => !c.captured));
      }, 350);
    }

    // Handle bad circle capture - lose a heart
    if (capturedBad > 0) {
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 300);
      sounds.playError();

      const newHearts = hearts - 1;
      setHearts(newHearts);
      
      if (newHearts <= 0) {
        endGame();
        return;
      }
    }
    
    // If we captured good circles (even with bad), check for round completion
    if (capturedGood > 0) {
      if (capturedBad === 0) {
        sounds.playSuccess();
      }
      
      // Check if all good circles captured
      const remainingGood = updatedCircles.filter(c => c.type === 'good' && !c.captured).length;
      if (remainingGood === 0) {
        clearRespawnTimer();
        // Next round after delay
        setTimeout(() => {
          nextRound();
        }, 500);
      } else {
        // Reset respawn timer since player made progress
        startRespawnTimer(round);
      }
    }
  }, [circles, gameState, hearts, round, nextRound, endGame, sounds, clearRespawnTimer, startRespawnTimer]);

  const updateCanvasSize = useCallback((width: number, height: number) => {
    canvasSize.current = { width, height };
  }, []);

  // Global timer effect - counts down from 60 to 0
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimer(prev => {
        const newTimer = prev - 1;
        
        if (newTimer <= 0) {
          endGame();
          return 0;
        }
        
        return newTimer;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, endGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRespawnTimer();
    };
  }, [clearRespawnTimer]);

  return {
    gameState,
    setGameState,
    circles,
    hearts,
    timer,
    round,
    bestRound,
    selectionBox,
    setSelectionBox,
    shakeScreen,
    startGame,
    handleSelectionComplete,
    updateCanvasSize,
  };
}
