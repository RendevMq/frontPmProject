// src/app/route-data.ts
export interface MarkerData {
    position: google.maps.LatLngLiteral;
    title: string;
    description: string;
    imageUrl: string;
  }
  
  export interface RouteData {
    markers: MarkerData[];
    path: google.maps.LatLngLiteral[];
  }
  
  export const ROUTE_DATA: { [key: string]: RouteData } = {
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
        // { lat: 55.76148065460598,  lng: 37.22605946469919 },
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
  