import { useState, useCallback, useEffect, useRef } from 'react';
import { Circle, SelectionBox, GameConfig, GameState, getConfigForRound } from '@/types/game';
import { useSoundEffects } from './useSoundEffects';

const CIRCLE_RADIUS = 20;
const CIRCLE_SPACING = 50;

// Define safe margins to avoid HUD elements
const HUD_MARGINS = {
  top: 100,
  left: 140,
  right: 100,
  bottom: 50,
};

function generateCircles(config: GameConfig, canvasWidth: number, canvasHeight: number): Circle[] {
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
  const totalCircles = config.yellowCount + config.whiteCount;
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
  for (let i = 0; i < config.yellowCount && i < sortedByDistance.length; i++) {
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
  const remainingPositions = sortedByDistance.slice(config.yellowCount);
  for (let i = 0; i < config.whiteCount && i < remainingPositions.length; i++) {
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
  const [health, setHealth] = useState(5);
  const [maxHealth, setMaxHealth] = useState(5);
  const [hearts, setHearts] = useState(3);
  const [timer, setTimer] = useState(45);
  const [round, setRound] = useState(1);
  const [bestRound, setBestRound] = useState(() => {
    const saved = localStorage.getItem('shadowbox-best-round');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [shakeScreen, setShakeScreen] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const canvasSize = useRef({ width: 800, height: 600 });
  const sounds = useSoundEffects();

  const startGame = useCallback(() => {
    const config = getConfigForRound(1);
    
    setHealth(config.maxHealth);
    setMaxHealth(config.maxHealth);
    setHearts(3);
    setTimer(config.timerDuration);
    setRound(1);
    
    const newCircles = generateCircles(config, canvasSize.current.width, canvasSize.current.height);
    setCircles(newCircles);
    setGameState('playing');
    sounds.playClick();
  }, [sounds]);

  const nextRound = useCallback(() => {
    const newRound = round + 1;
    const config = getConfigForRound(newRound);
    
    setRound(newRound);
    setHealth(config.maxHealth);
    setMaxHealth(config.maxHealth);
    setTimer(config.timerDuration);
    
    const newCircles = generateCircles(config, canvasSize.current.width, canvasSize.current.height);
    setCircles(newCircles);
    sounds.playRoundComplete();
  }, [round, sounds]);

  const endGame = useCallback(() => {
    setGameState('gameover');
    sounds.playGameOver();
    
    // Save best round
    if (round > bestRound) {
      setBestRound(round);
      localStorage.setItem('shadowbox-best-round', round.toString());
    }
  }, [round, bestRound, sounds]);

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
    
    setCircles(updatedCircles);
    
    if (capturedBad > 0) {
      // Hit bad circles - lose a heart
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
      return;
    } else if (capturedGood > 0) {
      sounds.playSuccess();
    }
    
    // Check if all good circles captured
    const remainingGood = updatedCircles.filter(c => c.type === 'good' && !c.captured).length;
    if (remainingGood === 0) {
      // Next round after delay
      setTimeout(() => {
        nextRound();
      }, 500);
    }
  }, [circles, health, gameState, nextRound, endGame, sounds]);

  const updateCanvasSize = useCallback((width: number, height: number) => {
    canvasSize.current = { width, height };
  }, []);

  // Timer effect
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
          setHearts(h => {
            if (h <= 1) {
              endGame();
              return 0;
            }
            const config = getConfigForRound(round);
            setTimer(config.timerDuration);
            sounds.playError();
            return h - 1;
          });
          return getConfigForRound(round).timerDuration;
        }
        
        return newTimer;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, round, endGame, sounds]);

  return {
    gameState,
    setGameState,
    circles,
    health,
    maxHealth,
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
