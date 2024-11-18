import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { IEstacionesRutaDemanda, Ruta } from '../../../core/models/historico.model';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-train',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss'],
})
export class TrainComponent {
  private apiService = inject(ApiService);
  private themeService = inject(ThemeService);

  tuProgresoDeEntrenamiento = 5;
  currentPage = signal(1);
  itemsPerPage = signal(6);
  totalItems = signal(0);
  allData = signal<IEstacionesRutaDemanda[]>([]);
  displayData = signal<IEstacionesRutaDemanda[]>([]);
  theme = this.themeService.isDark() ? 'dark' : 'light';

  pageSizeOptions = [6, 12, 18, 24];

  constructor() {
    // Efecto para actualizar los datos
    effect(() => {
      const data = this.apiService.estacionesRutaDemandaSignal();
      this.allData.set(data);
      this.totalItems.set(data.length);
      this.updateDisplayData();
    }, { allowSignalWrites: true });

    // Efecto para detectar cambios en el tema
    effect(() => {
      this.theme = this.themeService.isDark() ? 'dark' : 'light';
    });
  }

  updateDisplayData() {
    const start = (Number(this.currentPage()) - 1) * Number(this.itemsPerPage());
    const end = start + Number(this.itemsPerPage());
    this.displayData.set(this.allData().slice(start, end));
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.updateDisplayData();
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage.set(items);
    this.currentPage.set(1);
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
      second: '2-digit',
      hour12: false,
    });
  }

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

  getPassengerIcon(count: number): string {
    if (count <= 20) return 'fas fa-user';
    if (count <= 50) return 'fas fa-users';
    return 'fas fa-user-friends';
  }

  getRowClass(index: number): string {
    const groupIndex = Math.floor(index / 6) % 2;
    return groupIndex === 0 ? 'row-group-a' : 'row-group-b';
  }
  

  getDisplayRangeEnd(): number {
    return Math.min(this.currentPage() * this.itemsPerPage(), this.totalItems());
  }
}

