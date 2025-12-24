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
  
  const playableArea = {
    left: HUD_MARGINS.left,
    top: HUD_MARGINS.top,
    right: canvasWidth - HUD_MARGINS.right,
    bottom: canvasHeight - HUD_MARGINS.bottom,
  };
  
  const availableWidth = playableArea.right - playableArea.left - CIRCLE_RADIUS * 2;
  const availableHeight = playableArea.bottom - playableArea.top - CIRCLE_RADIUS * 2;
  
  const cols = Math.floor(availableWidth / CIRCLE_SPACING);
  const rows = Math.floor(availableHeight / CIRCLE_SPACING);
  
  const positions: { x: number; y: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({
        x: playableArea.left + CIRCLE_RADIUS + col * CIRCLE_SPACING + CIRCLE_SPACING / 2,
        y: playableArea.top + CIRCLE_RADIUS + row * CIRCLE_SPACING + CIRCLE_SPACING / 2,
      });
    }
  }
  
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  
  const totalCircles = yellowCount + whiteCount;
  const usedPositions = positions.slice(0, Math.min(totalCircles * 3, positions.length));
  
  if (usedPositions.length === 0) return circles;
  
  const clusterCenterIdx = Math.floor(Math.random() * usedPositions.length);
  const clusterCenter = usedPositions[clusterCenterIdx];
  
  const sortedByDistance = [...usedPositions].sort((a, b) => {
    const distA = Math.sqrt((a.x - clusterCenter.x) ** 2 + (a.y - clusterCenter.y) ** 2);
    const distB = Math.sqrt((b.x - clusterCenter.x) ** 2 + (b.y - clusterCenter.y) ** 2);
    return distA - distB;
  });
  
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
  const roundRef = useRef(1);
  const gameStateRef = useRef<GameState>('menu');
  const endGameRef = useRef<() => void>(() => {});
  const sounds = useSoundEffects();

  // Keep refs in sync
  useEffect(() => {
    roundRef.current = round;
  }, [round]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const clearRespawnTimer = useCallback(() => {
    if (respawnTimerRef.current) {
      clearTimeout(respawnTimerRef.current);
      respawnTimerRef.current = null;
    }
  }, []);

  const spawnNewCircles = useCallback(() => {
    const config = getConfigForRound(roundRef.current);
    const newCircles = generateCircles(
      config.yellowCount, 
      config.whiteCount, 
      canvasSize.current.width, 
      canvasSize.current.height
    );
    setCircles(newCircles);
  }, []);

  const startRespawnTimer = useCallback(() => {
    clearRespawnTimer();
    
    if (gameStateRef.current !== 'playing') return;
    
    respawnTimerRef.current = window.setTimeout(() => {
      if (gameStateRef.current === 'playing') {
        spawnNewCircles();
        startRespawnTimer();
      }
    }, RESPAWN_DELAY);
  }, [clearRespawnTimer, spawnNewCircles]);

  const endGame = useCallback(() => {
    clearRespawnTimer();
    setGameState('gameover');
    gameStateRef.current = 'gameover';
    sounds.playGameOver();
    
    if (roundRef.current > bestRound) {
      setBestRound(roundRef.current);
      localStorage.setItem('shadowbox-best-round', roundRef.current.toString());
    }
  }, [bestRound, sounds, clearRespawnTimer]);

  // Keep endGame ref updated (avoid extra hook to prevent hook-order issues)
  endGameRef.current = endGame;


  const nextRound = useCallback(() => {
    const newRound = roundRef.current + 1;
    setRound(newRound);
    roundRef.current = newRound;
    spawnNewCircles();
    startRespawnTimer();
    sounds.playRoundComplete();
  }, [sounds, spawnNewCircles, startRespawnTimer]);

  const startGame = useCallback(() => {
    setHearts(3);
    setTimer(GAME_DURATION);
    setRound(1);
    roundRef.current = 1;
    setGameState('playing');
    gameStateRef.current = 'playing';
    spawnNewCircles();
    startRespawnTimer();
    sounds.playClick();
  }, [sounds, spawnNewCircles, startRespawnTimer]);

  const handleSelectionComplete = useCallback((box: SelectionBox) => {
    if (gameStateRef.current !== 'playing') return;
    
    let capturedGood = 0;
    let capturedBad = 0;

    setCircles(currentCircles => {
      const updatedCircles = currentCircles.map(circle => {
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

      // Schedule removal of captured circles
      if (capturedGood > 0 || capturedBad > 0) {
        window.setTimeout(() => {
          setCircles(curr => curr.filter(c => !c.captured));
        }, 350);
      }

      // Handle bad circle capture
      if (capturedBad > 0) {
        setShakeScreen(true);
        setTimeout(() => setShakeScreen(false), 300);
        sounds.playError();

        setHearts(h => {
          const newHearts = h - 1;
          if (newHearts <= 0) {
            endGame();
          }
          return newHearts;
        });
      }
      
      // Check round completion
      if (capturedGood > 0) {
        if (capturedBad === 0) {
          sounds.playSuccess();
        }
        
        const remainingGood = updatedCircles.filter(c => c.type === 'good' && !c.captured).length;
        if (remainingGood === 0) {
          clearRespawnTimer();
          setTimeout(() => {
            nextRound();
          }, 500);
        } else {
          // Reset respawn timer since player made progress
          startRespawnTimer();
        }
      }

      return updatedCircles;
    });
  }, [sounds, endGame, nextRound, clearRespawnTimer, startRespawnTimer]);

  const updateCanvasSize = useCallback((width: number, height: number) => {
    canvasSize.current = { width, height };
  }, []);

  // Global timer effect - completely independent, uses refs to avoid recreating
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Only create interval if not already running
    if (timerRef.current) return;

    timerRef.current = window.setInterval(() => {
      if (gameStateRef.current !== 'playing') {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return;
      }
      
      setTimer(prev => {
        const newTimer = prev - 1;
        if (newTimer <= 0) {
          endGameRef.current();
          return 0;
        }
        return newTimer;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState]);

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
