import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import MapaRutasComponent from './mapa-rutas/mapa-rutas.component';
import { ThemeService } from '../../core/services/theme.service';
import { EstacionesService } from '../../core/services/estacionesService.service';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-estaciones',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, MapaRutasComponent,NgClass],
  templateUrl: './estaciones.component.html',
  styleUrls: ['./estaciones.component.scss'],
})
export class EstacionesComponent {
  // estaciones = [
  //   { id: 1, B: '', EXP1: '', nombre: 'Teran' },
  //   { id: 2, B: '', EXP1: '', nombre: 'Benavides' },
  //   { id: 3, B: '', EXP1: '', nombre: 'Javier Prado' },
  //   { id: 4, B: '', EXP1: '', nombre: 'Canadá' }
  // ];

  private estacionesService = inject(EstacionesService);
  estaciones = this.estacionesService.estacionesData; // Mantén la referencia a la señal directamente

  theme: 'light' | 'dark';

  constructor(private themeService: ThemeService) {
    this.theme = this.themeService.isDark() ? 'dark' : 'light';

    // Efecto para actualizar el tema cuando cambia
    effect(() => {
      this.theme = this.themeService.isDark() ? 'dark' : 'light';
    });
  }

  // Método para validar la entrada
  validateInput(event: any, field: string, estacion: any, index: number) {
    const input = event.target.value;

    // Remover cualquier caracter que no sea número
    let numericValue = input.replace(/[^0-9]/g, '');

    // Limitar a 2 dígitos
    if (numericValue.length > 2) {
      numericValue = numericValue.slice(0, 2);
    }

    // Actualizar el valor en el modelo
    estacion[field] = numericValue;

    // Update the shared data in the service
    this.estacionesService.updateEstacion(index, field, numericValue);
  }

  // Método para prevenir entrada de caracteres no numéricos
  onKeyPress(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}