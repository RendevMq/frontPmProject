// import { Component } from '@angular/core';
// import { ThemeService } from '../../../../core/services/theme.service';
// import { NgIf } from '@angular/common';

// @Component({
//   selector: 'app-theme-switch',
//   standalone: true,
//   imports: [NgIf],
//   template: `
// <button 
//   class="theme-switch" 
//   [class.dark]="themeService.isDark()"
//   (click)="themeService.toggleTheme()" 
//   [attr.aria-label]="themeService.isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
// >
//   <div class="switch-circle">
//     <ng-container *ngIf="themeService.isDark(); else dayMode">
//       <i class="fas fa-moon"></i>
//     </ng-container>
//     <ng-template #dayMode>
//       <i class="fas fa-sun"></i>
//     </ng-template>
//   </div>
//   <span class="switch-text">
//     {{ themeService.isDark() ? 'NIGHTMODE' : 'DAYMODE' }}
//   </span>
// </button>

//   `,
//   styles: [`
//     .theme-switch {
//   position: relative;
//   width: 110px; // Ajuste de ancho para que sea más compacto
//   height: 40px;
//   border-radius: 20px;
//   background-color: #f0f0f0;
//   border: none;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   padding: 4px;
//   transition: background-color 0.3s ease;
//   font-family: Arial, sans-serif;
//   font-size: 12px; // Texto más compacto
//   letter-spacing: -0.5px; // Reduce el espacio entre caracteres

//   &.dark {
//     background-color: #333;

//     .switch-circle {
//       transform: translateX(70px); // Mueve el círculo a la derecha en modo oscuro
//       background-color: #444;
//     }

//     .switch-text {
//       color: white;
//       transform: translateX(-15px); // Ajusta la posición del texto en modo oscuro
//     }
//   }

//   .switch-circle {
//     position: absolute;
//     top: 4px;
//     left: 4px;
//     width: 32px;
//     height: 32px;
//     background-color: white;
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: transform 0.3s ease;
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

//     i {
//       font-size: 16px;
//       color: #333;

//       &.fa-moon {
//         color: #fff;
//       }
//     }
//   }

//   .switch-text {
//     // margin-left: 48px;
//     //     font-weight: 600;
//     //     color: #1a1a1a;
//     //     text-transform: uppercase;
//     //     transition: color 0.3s ease;
//     letter-spacing: 0.1px;
//         font-size: 10px;
//     flex: 1;
//     text-align: center;
//     font-weight: 600;
//     color: #333;
//     text-transform: uppercase;
//     transition: color 0.3s ease, transform 0.3s ease;
//     transform: translateX(15px); // Ajusta la posición del texto en modo claro
//   }

//   &:hover .switch-circle {
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
//   }
// }

//   `]
// })
// export class ThemeSwitchComponent {
//   constructor(public themeService: ThemeService) {}
// }

import { Component } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  imports: [NgIf],
  template: `
<button 
  class="theme-switch" 
  [class.dark]="themeService.isDark()"
  (click)="themeService.toggleTheme()" 
  [attr.aria-label]="themeService.isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
  <div class="switch-circle">
    <ng-container *ngIf="themeService.isDark(); else dayMode">
      <i class="fas fa-moon"></i>
    </ng-container>
    <ng-template #dayMode>
      <i class="fas fa-sun"></i>
    </ng-template>
  </div>
</button>
  `,
  styles: [`
    .theme-switch {
      position: relative;
      width: 60px; // Ajuste de ancho para que solo ocupe el espacio del círculo
      height: 32px; // Ajuste de altura para que sea más compacto
      border-radius: 16px;
      background-color: #f0f0f0;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 4px;
      transition: background-color 0.3s ease;
      font-family: Arial, sans-serif;

      &.dark {
        background-color: #333;

        .switch-circle {
          transform: translateX(28px); // Mueve el círculo completamente a la derecha en modo oscuro
          background-color: #444;
        }
      }

      .switch-circle {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 28px;
        height: 28px;
        background-color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

        i {
          font-size: 14px;
          color: #333;

          &.fa-moon {
            color: #fff;
          }
        }
      }

      &:hover .switch-circle {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
    }
  `]
})
export class ThemeSwitchComponent {
  constructor(public themeService: ThemeService) {}
}
