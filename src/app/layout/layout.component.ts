import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { NgClass } from '@angular/common';
import { SidebarService } from '../core/services/sidebar.service';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RouterOutlet, NgClass],
})
export class LayoutComponent implements OnInit {
  constructor(
    public sidebarService: SidebarService,
    public themeService: ThemeService, // Inyecta el servicio de tema
    private router: Router // Inyecta el servicio Router
  ) {}

  ngOnInit(): void {
        // Redirigir al Dashboard en cada actualización
        this.router.navigate(['/dashboard']);
  }

  toggleTheme() {
    this.themeService.toggleTheme(); // Cambia el tema cuando se llama este método
  }
}
