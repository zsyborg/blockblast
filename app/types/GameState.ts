import { Tetromino, TetrominoShape } from './TetrominoType';
import { Settings } from './Settings';

export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameOver';

export interface GameState {
  board: (TetrominoShape | null)[][];
  currentPiece: Tetromino | null;
  nextPieces: TetrominoShape[];
  heldPiece: TetrominoShape | null;
  canHold: boolean;
  score: number;
  level: number;
  linesCleared: number;
  highScore: number;
  status: GameStatus;
  settings: Settings;
}