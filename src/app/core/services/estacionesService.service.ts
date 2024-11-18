// estaciones.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EstacionesService {
  // Signal to hold the stations data
  estacionesData = signal<any[]>([]);

  constructor() {
    // Initialize with default data
    this.estacionesData.set([
        { id: 1, B: '', nombre: 'Teran' },                       // Station 1: B
        { id: 2, B: '', nombre: 'Benavides' },                   // Station 2: B
        { id: 3, B: '', EXP1: '', nombre: 'Javier Prado' },      // Station 3: B, EXP1
        { id: 4, B: '', EXP1: '', nombre: 'Canada' },            // Station 4: B, EXP1
      ]);
  }

  // Method to update a specific station's data
  updateEstacion(index: number, field: string, value: string) {
    const currentData = [...this.estacionesData()];
    currentData[index][field] = value;
    this.estacionesData.set(currentData);
  }

  // Getter for estacionesData
  getEstacionesData() {
    return this.estacionesData();
  }
}
