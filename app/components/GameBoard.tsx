'use client';

import React from 'react';
import Image from 'next/image';
import { TetrominoShape } from '../types/TetrominoType';
import { getTileImage } from '../utils/tileLoader';

interface GameBoardProps {
  board: (TetrominoShape | null)[][];
  skin: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, skin }) => {
  return (
    <div className="game-board grid gap-0 border-2 border-gray-400 bg-black p-1">
      {board.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="w-6 h-6 border border-gray-600 flex items-center justify-center"
            >
              {cell && (
                <Image
                  src={getTileImage(cell, skin)}
                  alt={`${cell} tile`}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default React.memo(GameBoard);