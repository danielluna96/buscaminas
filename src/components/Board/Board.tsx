import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Cell as CellComponent } from '../Cell/Cell';
import { Cell, Difficulty, DIFFICULTY_CONFIG, GameConfig, Position } from '../../types/game';
import {
  createEmptyBoard,
  initializeGame,
  revealCell,
  checkWin,
  revealAllMines,
  formatTime,
} from '../../utils/gameUtils';
import styles from './Board.module.css';

export const Board = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [config, setConfig] = useState<GameConfig>(DIFFICULTY_CONFIG[difficulty]);
  const [board, setBoard] = useState<Cell[][]>(createEmptyBoard(config.rows, config.cols));
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer: number;
    if (!gameOver && !isFirstClick) {
      timer = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameOver, isFirstClick]);

  const handleNewGame = useCallback(() => {
    const newConfig = DIFFICULTY_CONFIG[difficulty];
    setConfig(newConfig);
    setBoard(createEmptyBoard(newConfig.rows, newConfig.cols));
    setIsFirstClick(true);
    setGameOver(false);
    setWin(false);
    setFlagCount(0);
    setTime(0);
  }, [difficulty]);

  useEffect(() => {
    handleNewGame();
  }, [difficulty, handleNewGame]);

  const handleCellReveal = (row: number, col: number) => {
    if (gameOver || (board[row][col].isFlagged && !isFirstClick)) return;

    if (isFirstClick) {
      const firstClickPos: Position = { row, col };
      const newBoard = initializeGame(config, firstClickPos);
      setBoard(revealCell(newBoard, firstClickPos));
      setIsFirstClick(false);
    } else {
      const cell = board[row][col];
      if (cell.value === 'mine') {
        setBoard(revealAllMines(board));
        setGameOver(true);
      } else {
        const newBoard = revealCell(board, { row, col });
        setBoard(newBoard);
        if (checkWin(newBoard)) {
          setWin(true);
          setGameOver(true);
        }
      }
    }
  };

  const handleCellFlag = (row: number, col: number) => {
    if (gameOver || isFirstClick) return;

    const newBoard = [...board];
    const cell = newBoard[row][col];

    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
      setBoard(newBoard);
      setFlagCount((prev) => prev + (cell.isFlagged ? 1 : -1));
    }
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value as Difficulty);
  };

  const getBoardStyle = () => ({
    gridTemplateColumns: `repeat(${config.cols}, 30px)`,
  });

  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.gameContainer}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <select
        className={styles.difficultySelect}
        value={difficulty}
        onChange={handleDifficultyChange}
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="expert">Expert</option>
        </select>
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className={styles.header}>
        <div className={styles.counter}>{config.mines - flagCount}</div>
        <button className={styles.newGameButton} onClick={handleNewGame}>
          New Game
        </button>
        <div className={styles.counter}>{formatTime(time)}</div>
      </div>

      <div className={styles.board} style={getBoardStyle()}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <CellComponent
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              onReveal={handleCellReveal}
              onFlag={handleCellFlag}
            />
          ))
        )}
      </div>

      {gameOver && (
        <div className={`${styles.gameStatus} ${win ? styles.win : styles.lose}`}>
          {win ? '¡Victoria! 🎉' : '¡Game Over! 💣'}
        </div>
      )}
    </div>
  );
};
