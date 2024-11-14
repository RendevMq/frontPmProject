import { Component, inject } from '@angular/core';
import { IDemanda } from '../../core/models/demanda.model';
import { ApiService } from '../../core/services/api.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [NgIf,NgFor,DatePipe],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {
  demandas: IDemanda[] = []; // Array de demandas

  private apiService = inject(ApiService); // Inyección del servicio API

  ngOnInit() {
    // Llamada para obtener las demandas
    this.apiService.getDemandas().subscribe(
      (data) => {
        this.demandas = data; // Guarda la respuesta en `demandas`
      },
      (error) => {
        console.error('Error al obtener demandas:', error); // Manejo de errores
      }
    );
  }
}
