'use client';

import React from 'react';

interface ScorePanelProps {
  score: number;
  level: number;
  linesCleared: number;
  highScore: number;
}

const ScorePanel: React.FC<ScorePanelProps> = ({
  score,
  level,
  linesCleared,
  highScore,
}) => {
  return (
    <div className="score-panel bg-gray-800 text-white p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Score</h3>
      <div className="space-y-2">
        <div>
          <span className="text-gray-400">Score:</span>
          <span className="ml-2 font-mono">{score.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-400">Level:</span>
          <span className="ml-2 font-mono">{level}</span>
        </div>
        <div>
          <span className="text-gray-400">Lines:</span>
          <span className="ml-2 font-mono">{linesCleared}</span>
        </div>
        <div>
          <span className="text-gray-400">High Score:</span>
          <span className="ml-2 font-mono">{highScore.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ScorePanel);