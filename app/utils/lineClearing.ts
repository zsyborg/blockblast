import { TetrominoShape } from '../types/TetrominoType';

export function clearLines(board: (TetrominoShape | null)[][]): {
  clearedBoard: (TetrominoShape | null)[][];
  linesCleared: number;
} {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const linesCleared = board.length - newBoard.length;

  // Add empty rows at the top
  while (newBoard.length < board.length) {
    newBoard.unshift(new Array(board[0].length).fill(null));
  }

  return { clearedBoard: newBoard, linesCleared };
}