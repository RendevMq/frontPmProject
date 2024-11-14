// src/app/core/services/api.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IDemanda } from '../models/demanda.model';
import { IEstacionesRutaDemanda } from '../models/historico.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8080/api/demandas';
  private readonly estacionesRutasUrl = 'http://localhost:8080/api/estaciones-rutas/demanda';

  demandasSignal = signal<IDemanda[]>([]);
  estacionesRutaDemandaSignal = signal<IEstacionesRutaDemanda[]>([]);

  constructor(private http: HttpClient) {
    this.loadDemandas();
    this.loadEstacionesRutaDemanda();
  }

  private getToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  private loadDemandas(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<IDemanda[]>(this.apiUrl, { headers }).subscribe((data) => {
      this.demandasSignal.set(data);
    });
  }

  private loadEstacionesRutaDemanda(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<IEstacionesRutaDemanda[]>(this.estacionesRutasUrl, { headers }).subscribe((data) => {
      this.estacionesRutaDemandaSignal.set(data);
    });
  }

  // Método para refrescar los datos de demandas manualmente
  refreshDemandas(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<IDemanda[]>(this.apiUrl, { headers }).subscribe((data) => {
      this.demandasSignal.set(data); // Actualiza el signal con los nuevos datos
    });
  }

  // Método para refrescar los datos de estaciones-rutas manualmente
  refreshEstacionesRutaDemanda(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<IEstacionesRutaDemanda[]>(this.estacionesRutasUrl, { headers }).subscribe((data) => {
      this.estacionesRutaDemandaSignal.set(data); // Actualiza el signal con los nuevos datos
    });
  }
}
