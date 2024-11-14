// src/app/core/services/sidebar.service.ts

import { Injectable, effect, signal } from '@angular/core';
import { WindowSizeService } from './window-size.service';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  // Signals para estados del sidebar
  isSidebarCollapsed = signal(false);
  isSidebarVisible = signal(false);
  isSmallScreen = signal(false);
  private previousWidth: number;


  constructor(private windowSizeService: WindowSizeService) {

    this.previousWidth = this.windowSizeService.width()
    //ERROR
    // effect(() => {
    //   const width = this.windowSizeService.width();
    //   this.isSmallScreen.set(width < 1000);
    
    //   if (width >= 1000) {
    //     this.isSidebarVisible.set(false);
    //   }
    // });
    

    // Efecto para actualizar isSmallScreen cuando cambia el tamaño de la ventana
    effect(
      () => {
        const width = this.windowSizeService.width();
        this.isSmallScreen.set(width < 1000);

        if (width >= 1000) {
          this.isSidebarVisible.set(false);
        }

        // Comprueba si el ancho ha cambiado de pequeño a grande
        if (this.previousWidth <= 1000 && width > 1000) {
          // La pantalla ha pasado de ser pequeña a grande
          this.isSidebarCollapsed.set(false);
        }

        // Actualiza previousWidth para la próxima comparación
        this.previousWidth = width;
      },
      { allowSignalWrites: true } // Permite escribir en señales dentro del efecto
    );
  }

  

  // Método para alternar el estado del sidebar
  toggleSidebar() {
    if (this.isSmallScreen()) {
            // console.log('this.isSidebarCollapsed: ' + this.isSidebarCollapsed);
      // console.log('this.isSidebarVisible: ' + this.isSidebarVisible);
      // console.log('this.isSmallScreen: ' + this.isSmallScreen);
      this.isSidebarCollapsed = signal(false);
      this.isSidebarVisible.set(!this.isSidebarVisible());
    } else {
      this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
    }
  }

  // Método para establecer la visibilidad del sidebar
  setSidebarVisible(visible: boolean) {
    this.isSidebarVisible.set(visible);
  }

  // Método para manejar clics fuera del sidebar en pantallas pequeñas
  handleOutsideClick(targetElement: HTMLElement) {
    if (
      this.isSmallScreen() &&
      this.isSidebarVisible() &&
      !targetElement.closest('.sidebar')
    ) {
      this.isSidebarVisible.set(false);
    }
  }
}
