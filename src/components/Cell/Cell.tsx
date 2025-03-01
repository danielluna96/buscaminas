import { MouseEvent } from 'react';
import { Cell as CellType } from '../../types/game';
import styles from './Cell.module.css';

interface CellProps {
  cell: CellType;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
}

export const Cell = ({ cell, onReveal, onFlag }: CellProps) => {
  const handleClick = () => {
    if (!cell.isFlagged) {
      onReveal(cell.position.row, cell.position.col);
    }
  };

  const handleRightClick = (e: MouseEvent) => {
    e.preventDefault();
    onFlag(cell.position.row, cell.position.col);
  };

  const getCellContent = () => {
    if (!cell.isRevealed && cell.isFlagged) {
      return '🚩';
    }
    if (!cell.isRevealed) {
      return '';
    }
    if (cell.value === 'mine') {
      return '💣';
    }
    return cell.value || '';
  };

  const getCellClassName = () => {
    const classNames = [styles.cell];
    
    if (cell.isRevealed) {
      classNames.push(styles.revealed);
      if (cell.value === 'mine') {
        classNames.push(styles.mine);
      } else if (typeof cell.value === 'number') {
        classNames.push(styles[`number${cell.value}`]);
      }
    } else if (cell.isFlagged) {
      classNames.push(styles.flagged);
    }
    
    return classNames.join(' ');
  };

  return (
    <div
      className={getCellClassName()}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {getCellContent()}
    </div>
  );
};
