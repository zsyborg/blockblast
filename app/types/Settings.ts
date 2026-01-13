export interface Settings {
  boardWidth: number;
  boardHeight: number;
  dropSpeed: number; // milliseconds between automatic drops
  showGhostPiece: boolean;
  enableSounds: boolean;
  skin: string; // tile skin name
  controls: {
    moveLeft: string;
    moveRight: string;
    moveDown: string;
    rotate: string;
    hardDrop: string;
    hold: string;
    pause: string;
  };
}