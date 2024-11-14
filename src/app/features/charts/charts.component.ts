import { Component } from '@angular/core';
import { IEstacionesRutaDemanda } from '../../core/models/historico.model';
import { ApiService } from '../../core/services/api.service';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { NgModel } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [NgIf,DatePipe,MatTableModule,TableModule,NgClass ,DropdownModule,PaginatorModule ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent {
  demandas: IEstacionesRutaDemanda[] = [];
  displayedColumns: string[] = ['estacion', 'ruta', 'pasajerosEsperando', 'hora', 'buses'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getEstacionesRutaDemanda().subscribe({
      next: (data) => {
        this.demandas = data;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }

}
