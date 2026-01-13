export function calculateScore(
  currentScore: number,
  linesCleared: number,
  level: number
): number {
  const basePoints = [0, 40, 100, 300, 1200]; // 0, 1, 2, 3, 4 lines
  return currentScore + basePoints[linesCleared] * (level + 1);
}

export function calculateLevel(linesCleared: number): number {
  return Math.floor(linesCleared / 10);
}

export function addPlacingScore(currentScore: number): number {
  return currentScore + 10;
}

export function addHardDropScore(currentScore: number, rowsDropped: number): number {
  return currentScore + 2 * rowsDropped;
}

export function getDropSpeed(level: number): number {
  // Speed increases every level, minimum 50ms
  return Math.max(1000 - level * 50, 50);
}