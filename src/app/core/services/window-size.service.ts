// src/app/core/services/window-size.service.ts

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowSizeService {
  private widthSignal = signal(window.innerWidth);
  private heightSignal = signal(window.innerHeight);

  constructor() {
    // Escuchar el evento de redimensionamiento de la ventana
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  // Métodos para obtener el ancho y alto
  width() {
    return this.widthSignal();
  }

  height() {
    return this.heightSignal();
  }

  // Método para actualizar los signals cuando cambia el tamaño de la ventana
  private handleResize() {
    this.widthSignal.set(window.innerWidth);
    this.heightSignal.set(window.innerHeight);
  }
}
