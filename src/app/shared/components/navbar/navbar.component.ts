import { Component, effect, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { SidebarService } from '../../../core/services/sidebar.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ThemeSwitchComponent } from "./theme-switch-component/theme-switch-component.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [NgClass, ThemeSwitchComponent],
})
export class NavbarComponent {
  isDarkTheme: boolean = false;

  constructor(
    public sidebarService: SidebarService,
    public themeService: ThemeService
  ) {
    // Utilizar `effect` para escuchar el cambio de tema
    effect(() => {
      this.isDarkTheme = this.themeService.isDark();
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
