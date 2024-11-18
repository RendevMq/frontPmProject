export interface Neuron {
  id: string;
  x: number;
  y: number;
}

export interface Layer {
  id: string;
  path: string;
  opacity?: number; // Opcional si planeas definirlo dentro de generateHiddenLayers
}

export interface Connection {
  id: string;
  path: string;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
}
