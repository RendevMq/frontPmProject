// import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { trigger, transition, style, animate } from '@angular/animations';
// import { GoogleMapsModule, MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';

// interface MarkerData {
//   position: google.maps.LatLngLiteral;
//   title: string;
//   description: string;
//   imageUrl?: string;
// }

// @Component({
//   selector: 'app-route-map',
//   standalone: true,
//   imports: [CommonModule, GoogleMapsModule],
//   template: `
//     <div class="map-container">
//       <h1 class="map-title">Mapa de Estaciones y Rutas cubiertas</h1>
      
//       <div class="content-wrapper">
//         <div class="map-wrapper">
//           <google-map
//             #map
//             [options]="mapOptions"
//             class="google-map"
//           >
//             <ng-container *ngFor="let marker of currentMarkers; trackBy: trackByPosition">
//               <map-marker
//                 #markerRef="mapMarker"
//                 [position]="marker.position"
//                 [options]="getMarkerOptions(marker)"
//                 (mapClick)="openInfoWindow(markerRef, marker)"
//               ></map-marker>
//             </ng-container>
//             <map-polyline
//               [path]="currentPath"
//               [options]="lineOptions"
//             ></map-polyline>
//             <map-info-window>
//             <div class="info-window-content">
//   <h3>{{ selectedMarker?.title }}</h3>
//   <p>{{ selectedMarker?.description }}</p>
//   <ng-container *ngIf="selectedMarker && selectedMarker.imageUrl">
//     <img [src]="selectedMarker.imageUrl" alt="{{ selectedMarker.title }}" style="width: 100%; height: auto;" />
//   </ng-container>
// </div>

//             </map-info-window>
//           </google-map>
//         </div>

//         <div class="sidebar">
//           <div class="route-selector">
//             <h2>Selección de Ruta</h2>
//             <div class="route-buttons">
//               <button
//                 [class.active]="selectedRoute === 'A'"
//                 (click)="selectRoute('A')"
//                 class="route-button"
//                 [@buttonState]="selectedRoute === 'A' ? 'active' : 'inactive'"
//               >
//                 Ruta A
//               </button>
//               <button
//                 [class.active]="selectedRoute === 'B'"
//                 (click)="selectRoute('B')"
//                 class="route-button"
//                 [@buttonState]="selectedRoute === 'B' ? 'active' : 'inactive'"
//               >
//                 Ruta B
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .map-container {
//       height: 100vh;
//       width: 100%;
//       background-color: #1a1a1a;
//       color: white;
//       display: flex;
//       flex-direction: column;
//     }

//     .map-title {
//       text-align: center;
//       padding: 1rem;
//       margin: 0;
//       font-size: 1.5rem;
//       background-color: #2a2a2a;
//     }

//     .content-wrapper {
//       display: flex;
//       flex: 1;
//       gap: 1rem;
//       padding: 1rem;
//     }

//     .map-wrapper {
//       flex: 1;
//       border-radius: 12px;
//       overflow: hidden;
//       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//     }

//     .google-map {
//       height: 100%;
//       width: 100%;
//     }

//     .sidebar {
//       width: 300px;
//       background-color: #2a2a2a;
//       border-radius: 12px;
//       padding: 1.5rem;
//     }

//     .route-selector h2 {
//       margin: 0 0 1rem 0;
//       font-size: 1.2rem;
//     }

//     .route-buttons {
//       display: flex;
//       gap: 1rem;
//     }

//     .route-button {
//       flex: 1;
//       padding: 0.75rem;
//       border: none;
//       border-radius: 8px;
//       background-color: #3a3a3a;
//       color: white;
//       cursor: pointer;
//       transition: all 0.3s ease;
//     }

//     .route-button:hover {
//       background-color: #4a4a4a;
//     }

//     .route-button.active {
//       background-color: #00b4d8;
//       color: #1a1a1a;
//     }

//     .info-window-content {
//       color: #333;
//       padding: 5px;
//     }

//     .info-window-content h3 {
//       margin: 0 0 5px 0;
//     }

//     .info-window-content p {
//       margin: 0;
//     }
//   `],
//   animations: [
//     trigger('buttonState', [
//       transition('inactive => active', [
//         style({ transform: 'scale(0.95)' }),
//         animate('100ms', style({ transform: 'scale(1.05)' })),
//         animate('100ms', style({ transform: 'scale(1)' }))
//       ])
//     ]),
//     trigger('routeChange', [
//       transition(':enter', [
//         style({ opacity: 0 }),
//         animate('300ms', style({ opacity: 1 }))
//       ])
//     ])
//   ]
// })
// export default class MapaRutasComponent implements OnInit {
//   @ViewChild('map') mapElement!: GoogleMap;
//   @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

//   selectedRoute = 'A';
//   selectedMarker: MarkerData | null = null;

//   mapOptions: google.maps.MapOptions = {
//     center: { lat: 20.6736, lng: -103.3444 },
//     zoom: 14,
//     styles: [
//       {
//         featureType: 'all',
//         elementType: 'geometry',
//         stylers: [{ color: '#242f3e' }]
//       },
//       {
//         featureType: 'all',
//         elementType: 'labels.text.stroke',
//         stylers: [{ color: '#242f3e' }]
//       },
//       {
//         featureType: 'all',
//         elementType: 'labels.text.fill',
//         stylers: [{ color: '#746855' }]
//       }
//     ],
//     disableDefaultUI: true,
//     zoomControl: true
//   };

//   lineOptions: google.maps.PolylineOptions = {
//     strokeColor: '#00b4d8',
//     strokeOpacity: 1.0,
//     strokeWeight: 5
//   };

//   routeData: { [key: string]: { markers: MarkerData[]; path: google.maps.LatLng[] } } = {
//     'A': {
//       markers: [
//         {
//           position: { lat: 20.6736, lng: -103.3444 },
//           title: 'Inicio Ruta A',
//           description: 'Punto de partida de la Ruta A',
//           imageUrl: 'https://example.com/image1.jpg'
//         },
//         {
//           position: { lat: 20.6836, lng: -103.3544 },
//           title: 'Punto Intermedio A',
//           description: 'Parada intermedia en la Ruta A',
//           imageUrl: 'https://example.com/image2.jpg'
//         },
//         {
//           position: { lat: 20.6936, lng: -103.3644 },
//           title: 'Fin Ruta A',
//           description: 'Destino final de la Ruta A',
//           imageUrl: 'https://example.com/image3.jpg'
//         }
//       ],
//       path: []
//     },
//     'B': {
//       markers: [
//         {
//           position: { lat: 20.6736, lng: -103.3444 },
//           title: 'Inicio Ruta B',
//           description: 'Punto de partida de la Ruta B',
//           imageUrl: 'https://example.com/image4.jpg'
//         },
//         {
//           position: { lat: 20.6886, lng: -103.3594 },
//           title: 'Punto Intermedio B',
//           description: 'Parada intermedia en la Ruta B',
//           imageUrl: 'https://example.com/image5.jpg'
//         },
//         {
//           position: { lat: 20.7036, lng: -103.3744 },
//           title: 'Fin Ruta B',
//           description: 'Destino final de la Ruta B',
//           imageUrl: 'https://example.com/image6.jpg'
//         }
//       ],
//       path: []
//     }
//   };

//   constructor(private ngZone: NgZone) {}

//   ngOnInit() {
//     this.selectRoute(this.selectedRoute);
//   }

//   get currentMarkers(): MarkerData[] {
//     return this.routeData[this.selectedRoute].markers;
//   }

//   get currentPath(): google.maps.LatLng[] {
//     return this.routeData[this.selectedRoute].path;
//   }

//   getMarkerOptions(marker: MarkerData): google.maps.MarkerOptions {
//     return {
//       icon: {
//         url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
//         scaledSize: new google.maps.Size(30, 30)
//       },
//       title: marker.title
//     };
//   }

//   openInfoWindow(markerRef: MapMarker, markerData: MarkerData) {
//     this.selectedMarker = markerData;
//     this.infoWindow.open(markerRef);
//   }

//   selectRoute(route: string) {
//     this.selectedRoute = route;
//     this.calculateAndDisplayRoute();
//   }

//   calculateAndDisplayRoute() {
//     const directionsService = new google.maps.DirectionsService();

//     const waypoints = this.currentMarkers.slice(1, -1).map(marker => ({
//       location: marker.position,
//       stopover: true
//     }));

//     directionsService.route(
//       {
//         origin: this.currentMarkers[0].position,
//         destination: this.currentMarkers[this.currentMarkers.length - 1].position,
//         waypoints: waypoints,
//         travelMode: google.maps.TravelMode.DRIVING
//       },
//       (response, status) => {
//         if (status === google.maps.DirectionsStatus.OK && response) {
//           this.ngZone.run(() => {
//             // Asigna overview_path directamente al path
//             this.routeData[this.selectedRoute].path = response.routes[0].overview_path;
//             // Ajusta los límites del mapa para mostrar toda la ruta
//             this.fitBounds(response.routes[0].bounds);
//           });
//         } else {
//           console.error('La solicitud de direcciones falló debido a ' + status);
//         }
//       }
//     );
//   }

//   fitBounds(bounds: google.maps.LatLngBounds) {
//     if (this.mapElement && this.mapElement.googleMap) {
//       this.mapElement.googleMap.fitBounds(bounds);
//     }
//   }

//   trackByPosition(index: number, marker: MarkerData): string {
//     return `${marker.position.lat}-${marker.position.lng}`;
//   }
// }

import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { GoogleMapsModule, MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';

interface MarkerData {
  position: google.maps.LatLngLiteral;
  title: string;
  description: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-route-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
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

  selectedRoute = 'A';
  selectedMarker: MarkerData | null = null;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 20.6736, lng: -103.3444 },
    zoom: 14,
    styles: [
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
    ],
    disableDefaultUI: true,
    zoomControl: true
  };

  lineOptions: google.maps.PolylineOptions = {
    strokeColor: '#00b4d8',
    strokeOpacity: 1.0,
    strokeWeight: 5
  };

  routeData: { [key: string]: { markers: MarkerData[]; path: google.maps.LatLngLiteral[] } } = {
    'A': {
      markers: [
        { position: { lat: -12.16835, lng: -77.01876 }, title: 'Estación Teran', description: 'Paseo De La Republica, Chorrillos 15064', imageUrl: 'assets/teran.jpg' },
        { position: { lat: -12.12513,  lng: -77.0242 }, title: 'Estación Benavides', description: 'Vía Expresa Luis Fernán Bedoya Reyes, Miraflores 15047', imageUrl: 'assets/bernavides.jpg' },
        { position: { lat: -12.09057, lng:  -77.02274 }, title: 'Estación Javier Prado', description: 'Av. Javier Prado Este, Lince 15034', imageUrl: 'assets/javierprado.jpg' },
        { position: { lat: -12.08224,  lng:  -77.02667 }, title: 'Estación Canadá', description: 'Vía Expresa Luis Fernán Bedoya Reyes, La Victoria 15046', imageUrl: 'assets/canada.jpg' },
        { position: { lat:-11.98047, lng:  -77.05921 }, title: 'Terminal Naranjal', description: 'Av. Túpac Amaru S/N, San Martín de Porres 15311', imageUrl: 'assets/naranjal.jpeg' },
      ],
      path: [
        { lat: -12.16835, lng: -77.01876 },
        { lat: -12.12513,  lng: -77.0242 },
        { lat: -12.09057, lng:  -77.02274 },
        { lat: -12.08224,  lng:  -77.02667 },
        { lat:-11.98047, lng:  -77.05921 }

      ]
    },
    'B': {
      markers: [
        { position: { lat: -12.09057, lng:  -77.02274 }, title: 'Estación Javier Prado', description: 'Av. Javier Prado Este, Lince 15034', imageUrl: 'assets/javierprado.jpg' },
        { position: { lat: -12.08224,  lng:  -77.02667 }, title: 'Estación Canadá', description: 'Vía Expresa Luis Fernán Bedoya Reyes, La Victoria 15046', imageUrl: 'assets/canada.jpg' },
        { position: { lat:-11.98047, lng:  -77.05921 }, title: 'Terminal Naranjal', description: 'Av. Túpac Amaru S/N, San Martín de Porres 15311', imageUrl: 'assets/naranjal.jpeg' },
      ],
      path: [
        { lat: -12.09057, lng:  -77.02274 },
        { lat: -12.08224,  lng:  -77.02667 },
        { lat:-11.98047, lng:  -77.05921 }
      ]
    }
  };

  constructor(private ngZone: NgZone) {}

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
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new google.maps.Size(30, 30)
      },
      title: marker.title
    };
  }

  openInfoWindow(markerRef: MapMarker, markerData: MarkerData) {
    this.selectedMarker = markerData;
    this.infoWindow.open(markerRef);
  }

  selectRoute(route: string) {
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

