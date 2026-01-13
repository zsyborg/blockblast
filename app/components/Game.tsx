'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameState, GameStatus } from '../types/GameState';
import { getDefaultSettings, createEmptyBoard, generateRandomPiece, createTetromino, dropPiece } from '../utils/gameLogic';
import { getDropSpeed } from '../utils/scoring';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { getAvailableSkins } from '../utils/tileLoader';
import GameBoard from './GameBoard';
import Tetromino from './Tetromino';
import ScorePanel from './ScorePanel';

const Game: React.FC = () => {
  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showSettings, setShowSettings] = useState(false);

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
        <div className="relative border-2 border-gray-400">
          <GameBoard board={gameState.board} skin={gameState.settings.skin} />
          {gameState.currentPiece && gameState.status === 'playing' && (
            <Tetromino piece={gameState.currentPiece} skin={gameState.settings.skin} />
          )}
        </div>

        {/* Right side - Next pieces, etc. */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Settings
          </button>
          {/* TODO: Add next queue, etc. */}
        </div>
      </div>

      {showSettings && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-white">Tile Skin</label>
              <div className="flex gap-2">
                {getAvailableSkins().map(skin => (
                  <button
                    key={skin}
                    onClick={() => setGameState(prev => ({
                      ...prev,
                      settings: { ...prev.settings, skin }
                    }))}
                    className={`px-4 py-2 rounded ${
                      gameState.settings.skin === skin
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-white hover:bg-gray-500'
                    }`}
                  >
                    {skin.charAt(0).toUpperCase() + skin.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

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