export type CellValue = number | 'mine' | null;

export interface Cell {
  value: CellValue;
  isRevealed: boolean;
  isFlagged: boolean;
  position: Position;
}

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  board: Cell[][];
  gameOver: boolean;
  win: boolean;
  mineCount: number;
  flagCount: number;
}

export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, GameConfig> = {
  beginner: {
    rows: 9,
    cols: 9,
    mines: 10,
  },
  intermediate: {
    rows: 16,
    cols: 16,
    mines: 40,
  },
  expert: {
    rows: 16,
    cols: 30,
    mines: 99,
  },
};
