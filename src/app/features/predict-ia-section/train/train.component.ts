import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { IEstacionesRutaDemanda, Ruta } from '../../../core/models/historico.model';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from "./loader/loader.component";



@Component({
  selector: 'app-train',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss']
})
export class TrainComponent {
  private apiService = inject(ApiService);
  tuVariableDeProgreso = 5;
  
  // Pagination signals
  currentPage = signal(1);
  itemsPerPage = signal(6);
  totalItems = signal(0);
  
  // Data signals
  allData = signal<IEstacionesRutaDemanda[]>([]);
  displayData = signal<IEstacionesRutaDemanda[]>([]);

  // Available page size options
  pageSizeOptions = [ 6,12, 18, 24];

  constructor() {
    effect(() => {
      const data = this.apiService.estacionesRutaDemandaSignal();
      this.allData.set(data);
      this.totalItems.set(data.length);
      this.updateDisplayData();
    }, { allowSignalWrites: true }); // Habilita la escritura de señales dentro del efecto
}


  // Pagination methods
  updateDisplayData() {
    // Convertir a número explícitamente para evitar concatenación de cadenas
    const start = (Number(this.currentPage()) - 1) * Number(this.itemsPerPage());
    const end = start + Number(this.itemsPerPage());
    
    console.log(`Mostrando elementos de índice ${start} a ${end} en la página ${this.currentPage()}`);
    
    // Limitar los datos a los elementos de la página actual
    const paginatedData = this.allData().slice(start, end);
    console.log("Datos paginados:", paginatedData);
    
    this.displayData.set(paginatedData);
}




  onPageChange(page: number) {
    this.currentPage.set(page);
    this.updateDisplayData();
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage.set(items);
    this.currentPage.set(1); // Reset to first page
    this.updateDisplayData();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.itemsPerPage());
  }

  get paginationRange(): number[] {
    const range = [];
    const start = Math.max(1, this.currentPage() - 2);
    const end = Math.min(this.totalPages, start + 4);
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit', // añade los segundos
      hour12: false // formato de 24 horas
    });
  }

    // Helper method to get route class
    getRouteClass(ruta: Ruta): string {
      switch (ruta) {
        case Ruta.B:
          return 'route-regular';
        case Ruta.Exp1:
          return 'route-express';
        default:
          return 'route-regular';
      }
    }

  getPassengerClass(count: number): string {
    if (count <= 20) return 'passengers-low';
    if (count <= 50) return 'passengers-medium';
    return 'passengers-high';
  }

  getRowClass(index: number): string {
    const groupIndex = Math.floor((this.itemsPerPage() * (this.currentPage() - 1) + index) / 6);
    return groupIndex % 2 === 0 ? 'row-group-1' : 'row-group-2';
  }

// TrainComponent.ts
getDisplayRangeEnd(): number {
  return Math.min(this.currentPage() * this.itemsPerPage(), this.totalItems());
}

}