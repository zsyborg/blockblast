import { useEffect, useCallback } from 'react';
import { GameState } from '../types/GameState';
import { moveTetromino, rotateTetromino, dropPiece } from '../utils/gameLogic';
import { checkCollision } from '../utils/collisionDetection';
import { addPlacingScore, addHardDropScore } from '../utils/scoring';

interface UseKeyboardControlsProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export function useKeyboardControls({ gameState, setGameState }: UseKeyboardControlsProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameState.status !== 'playing' || !gameState.currentPiece) return;

    const { controls } = gameState.settings;

    switch (event.code) {
      case controls.moveLeft:
        event.preventDefault();
        setGameState(prev => {
          if (!prev.currentPiece) return prev;
          const moved = moveTetromino(prev.currentPiece, -1, 0);
          if (!checkCollision(prev.board, moved)) {
            return { ...prev, currentPiece: moved };
          }
          return prev;
        });
        break;

      case controls.moveRight:
        event.preventDefault();
        setGameState(prev => {
          if (!prev.currentPiece) return prev;
          const moved = moveTetromino(prev.currentPiece, 1, 0);
          if (!checkCollision(prev.board, moved)) {
            return { ...prev, currentPiece: moved };
          }
          return prev;
        });
        break;

      case controls.moveDown:
        event.preventDefault();
        setGameState(prev => dropPiece(prev));
        break;

      case controls.rotate:
        event.preventDefault();
        setGameState(prev => {
          if (!prev.currentPiece) return prev;
          const rotated = rotateTetromino(prev.currentPiece);
          if (!checkCollision(prev.board, rotated)) {
            return { ...prev, currentPiece: rotated };
          }
          return prev;
        });
        break;

      case controls.hardDrop:
        event.preventDefault();
        setGameState(prev => {
          let current = prev;
          let rowsDropped = 0;
          while (current.currentPiece && !checkCollision(current.board, moveTetromino(current.currentPiece, 0, 1))) {
            current = {
              ...current,
              currentPiece: moveTetromino(current.currentPiece, 0, 1)
            };
            rowsDropped++;
          }
          const newScore = addHardDropScore(current.score, rowsDropped);
          const afterPlace = dropPiece({ ...current, score: newScore });
          return afterPlace;
        });
        break;

      // TODO: Implement hold and pause
      case controls.hold:
        event.preventDefault();
        // Implement hold logic
        break;

      case controls.pause:
        event.preventDefault();
        setGameState(prev => ({ ...prev, status: prev.status === 'playing' ? 'paused' : 'playing' }));
        break;
    }
  }, [gameState.status, gameState.currentPiece, gameState.settings, setGameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}