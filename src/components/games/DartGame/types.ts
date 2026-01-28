export interface Shot {
  id: number;
  label: string;
  points: number;
  coords?: string;
}



export interface Position {
  x: number;
  y: number;
  swayX: number;
  swayY: number;
}
export interface PlacedDart {
  id: string;   // Use string for the ID
  x: number;    // Number for coordinate
  y: number;    // Number for coordinate
  color: string; // The specific property TypeScript is complaining about
  label?: number;
}