import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import MapaRutasComponent from './mapa-rutas/mapa-rutas.component';

@Component({
  selector: 'app-estaciones',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, MapaRutasComponent],
  templateUrl: './estaciones.component.html',
  styleUrl: './estaciones.component.scss'
})
export class EstacionesComponent {
  // Variables para almacenar los valores de los inputs
  estaciones = [
    { id: 1, B: '', EXP1: '' },
    { id: 2, B: '', EXP1: '' },
    { id: 3, B: '', EXP1: '' },
    { id: 4, B: '', EXP1: '' }
  ];
}
