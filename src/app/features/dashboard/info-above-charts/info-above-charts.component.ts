// import { Component, effect, OnInit } from '@angular/core';
// import { ApiService } from '../../../core/services/api.service';

// @Component({
//   selector: 'app-info-above-charts',
//   standalone: true,
//   templateUrl: './info-above-charts.component.html',
//   styleUrls: ['./info-above-charts.component.scss'],
// })
// export class InfoAboveChartsComponent implements OnInit {
//   currentTime: string = '';
//   estacionesCount: number = 0;
//   rutasCount: number = 0;
//   busesCount: number = 0;

//   constructor(private apiService: ApiService) {
//     // Coloca `effect` en el constructor para el contexto de inyección correcto
//     effect(() => {
//       const cronogramas = this.apiService.cronogramasSignal(); // Obtiene el valor actual del signal
//       this.busesCount = new Set(cronogramas.map(c => c.codigoBus)).size;
//       this.estacionesCount = new Set(cronogramas.map(c => c.estacion)).size;
//       this.rutasCount = new Set(cronogramas.map(c => c.ruta)).size;
//     });
//   }

//   ngOnInit(): void {
//     // Actualiza la hora cada segundo
//     this.updateTime();
//     setInterval(() => this.updateTime(), 1000);
//   }

//   private updateTime(): void {
//     const now = new Date();
//     this.currentTime = now.toLocaleTimeString();
//   }
// }
import { Component, OnInit, OnDestroy, effect, inject } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ThemeService } from '../../../core/services/theme.service';

interface CronogramaDetalle {
  cantidadEstaciones: number;
  cantidadRutas: number;
  cantidadBuses: number;
}

@Component({
  selector: 'app-info-above-charts',
  standalone: true,
  templateUrl: './info-above-charts.component.html',
  styleUrls: ['./info-above-charts.component.scss'],
})
export class InfoAboveChartsComponent implements OnInit, OnDestroy {
  datos: CronogramaDetalle = { cantidadEstaciones: 0, cantidadRutas: 0, cantidadBuses: 0 };
  currentTime: string = '';
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  isDarkTheme: boolean = false; // Variable para controlar el tema
  private clockSubscription?: Subscription;

  // Inyectar ApiService y ThemeService
  private apiService = inject(ApiService);
  private themeService = inject(ThemeService);

  constructor() {
    // Utilizar `effect` para escuchar cambios en `cronogramasSignal` y actualizar `datos`
    effect(() => {
      const cronogramas = this.apiService.cronogramasSignal(); // Obtener el valor actual del signal
      this.datos = {
        cantidadEstaciones: new Set(cronogramas.map(c => c.estacion)).size,
        cantidadRutas: new Set(cronogramas.map(c => c.ruta)).size,
        cantidadBuses: new Set(cronogramas.map(c => c.codigoBus)).size,
      };
    });

    // Escuchar cambios en el tema
    effect(() => {
      this.isDarkTheme = this.themeService.isDark();
    });
  }

  ngOnInit() {
    this.startClock();
  }

  ngOnDestroy() {
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
  }

  private startClock() {
    this.updateClock(); // Actualización inicial
    this.clockSubscription = interval(1000).subscribe(() => {
      this.updateClock();
    });
  }

  private updateClock() {
    const now = new Date();
    this.hours = now.getHours();
    this.minutes = now.getMinutes();
    this.seconds = now.getSeconds();
    this.currentTime = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}
