import { TetrominoShape } from '../types/TetrominoType';

export interface TileSkin {
  name: string;
  tiles: Record<TetrominoShape, string>;
}

const SKINS: Record<string, TileSkin> = {
  default: {
    name: 'Default',
    tiles: {
      I: '/tiles/1.png',
      O: '/tiles/2.png',
      T: '/tiles/3.png',
      S: '/tiles/4.png',
      Z: '/tiles/5.png',
      J: '/tiles/6.png',
      L: '/tiles/7.png',
    },
  },
  // Add more skins as needed
};

export function getTileSkin(skinName: string): TileSkin {
  return SKINS[skinName] || SKINS.default;
}

export function getTileImage(shape: TetrominoShape, skinName: string): string {
  const skin = getTileSkin(skinName);
  return skin.tiles[shape];
}

export function getAvailableSkins(): string[] {
  return Object.keys(SKINS);
}