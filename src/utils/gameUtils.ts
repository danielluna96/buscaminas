import { Cell, CellValue, GameConfig, Position } from '../types/game';

export const createEmptyBoard = (rows: number, cols: number): Cell[][] => {
  return Array(rows).fill(null).map((_, row) =>
    Array(cols).fill(null).map((_, col) => ({
      value: null,
      isRevealed: false,
      isFlagged: false,
      position: { row, col },
    }))
  );
};

export const placeMines = (board: Cell[][], mines: number, firstClick: Position): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = [...board];
  let minesPlaced = 0;

  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    // Don't place mine on first click or where there's already a mine
    if ((row !== firstClick.row || col !== firstClick.col) && newBoard[row][col].value !== 'mine') {
      newBoard[row][col].value = 'mine';
      minesPlaced++;
    }
  }

  return newBoard;
};

export const getNeighbors = (position: Position, rows: number, cols: number): Position[] => {
  const { row, col } = position;
  const neighbors: Position[] = [];

  for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
      if (r !== row || c !== col) {
        neighbors.push({ row: r, col: c });
      }
    }
  }

  return neighbors;
};

export const calculateNumbers = (board: Cell[][]): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = [...board];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (newBoard[row][col].value !== 'mine') {
        const neighbors = getNeighbors({ row, col }, rows, cols);
        const mineCount = neighbors.filter(
          (pos) => newBoard[pos.row][pos.col].value === 'mine'
        ).length;
        newBoard[row][col].value = mineCount || null;
      }
    }
  }

  return newBoard;
};

export const initializeGame = (config: GameConfig, firstClick: Position): Cell[][] => {
  const board = createEmptyBoard(config.rows, config.cols);
  const boardWithMines = placeMines(board, config.mines, firstClick);
  return calculateNumbers(boardWithMines);
};

export const revealCell = (board: Cell[][], position: Position): Cell[][] => {
  const { row, col } = position;
  const newBoard = [...board];
  const cell = newBoard[row][col];

  if (cell.isRevealed || cell.isFlagged) {
    return newBoard;
  }

  cell.isRevealed = true;

  if (cell.value === null) {
    const neighbors = getNeighbors(position, newBoard.length, newBoard[0].length);
    neighbors.forEach((pos) => {
      if (!newBoard[pos.row][pos.col].isRevealed) {
        revealCell(newBoard, pos);
      }
    });
  }

  return newBoard;
};

export const checkWin = (board: Cell[][]): boolean => {
  return board.every((row) =>
    row.every((cell) =>
      cell.value === 'mine'
        ? !cell.isRevealed
        : cell.isRevealed
    )
  );
};

export const revealAllMines = (board: Cell[][]): Cell[][] => {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      isRevealed: cell.value === 'mine' ? true : cell.isRevealed,
    }))
  );
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
