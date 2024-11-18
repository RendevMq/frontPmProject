import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
  OnChanges,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { ROUTE_DATA } from '../route-data';
import { ApiService } from '../../../../core/services/api.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { Weather } from '../../../../core/models/weather.model';

@Component({
  selector: 'app-weatherinfo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weatherinfo.component.html',
  styleUrls: ['./weatherinfo.component.scss'],
})
export default class WeatherinfoComponent implements OnInit, OnDestroy {
  @Input() set selectedRoute(value: 'A' | 'B') {
    this.currentRoute.set(value);
    this.loadWeatherData();
  }

  // Servicios inyectados
  private apiService = inject(ApiService);
  private themeService = inject(ThemeService);
// En tu componente
// theme = signal<'light' | 'dark'>(this.themeService.isDark() ? 'dark' : 'light');

theme = computed(() => (this.themeService.getIsDarkThemeSignal()() ? 'dark' : 'light'));


  // constructor() { //esto descomentando el otro theme , pero no funciona:(
  //   // Efecto para detectar cambios en el tema
  //   effect(() => {
  //     const isDark = this.themeService.getIsDarkThemeSignal()(); // Obtener el valor actual
  //     this.theme.set(isDark ? 'dark' : 'light');
  //   });
  // }

  // Señales y estados
  weatherData = signal<Weather[]>([]);
  selectedDetailIndex = signal<number>(0);
  currentRoute = signal<'A' | 'B'>('A');
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Propiedades computadas
  protected routeCoordinates = computed(() => ROUTE_DATA[this.currentRoute()].path);

  // Subject para manejar la destrucción de suscripciones
  private destroy$ = new Subject<void>();



  ngOnInit() {
    // La carga inicial se maneja en el setter del @Input
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadWeatherData() {
    this.isLoading.set(true);
    this.error.set(null);

    const coordinates = this.routeCoordinates();
    const weatherRequests = coordinates.map((coord) =>
      this.apiService.getWeatherData(coord.lat, coord.lng)
    );

    forkJoin(weatherRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.weatherData.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching weather data:', err);
          this.error.set('Error al cargar la información meteorológica. Por favor, inténtalo de nuevo más tarde.');
          this.isLoading.set(false);
        },
      });
  }

  protected setDetailedView(index: number) {
    this.selectedDetailIndex.set(index);
  }

  protected getWeatherIcon(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  protected formatTemperature(temp: number): string {
    return `${Math.round(temp) -273}°C`;
  }

  protected getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

    // Propiedad computada que combina weatherData con los títulos de ROUTE_DATA
    protected weatherWithTitles = computed(() => {
      const markers = ROUTE_DATA[this.currentRoute()].markers;
      const weatherDataArray = this.weatherData();
      const combined = weatherDataArray.map((weather, index) => {
        const marker = markers[index];
        return {
          weather,
          title: marker ? marker.title : weather.name, // Usa el título del marcador o el nombre del clima si no hay marcador
        };
      });
      return combined;
    });
}
