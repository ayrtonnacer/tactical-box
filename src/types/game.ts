export interface Circle {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: 'good' | 'bad';
  captured: boolean;
}

export interface SelectionBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface GameConfig {
  yellowCount: number;
  whiteCount: number;
  timerDuration: number;
}

export type GameState = 'menu' | 'playing' | 'gameover';

// More aggressive difficulty scaling
export function getConfigForRound(round: number): GameConfig {
  // Start easy, ramp up fast
  const yellowCount = Math.min(2 + round, 15);
  const whiteCount = Math.min(1 + Math.floor(round * 0.8), 12);
  const timerDuration = Math.max(40 - (round - 1) * 3, 10);

  return {
    yellowCount,
    whiteCount,
    timerDuration,
  };
}
