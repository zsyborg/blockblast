'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameState, GameStatus } from '../types/GameState';
import { getDefaultSettings, createEmptyBoard, generateRandomPiece, createTetromino, dropPiece } from '../utils/gameLogic';
import { getDropSpeed } from '../utils/scoring';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import GameBoard from './GameBoard';
import Tetromino from './Tetromino';
import ScorePanel from './ScorePanel';

const Game: React.FC = () => {
  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [gameState, setGameState] = useState<GameState>(() => {
    const settings = getDefaultSettings();
    const board = createEmptyBoard(settings.boardWidth, settings.boardHeight);
    const initialPiece = createTetromino(generateRandomPiece());
    const nextPieces = Array.from({ length: 5 }, () => generateRandomPiece());

    return {
      board,
      currentPiece: initialPiece,
      nextPieces,
      heldPiece: null,
      canHold: true,
      score: 0,
      level: 0,
      linesCleared: 0,
      highScore: 0, // TODO: Load from localStorage
      status: 'menu' as GameStatus,
      settings,
    };
  });

  // Game loop
  useEffect(() => {
    if (gameState.status === 'playing') {
      const dropSpeed = getDropSpeed(gameState.level);
      dropIntervalRef.current = setInterval(() => {
        setGameState(prev => dropPiece(prev));
      }, dropSpeed);
    } else {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
        dropIntervalRef.current = null;
      }
    }

    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
        dropIntervalRef.current = null;
      }
    };
  }, [gameState.status, gameState.level]);


  const startGame = () => {
    setGameState(prev => ({ ...prev, status: 'playing' }));
  };

  // Use keyboard controls
  useKeyboardControls({ gameState, setGameState });

  return (
    <div className="game-container flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="game-layout flex gap-4">
        {/* Left side - Score and controls */}
        <div className="flex flex-col gap-4">
          <ScorePanel
            score={gameState.score}
            level={gameState.level}
            linesCleared={gameState.linesCleared}
            highScore={gameState.highScore}
          />
          {/* TODO: Add controls, hold queue, next queue */}
        </div>

        {/* Center - Game board */}
        <div className="relative">
          <GameBoard board={gameState.board} skin={gameState.settings.skin} />
          {gameState.currentPiece && gameState.status === 'playing' && (
            <Tetromino piece={gameState.currentPiece} skin={gameState.settings.skin} />
          )}
        </div>

        {/* Right side - Next pieces, etc. */}
        <div className="flex flex-col gap-4">
          {/* TODO: Add next queue, settings button, etc. */}
        </div>
      </div>

      {gameState.status === 'menu' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Tetris</h1>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {gameState.status === 'gameOver' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Game Over</h1>
            <p className="text-white mb-4">Score: {gameState.score}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;