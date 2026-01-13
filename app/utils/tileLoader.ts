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
  buttons: {
    name: 'Gel Buttons',
    tiles: {
      I: '/tiles/blue_button.png',
      O: '/tiles/yellow_button.png',
      T: '/tiles/purple_button.png',
      S: '/tiles/green_button.png',
      Z: '/tiles/red_button.png',
      J: '/tiles/light_blue_button.png',
      L: '/tiles/orange_button.png',
    },
  },
  ice: {
    name: 'Ice',
    tiles: {
      I: '/tiles/8.png',
      O: '/tiles/10.png',
      T: '/tiles/14.png',
      S: '/tiles/40.png',
      Z: '/tiles/55.png',
      J: '/tiles/56.png',
      L: '/tiles/14.png',
    },
  },
  fire: {
    name: 'Fire',
    tiles: {
      I: '/tiles/16.png',
      O: '/tiles/32.png',
      T: '/tiles/15.png',
      S: '/tiles/16.png',
      Z: '/tiles/32.png',
      J: '/tiles/15.png',
      L: '/tiles/16.png',
    },
  },
  candy: {
    name: 'Candy',
    tiles: {
      I: '/tiles/23.png',
      O: '/tiles/24.png',
      T: '/tiles/25.png',
      S: '/tiles/26.png',
      Z: '/tiles/21.png',
      J: '/tiles/22.png',
      L: '/tiles/51.png',
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