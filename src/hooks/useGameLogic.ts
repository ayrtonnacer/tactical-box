import { useState, useCallback, useEffect, useRef } from 'react';
import { Circle, SelectionBox, ScorePopup, GameConfig, GameState, DIFFICULTIES } from '@/types/game';

const CIRCLE_RADIUS = 20;
const CIRCLE_SPACING = 50;

function generateCircles(config: GameConfig, canvasWidth: number, canvasHeight: number): Circle[] {
  const circles: Circle[] = [];
  const padding = CIRCLE_RADIUS * 2;
  const availableWidth = canvasWidth - padding * 2;
  const availableHeight = canvasHeight - padding * 2;
  
  // Calculate grid dimensions
  const cols = Math.floor(availableWidth / CIRCLE_SPACING);
  const rows = Math.floor(availableHeight / CIRCLE_SPACING);
  
  // Create all possible positions
  const positions: { x: number; y: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({
        x: padding + col * CIRCLE_SPACING + CIRCLE_SPACING / 2,
        y: padding + row * CIRCLE_SPACING + CIRCLE_SPACING / 2,
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
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [health, setHealth] = useState(5);
  const [maxHealth, setMaxHealth] = useState(5);
  const [hearts, setHearts] = useState(3);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [round, setRound] = useState(1);
  const [shakeScreen, setShakeScreen] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const timerAcceleration = useRef(0);
  const canvasSize = useRef({ width: 800, height: 600 });

  const config = DIFFICULTIES[difficultyIndex].config;

  const startGame = useCallback((difficulty: number) => {
    setDifficultyIndex(difficulty);
    const cfg = DIFFICULTIES[difficulty].config;
    
    setHealth(cfg.maxHealth);
    setMaxHealth(cfg.maxHealth);
    setHearts(3);
    setTimer(cfg.timerDuration);
    setScore(0);
    setCombo(0);
    setRound(1);
    timerAcceleration.current = 0;
    
    const newCircles = generateCircles(cfg, canvasSize.current.width, canvasSize.current.height);
    setCircles(newCircles);
    setGameState('playing');
  }, []);

  const nextRound = useCallback(() => {
    const cfg = DIFFICULTIES[difficultyIndex].config;
    const newCircles = generateCircles(cfg, canvasSize.current.width, canvasSize.current.height);
    setCircles(newCircles);
    setRound(r => r + 1);
  }, [difficultyIndex]);

  const handleSelectionComplete = useCallback((box: SelectionBox) => {
    if (gameState !== 'playing') return;
    
    const cfg = DIFFICULTIES[difficultyIndex].config;
    let capturedGood = 0;
    let capturedBad = 0;
    const newPopups: ScorePopup[] = [];
    
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
    
    // Calculate center of selection for popup
    const centerX = (box.x1 + box.x2) / 2;
    const centerY = (box.y1 + box.y2) / 2;
    
    if (capturedBad > 0) {
      // Hit bad circles - lose health
      const damage = capturedBad;
      setHealth(h => Math.max(0, h - damage));
      setCombo(0);
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 300);
      
      newPopups.push({
        id: `popup-${Date.now()}`,
        x: centerX,
        y: centerY,
        value: -damage,
        type: 'error',
      });
    }
    
    if (capturedGood > 0 && capturedBad === 0) {
      // Perfect selection
      const comboMultiplier = 1 + combo * 0.1;
      const points = Math.floor(100 * capturedGood * comboMultiplier);
      setScore(s => s + points);
      setCombo(c => c + 1);
      
      newPopups.push({
        id: `popup-${Date.now()}`,
        x: centerX,
        y: centerY,
        value: points,
        type: 'success',
      });
    }
    
    setScorePopups(prev => [...prev, ...newPopups]);
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => !newPopups.find(np => np.id === p.id)));
    }, 800);
    
    // Increase timer acceleration
    timerAcceleration.current += cfg.timerAcceleration;
    
    // Check if all good circles captured
    const remainingGood = updatedCircles.filter(c => c.type === 'good' && !c.captured).length;
    if (remainingGood === 0) {
      // Victory bonus
      const bonus = Math.floor(timer * 10);
      setScore(s => s + bonus);
      
      // Next round after delay
      setTimeout(() => {
        nextRound();
      }, 500);
    }
  }, [circles, combo, difficultyIndex, gameState, nextRound, timer]);

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
        const decrease = 1 + timerAcceleration.current;
        const newTimer = prev - decrease;
        
        if (newTimer <= 0) {
          setHearts(h => {
            if (h <= 1) {
              setGameState('gameover');
              return 0;
            }
            setTimer(DIFFICULTIES[difficultyIndex].config.timerDuration);
            return h - 1;
          });
          return DIFFICULTIES[difficultyIndex].config.timerDuration;
        }
        
        return Math.max(0, newTimer);
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, difficultyIndex]);

  // Health check
  useEffect(() => {
    if (health <= 0 && gameState === 'playing') {
      setGameState('gameover');
    }
  }, [health, gameState]);

  return {
    gameState,
    setGameState,
    difficultyIndex,
    circles,
    health,
    maxHealth,
    hearts,
    timer,
    score,
    combo,
    round,
    selectionBox,
    setSelectionBox,
    scorePopups,
    shakeScreen,
    startGame,
    handleSelectionComplete,
    updateCanvasSize,
    config,
  };
}
