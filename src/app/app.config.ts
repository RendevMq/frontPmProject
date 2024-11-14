import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { GoogleMapsModule } from '@angular/google-maps';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(HttpClientModule),  // Configura el HttpClient global
    provideAnimationsAsync(), // Configura animaciones asincrónicas
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(
      MatTableModule, 
      MatIconModule, 
      TableModule, 
      DropdownModule, 
      PaginatorModule
    )
  ]
};
