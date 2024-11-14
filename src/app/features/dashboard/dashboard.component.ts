import { Component } from '@angular/core';
import { Chart1EstacionesDemandaComponent } from "./chart1-estaciones-demanda/chart1-estaciones-demanda.component";
import { Chart11EstacionesDemandaComponent } from "./chart1-1-estaciones-demanda/chart1-1-estaciones-demanda.component";
import { Chart2RutasDemandaComponent } from "./chart2-rutas-demanda/chart2-rutas-demanda.component";
import { Chart3EstacionDemandaComponent } from "./chart3-estacion-demanda/chart3-estacion-demanda.component";
import { InfoAboveChartsComponent } from "./info-above-charts/info-above-charts.component";
import { Chart4RutaDemandaComponent } from "./chart4-ruta-demanda/chart4-ruta-demanda.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Chart1EstacionesDemandaComponent, Chart11EstacionesDemandaComponent, Chart2RutasDemandaComponent, Chart3EstacionDemandaComponent, InfoAboveChartsComponent, Chart4RutaDemandaComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
