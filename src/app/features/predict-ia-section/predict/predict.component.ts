import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ICronogramaHistorico, Ruta } from '../../../core/models/cronograma.model';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { AiService } from '../../../core/services/ia.service';

@Component({
  selector: 'app-predict',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss'],
})
export class PredictComponent {
  private apiService = inject(ApiService);
  private themeService = inject(ThemeService);
  private aiService = inject(AiService); // Inyectar AiService

  theme: 'light' | 'dark';

  // Nuevas propiedades para el modo automático/manual
  isAutoMode = signal(true);
  manualValues = signal({
    Teran: 0,
    Benavides: 0,
    'Javier Prado': 0,
    Canada: 0,
  });

  currentPage = signal(1);
  itemsPerPage = signal(12);
  totalItems = signal(0);

  allData = signal<ICronogramaHistorico[]>([]);
  displayData = signal<ICronogramaHistorico[]>([]);

  pageSizeOptions = [6, 12, 18, 24];
  groupColors = new Map<string, string>();

  private autoUpdateInterval: any;

  constructor() {
    // Observar cambios en el tema
    this.theme = this.themeService.isDark() ? 'dark' : 'light';
    effect(() => {
      this.theme = this.themeService.isDark() ? 'dark' : 'light';
    });

    effect(() => {
      const data = this.apiService.ultimaSalidaSignal();
      const groupedData = this.groupAndSortByHour(data);
      this.assignGroupColors(groupedData);
      this.allData.set(groupedData);
      this.totalItems.set(groupedData.length);
      this.updateDisplayData();
    }, { allowSignalWrites: true });

    // Iniciar actualizaciones automáticas
    this.setupAutoUpdate();
  }

  toggleMode(isAuto: boolean) {
    this.isAutoMode.set(isAuto);
    if (isAuto) {
      this.setupAutoUpdate();
    } else {
      this.clearAutoUpdate();
    }
  }

  private setupAutoUpdate() {
    if (this.autoUpdateInterval) {
      this.clearAutoUpdate();
    }
    this.autoUpdateInterval = setInterval(() => {
      if (this.isAutoMode()) {
        this.updateCronograma();
      }
    }, 20 * 60 * 1000); // 20 minutos
  }

  private clearAutoUpdate() {
    if (this.autoUpdateInterval) {
      clearInterval(this.autoUpdateInterval);
      this.autoUpdateInterval = null;
    }
  }

  async updateCronograma() {
    if (this.isAutoMode()) {
      // Lógica para actualización automática
      console.log('Actualización automática en progreso...');
    } else {
      // Obtén la estructura base desde AiService
      const predictData = this.aiService.getBasePredictData();

      // Solo los valores de pasajeros que deben ser actualizados
      const pasajerosData = [
        { id: 2, pasajeros_esperando: 7 },
        { id: 5, pasajeros_esperando: 6 },
        { id: 6, pasajeros_esperando: 20 },
        { id: 13, pasajeros_esperando: 10 },
        { id: 20, pasajeros_esperando: 25 },
        { id: 21, pasajeros_esperando: 7 },
      ];

      // Actualiza únicamente el campo 'pasajeros_esperando' en la estructura base
      predictData.forEach((item) => {
        const pasajerosItem = pasajerosData.find((p) => p.id === item.id);
        if (pasajerosItem) {
          item.pasajeros_esperando = pasajerosItem.pasajeros_esperando;
        }
      });

      // Llama al servicio de predicción con los datos actualizados
      this.aiService.predict(predictData).subscribe(
        (response) => {
          console.log('Predicción exitosa:', response);

                  // Llama a los métodos `refresh` del servicio ApiService
        this.refreshAllData();
        },
        (error) => {
          console.error('Error al realizar la predicción:', error);
        }
      );
    }
  }

  private refreshAllData() {
    // Llama a los métodos `refresh` del servicio ApiService en paralelo
    // this.apiService.refreshDemandas();
    this.apiService.refreshEstacionesRutaDemanda();
    this.apiService.refreshCronogramas();
    this.apiService.refreshUltimaSalida();
    this.apiService.refreshBuses();
  
    console.log('Datos actualizados exitosamente.');
  }
  

  groupAndSortByHour(data: ICronogramaHistorico[]): ICronogramaHistorico[] {
    const groups = data.reduce((acc, item) => {
      if (!acc[item.codigoBus]) {
        acc[item.codigoBus] = [];
      }
      acc[item.codigoBus].push(item);
      return acc;
    }, {} as Record<string, ICronogramaHistorico[]>);

    const sortedGroups = Object.values(groups).sort((a, b) => {
      const maxA = Math.max(...a.map((item) => new Date(item.horaSalida).getTime()));
      const maxB = Math.max(...b.map((item) => new Date(item.horaSalida).getTime()));
      return maxB - maxA;
    });

    return sortedGroups.flat();
  }

  assignGroupColors(data: ICronogramaHistorico[]) {
    this.groupColors.clear();
    let currentColorIndex = 0;
    const colorClasses = ['row-group-a', 'row-group-b'];

    let lastGroup = '';
    data.forEach((item) => {
      if (item.codigoBus !== lastGroup) {
        lastGroup = item.codigoBus;
        this.groupColors.set(item.codigoBus, colorClasses[currentColorIndex]);
        currentColorIndex = (currentColorIndex + 1) % colorClasses.length;
      }
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

  getRouteClass(ruta: Ruta): string {
    const routeClasses = {
      [Ruta.Expreso1]: 'route-expreso1',
      [Ruta.Regular]: 'route-regular',
    };
    return routeClasses[ruta] || '';
  }

  getRowClass(codigoBus: string): string {
    return this.groupColors.get(codigoBus) || 'row-group-a';
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }
}
