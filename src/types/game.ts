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

export type GameState = 'menu' | 'playing' | 'gameover';
