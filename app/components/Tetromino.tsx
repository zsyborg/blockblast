'use client';

import React from 'react';
import Image from 'next/image';
import { Tetromino as TetrominoType } from '../types/TetrominoType';
import { getTileImage } from '../utils/tileLoader';

interface TetrominoProps {
  piece: TetrominoType;
  skin: string;
}

const Tetromino: React.FC<TetrominoProps> = ({ piece, skin }) => {
  return (
    <>
      {piece.tiles.map((tile, index) => {
        const x = piece.position.x + tile.x;
        const y = piece.position.y + tile.y;

        // Only render if within visible board (y >= 0)
        if (y < 0) return null;

        return (
          <div
            key={index}
            className="absolute w-6 h-6 flex items-center justify-center"
            style={{
              left: `${x * 24}px`,
              top: `${y * 24}px`,
            }}
          >
            <Image
              src={getTileImage(piece.shape, skin)}
              alt={`${piece.shape} tile`}
              width={24}
              height={24}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
    </>
  );
};

export default React.memo(Tetromino);