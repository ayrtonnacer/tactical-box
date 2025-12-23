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
  maxHealth: number;
}

export type GameState = 'menu' | 'playing' | 'gameover';

// Progressive difficulty based on round number
export function getConfigForRound(round: number): GameConfig {
  // Base values
  const baseYellow = 3;
  const baseWhite = 2;
  const baseTimer = 45;
  const baseHealth = 5;

  // Progressive scaling
  const yellowCount = Math.min(baseYellow + Math.floor((round - 1) / 2), 12);
  const whiteCount = Math.min(baseWhite + Math.floor((round - 1) / 2), 10);
  const timerDuration = Math.max(baseTimer - (round - 1) * 2, 15);
  const maxHealth = Math.max(baseHealth - Math.floor((round - 1) / 3), 2);

  return {
    yellowCount,
    whiteCount,
    timerDuration,
    maxHealth,
  };
}
