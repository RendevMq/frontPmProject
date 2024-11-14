// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EstacionesComponent } from './features/estaciones/estaciones.component';
import { BusesComponent } from './features/buses/buses.component';
import { AnalisisDemandaComponent } from './features/analisis-demanda/analisis-demanda.component';
import { PredictComponent } from './features/predict-ia-section/predict/predict.component';
import { TrainComponent } from './features/predict-ia-section/train/train.component';
import { authGuard } from './core/guard/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: '',
    component: LayoutComponent,
    canMatch: [authGuard], // Aplica el guard de autenticación
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard',
      },
      {
        path: 'estaciones',
        component: EstacionesComponent,
        title: 'Estaciones',
      },
      {
        path: 'buses',
        component: BusesComponent,
        title: 'Buses',
      },
      {
        path: 'ia/train',
        component: TrainComponent,
        title: 'Train - IA',
      },
      {
        path: 'ia/predict',
        component: PredictComponent,
        title: 'Predict - IA',
      },
      {
        path: 'analisisDemanda',
        component: AnalisisDemandaComponent,
        title: 'Análisis Demanda',
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login', // Redirige a login si ninguna ruta coincide
  },
];
