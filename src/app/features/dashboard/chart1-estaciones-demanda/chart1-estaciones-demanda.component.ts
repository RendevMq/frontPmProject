// src/app/components/chart1-estaciones-demanda/chart1-estaciones-demanda.component.ts
import { Component, inject, effect } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../../../core/services/api.service';
import { Estacion, IEstacionesRutaDemanda } from '../../../core/models/historico.model';

@Component({
  selector: 'app-chart1-estaciones-demanda',
  templateUrl: './chart1-estaciones-demanda.component.html',
  styleUrls: ['./chart1-estaciones-demanda.component.scss'],
  standalone: true,
  imports: [BaseChartDirective],
})
export class Chart1EstacionesDemandaComponent {
  private apiService = inject(ApiService);

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Tiempo' }
      },
      y: {
        title: { display: true, text: 'Pasajeros Esperando' }
      }
    },
    elements: {
      point: {
        radius: 5 // Ajusta el tamaño de los puntos
      },
      line: {
        tension: 0.3 // Curvatura de la línea
      }
    }
  };

  estaciones = [Estacion.Benavides, Estacion.Canada, Estacion.JavierPrado, Estacion.Teran];
  
  constructor() {
    effect(() => {
      const estacionesRutaDemanda = this.apiService.estacionesRutaDemandaSignal();
      this.generateChartData(estacionesRutaDemanda);
    });
  }

  // Función para generar datos del gráfico
  private generateChartData(estacionesRutaDemanda: IEstacionesRutaDemanda[]): void {
    const labels = Array.from(
      new Set(estacionesRutaDemanda.map(d => new Date(d.hora).toLocaleTimeString()))
    );

    const datasets = this.estaciones.map(estacion => ({
      label: estacion,
      data: labels.map(label => {
        const entry = estacionesRutaDemanda.find(
          d => d.estacion === estacion && new Date(d.hora).toLocaleTimeString() === label
        );
        return entry ? entry.pasajerosEsperando : 0;
      }),
      fill: false,
      borderColor: this.getColor(estacion),
      backgroundColor: this.getColor(estacion), // Color de los puntos
      pointBorderWidth: 2, // Grosor del borde de los puntos
      pointRadius: 5, // Tamaño de los puntos
      showLine: true, // Cambia a `false` si quieres solo puntos
    }));

    this.lineChartData = { labels, datasets };
  }

  // Asigna colores a cada estación
  private getColor(estacion: Estacion): string {
    switch (estacion) {
      case Estacion.Benavides:
        return 'rgba(75, 192, 192, 1)';
      case Estacion.Canada:
        return 'rgba(54, 162, 235, 1)';
      case Estacion.JavierPrado:
        return 'rgba(255, 206, 86, 1)';
      case Estacion.Teran:
        return 'rgba(153, 102, 255, 1)';
      default:
        return 'rgba(201, 203, 207, 1)';
    }
  }
}
