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

export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  value: number;
  type: 'success' | 'error';
}

export interface GameConfig {
  yellowCount: number;
  whiteCount: number;
  timerDuration: number;
  timerAcceleration: number;
  maxHealth: number;
}

export interface DifficultyLevel {
  name: string;
  label: string;
  config: GameConfig;
}

export type GameState = 'menu' | 'playing' | 'gameover' | 'victory';

export const DIFFICULTIES: DifficultyLevel[] = [
  {
    name: 'easy',
    label: 'EASY',
    config: {
      yellowCount: 3,
      whiteCount: 2,
      timerDuration: 60,
      timerAcceleration: 0.05,
      maxHealth: 5,
    },
  },
  {
    name: 'normal',
    label: 'NORMAL',
    config: {
      yellowCount: 5,
      whiteCount: 4,
      timerDuration: 45,
      timerAcceleration: 0.1,
      maxHealth: 4,
    },
  },
  {
    name: 'hard',
    label: 'HARD',
    config: {
      yellowCount: 7,
      whiteCount: 6,
      timerDuration: 30,
      timerAcceleration: 0.15,
      maxHealth: 3,
    },
  },
  {
    name: 'insane',
    label: 'INSANE',
    config: {
      yellowCount: 10,
      whiteCount: 8,
      timerDuration: 20,
      timerAcceleration: 0.2,
      maxHealth: 2,
    },
  },
];
