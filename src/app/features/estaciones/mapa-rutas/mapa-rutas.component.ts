
import { Component, OnInit, ViewChild, NgZone, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { GoogleMapsModule, MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { ROUTE_DATA,MarkerData } from './route-data';
import { ThemeService } from '../../../core/services/theme.service';
import WeatherinfoComponent from './weatherinfo/weatherinfo.component';


@Component({
  selector: 'app-route-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, WeatherinfoComponent],
  templateUrl: './mapa-rutas.component.html',
  styleUrl: './mapa-rutas.component.scss',
  animations: [
    trigger('buttonState', [
      transition('inactive => active', [
        style({ transform: 'scale(0.95)' }),
        animate('100ms', style({ transform: 'scale(1.05)' })),
        animate('100ms', style({ transform: 'scale(1)' }))
      ])
    ]),
    trigger('routeChange', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export default class MapaRutasComponent implements OnInit {
  @ViewChild('map') mapElement!: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  selectedRoute: 'A' | 'B' = 'A'; // Cambiar tipo a 'A' | 'B'
  selectedMarker: MarkerData | null = null;

  theme: 'light' | 'dark';

  mapOptions: google.maps.MapOptions = {
    center: { lat: 20.6736, lng: -103.3444 },
    zoom: 14,
    styles: this.getMapStyles('dark'), // Inicialmente en tema oscuro
    disableDefaultUI: true,
    zoomControl: true
  };

  lineOptions: google.maps.PolylineOptions = {
    strokeColor: '#00b4d8',
    strokeOpacity: 1.0,
    strokeWeight: 5
  };

  routeData = ROUTE_DATA;

  constructor(private ngZone: NgZone, private themeService: ThemeService) {
    this.theme = this.themeService.isDark() ? 'dark' : 'light';

    // Efecto para actualizar los estilos del mapa al cambiar el tema
    effect(() => {
      this.theme = this.themeService.isDark() ? 'dark' : 'light';
      this.mapOptions.styles = this.getMapStyles(this.theme);
      this.lineOptions.strokeColor = this.theme === 'dark' ? '#00b4d8' : '#0077b6';
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.selectRoute(this.selectedRoute); // Ejecuta después de 1 segundo
    }, 500); // 1000 milisegundos = 1 segundo
  }

  get currentMarkers(): MarkerData[] {
    return this.routeData[this.selectedRoute].markers;
  }

  get currentPath(): google.maps.LatLngLiteral[] {
    return this.routeData[this.selectedRoute].path;
  }

  getMarkerOptions(marker: MarkerData): google.maps.MarkerOptions {
    return {
      icon: {
        url: this.theme === 'dark'
          ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          : 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
        scaledSize: new google.maps.Size(30, 30)
      },
      title: marker.title
    };
  }

  getMapStyles(theme: 'light' | 'dark'): google.maps.MapTypeStyle[] {
    if (theme === 'dark') {
      return [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#242f3e' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#242f3e' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#746855' }]
        }
      ];
    } else {
      return [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#eaeaea' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#ffffff' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#5a5a5a' }]
        }
      ];
    }
  }

  openInfoWindow(markerRef: MapMarker, markerData: MarkerData) {
    this.selectedMarker = markerData;
    this.infoWindow.open(markerRef);
  }

  selectRoute(route: 'A' | 'B'): void {
    this.selectedRoute = route;
    this.fitBounds();
  }
  

  fitBounds() {
    if (this.mapElement && this.mapElement.googleMap) {
      const bounds = new google.maps.LatLngBounds();
      this.currentPath.forEach((point) => bounds.extend(point));
      this.mapElement.googleMap.fitBounds(bounds);
    }
  }

  trackByPosition(index: number, marker: MarkerData): string {
    return `${marker.position.lat}-${marker.position.lng}`;
  }
}
