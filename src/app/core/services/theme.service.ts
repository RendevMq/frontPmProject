import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'selected-theme';
  private isDarkTheme = signal<boolean>(this.getInitialTheme());


  // Exponer la señal
  getIsDarkThemeSignal(): Signal<boolean> {
    return this.isDarkTheme;
  }

  constructor() {
    // Aplicar el tema inicial
    this.applyTheme(this.isDarkTheme());
  }

  private getInitialTheme(): boolean {
    // Verificar si hay un tema guardado
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Si no hay tema guardado, usar la preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme() {
    this.isDarkTheme.update(dark => !dark);
    this.applyTheme(this.isDarkTheme());
  }

  private applyTheme(isDark: boolean) {
    document.documentElement.classList.toggle('dark-theme', isDark);
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
  }

  isDark(): boolean {
    return this.isDarkTheme(); // Devuelve el valor booleano, no el signal directamente
  }
}
