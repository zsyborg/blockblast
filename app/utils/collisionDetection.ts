import { Tetromino, TetrominoShape, TETROMINO_SHAPES } from '../types/TetrominoType';
import { Position } from '../types/Position';

export function checkCollision(
  board: (TetrominoShape | null)[][],
  piece: Tetromino
): boolean {
  const shape = TETROMINO_SHAPES[piece.shape][piece.rotation];

  for (const tile of shape) {
    const x = piece.position.x + tile.x;
    const y = piece.position.y + tile.y;

    // Check boundaries
    if (x < 0 || x >= board[0].length || y >= board.length) {
      return true;
    }

    // Check collision with placed pieces (but allow negative y for spawning)
    if (y >= 0 && board[y][x] !== null) {
      return true;
    }
  }

  return false;
}

export function getGhostPiecePosition(
  board: (TetrominoShape | null)[][],
  piece: Tetromino
): Position {
  let ghostPiece = { ...piece };

  while (!checkCollision(board, ghostPiece)) {
    ghostPiece.position.y += 1;
  }

  // Move back up one step since the last position was colliding
  ghostPiece.position.y -= 1;

  return ghostPiece.position;
}