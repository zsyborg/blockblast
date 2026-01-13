import { Tetromino, TetrominoShape, TETROMINO_SHAPES } from '../types/TetrominoType';
import { Position } from '../types/Position';
import { Settings } from '../types/Settings';
import { GameState } from '../types/GameState';
import { checkCollision } from './collisionDetection';
import { clearLines } from './lineClearing';
import { calculateScore, calculateLevel, addPlacingScore } from './scoring';

export function generateRandomPiece(): TetrominoShape {
  const shapes: TetrominoShape[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

export function createTetromino(
  shape: TetrominoShape,
  position: Position = { x: 3, y: 0 }
): Tetromino {
  return {
    shape,
    position,
    rotation: 0,
    tiles: TETROMINO_SHAPES[shape][0],
  };
}

export function rotateTetromino(piece: Tetromino, clockwise: boolean = true): Tetromino {
  const newRotation = clockwise
    ? (piece.rotation + 1) % 4
    : (piece.rotation + 3) % 4;

  return {
    ...piece,
    rotation: newRotation,
    tiles: TETROMINO_SHAPES[piece.shape][newRotation],
  };
}

export function moveTetromino(piece: Tetromino, dx: number, dy: number): Tetromino {
  return {
    ...piece,
    position: {
      x: piece.position.x + dx,
      y: piece.position.y + dy,
    },
  };
}

export function placePiece(
  board: (TetrominoShape | null)[][],
  piece: Tetromino
): (TetrominoShape | null)[][] {
  const newBoard = board.map(row => [...row]);
  const shape = TETROMINO_SHAPES[piece.shape][piece.rotation];

  for (const tile of shape) {
    const x = piece.position.x + tile.x;
    const y = piece.position.y + tile.y;
    if (y >= 0) {
      newBoard[y][x] = piece.shape;
    }
  }

  return newBoard;
}

export function checkGameOver(
  board: (TetrominoShape | null)[][],
  nextPiece: Tetromino
): boolean {
  // Check if the next piece would collide at spawn position
  const spawnPosition = { x: Math.floor(board[0].length / 2) - 1, y: 0 };
  const testPiece = { ...nextPiece, position: spawnPosition };

  return board[0].some(cell => cell !== null) ||
         board[1].some(cell => cell !== null);
}

export function createEmptyBoard(width: number, height: number): (TetrominoShape | null)[][] {
  return Array.from({ length: height }, () => Array(width).fill(null));
}

export function getDefaultSettings(): Settings {
  return {
    boardWidth: 10,
    boardHeight: 20,
    dropSpeed: 1000,
    showGhostPiece: true,
    enableSounds: true,
    skin: 'default',
    controls: {
      moveLeft: 'ArrowLeft',
      moveRight: 'ArrowRight',
      moveDown: 'ArrowDown',
      rotate: 'ArrowUp',
      hardDrop: ' ',
      hold: 'KeyC',
      pause: 'KeyP',
    },
  };
}

export function dropPiece(gameState: GameState): GameState {
  if (!gameState.currentPiece) return gameState;

  const movedPiece = moveTetromino(gameState.currentPiece, 0, 1);

  if (!checkCollision(gameState.board, movedPiece)) {
    // No collision, move down
    return {
      ...gameState,
      currentPiece: movedPiece,
    };
  } else {
    // Collision, place the piece
    const newBoard = placePiece(gameState.board, gameState.currentPiece);
    const { clearedBoard, linesCleared } = clearLines(newBoard);
    const newLinesTotal = gameState.linesCleared + linesCleared;
    const newLevel = calculateLevel(newLinesTotal);
    const newScore = calculateScore(gameState.score, linesCleared, gameState.level);
    const finalScore = addPlacingScore(newScore);

    // Spawn next piece
    const nextShape = gameState.nextPieces[0];
    const newCurrentPiece = createTetromino(nextShape);
    const newNextPieces = [...gameState.nextPieces.slice(1), generateRandomPiece()];

    // Check game over
    const gameOver = checkGameOver(clearedBoard, newCurrentPiece);

    return {
      ...gameState,
      board: clearedBoard,
      currentPiece: gameOver ? null : newCurrentPiece,
      nextPieces: newNextPieces,
      score: finalScore,
      level: newLevel,
      linesCleared: newLinesTotal,
      status: gameOver ? 'gameOver' : gameState.status,
    };
  }
}