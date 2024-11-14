// src/app/shared/components/sidebar/sidebar.component.ts

import { Component, effect, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ClickOutsideDirective } from '../../../core/directives/click-outside.service';
import { SidebarService } from '../../../core/services/sidebar.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LoginService } from '../../../core/services/login.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgFor, RouterLink, ClickOutsideDirective],
})
export class SidebarComponent  {
  sidebarHovered = false;

  // Estado del menú
  selectedOption: string | null = null;
  expandedOptions: string[] = [];
  
  selectedParentOption: string | null = null;
  lastSelectedOption: string | null = null; // Nuevo estado para el último hijo seleccionado

  evaluatedParentOption: string | null = null; // Nuevo estado para el padre en evaluación
  
// Elementos del menú
menuItems = [
  { icon: 'fas fa-th-large', name: 'Dashboard', path: '/dashboard' },
  { icon: 'fas fa-map-marker-alt', name: 'Estaciones', path: '/estaciones' },

  { icon: 'fas fa-bus', name: 'Buses', path: '/buses' },
  { icon: 'fas fa-chart-line', name: 'Predicción IA', path: null, hasSubOptions: true },
  { icon: 'far fa-circle', name: 'Entrenenar Modelo', path: '/ia/train', parent: 'Predicción IA' },
  { icon: 'far fa-circle', name: 'Cronograma', path: '/ia/predict', parent: 'Predicción IA' },
  { icon: 'fas fa-tachometer-alt', name: 'Análisis Demanda', path: '/analisisDemanda' },
];

  /*menuItems = [
    { icon: 'fas fa-th-large', name: 'Dashboard', path: '/dashboard' },


    { icon: 'fas fa-chart-bar', name: 'Charts', path: '/charts' },
    { icon: 'fas fa-edit', name: 'Forms', path: null, hasSubOptions: true },
    { icon: 'far fa-circle', name: 'Input', path: '/forms/input', parent: 'Forms' },
    { icon: 'far fa-circle', name: 'Radio', path: '/forms/radio', parent: 'Forms' },
    { icon: 'far fa-circle', name: 'Checkbox', path: '/forms/checkbox', parent: 'Forms' },
    { icon: 'fas fa-table', name: 'Tables', path: '/tables' },
    { icon: 'fas fa-edit', name: 'Tacle', path: null, hasSubOptions: true },
    { icon: 'far fa-circle', name: 'MyInput', path: '/Tacle/input', parent: 'Tacle' },
    { icon: 'far fa-circle', name: 'MyRadio', path: '/Tacle/radio', parent: 'Tacle' },
    // ... otras opciones ...
  ];*/
  

  isDarkTheme: boolean = false;

  constructor(
    public sidebarService: SidebarService,
    private themeService: ThemeService,
    private loginService: LoginService, // Inyecta LoginService
    private router: Router // Inyecta Router para la redirección

  ) {
    // Escuchar cambios en el tema
    effect(() => {
      this.isDarkTheme = this.themeService.isDark();
    });

    // Selecciona la primera opción del menú por defecto
    this.selectedOption = this.menuItems[0].name;
  }

// Estado de las opciones expandidas

/*
// Maneja la selección de una opción del menú
handleSelect(item: any): void {
  if (item.hasSubOptions) {
    this.toggleExpand(item.name); // Expande o colapsa la opción con subopciones
  } else {
    this.selectedOption = item.name;

    // Oculta el sidebar si es una pantalla pequeña
    // o si es una subopción (tiene un valor en parent)
    if ((item.parent || !item.hasSubOptions) && this.sidebarService.isSmallScreen()) {
      this.sidebarService.setSidebarVisible(false);
    }
  }
}*/

// Maneja la selección de una opción del menú
// Estado del menú

// Maneja la selección de una opción del menú
handleSelect(item: any): void {
  if (item.hasSubOptions) {
    // Establece el padre actual en evaluación y expande o contrae la opción
    this.evaluatedParentOption = item.name;
    this.toggleExpand(item.name); // Expande o colapsa al hacer clic en cualquier área del padre

  } else {
    // Si es una subopción o una opción sin hijos, selecciona y limpia la selección anterior
    this.selectedOption = item.name;
    this.selectedParentOption = item.parent || null;
    this.evaluatedParentOption = null; // Al seleccionar un hijo, limpiamos el padre en evaluación

    // Si seleccionamos una opción sin hijos, limpia la selección anterior
    if (!item.parent) {
      this.selectedParentOption = null;
      this.selectedOption = item.name;
      this.evaluatedParentOption = null;
    }

    // Oculta el sidebar si es una pantalla pequeña
    if (this.sidebarService.isSmallScreen()) {
      this.sidebarService.setSidebarVisible(false);
    }
  }
}



// Alterna la expansión de opciones
toggleExpand(optionName: string): void {
  if (this.expandedOptions.includes(optionName)) {
    this.expandedOptions = this.expandedOptions.filter((name) => name !== optionName);
  } else {
    this.expandedOptions.push(optionName);
  }
}


  // Maneja el evento de clic fuera del sidebar
  onClickedOutside(): void {
    if (this.sidebarService.isSmallScreen() && this.sidebarService.isSidebarVisible()) {
      this.sidebarService.setSidebarVisible(false);
    }
  }

  // Método de cierre de sesión
  onLogout(): void {
    console.log("Cerrando sesión...");
    
    // Llama a logout del LoginService para eliminar el token
    this.loginService.logout();
    
    // Oculta el sidebar si es pantalla pequeña
    if (this.sidebarService.isSmallScreen()) {
      this.sidebarService.setSidebarVisible(false);
    }
    
    // Redirige al usuario a la página de login
    this.router.navigate(['/login']);
  }
  
  
}
