// src/app/core/services/api.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IDemanda } from '../models/demanda.model';
import { IEstacionesRutaDemanda } from '../models/historico.model';
import { ICronogramaHistorico } from '../models/cronograma.model';
import { IBusInfoEstado } from '../models/bus.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8080/api/demandas';
  private readonly estacionesRutasUrl = 'http://localhost:8080/api/estaciones-rutas/demanda';
  private readonly cronogramasUrl = 'http://localhost:8080/api/cronogramas/detalle';
  private readonly busesUrl = 'http://localhost:8080/api/buses'; // Nuevo endpoint

  demandasSignal = signal<IDemanda[]>([]);
  estacionesRutaDemandaSignal = signal<IEstacionesRutaDemanda[]>([]);
  cronogramasSignal = signal<ICronogramaHistorico[]>([]);
  busesSignal = signal<IBusInfoEstado[]>([]); // Nuevo signal para buses

  constructor(private http: HttpClient) {
    this.loadDemandas();
    this.loadEstacionesRutaDemanda();
    this.loadCronogramas();
    this.loadBuses(); // Cargar buses al iniciar
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

  private loadCronogramas(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<ICronogramaHistorico[]>(this.cronogramasUrl, { headers }).subscribe((data) => {
      this.cronogramasSignal.set(data);
    });
  }

  // Método para cargar los datos de buses
  private loadBuses(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<IBusInfoEstado[]>(this.busesUrl, { headers }).subscribe((data) => {
      this.busesSignal.set(data); // Guarda los datos en el signal
    });
  }

  refreshDemandas(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<IDemanda[]>(this.apiUrl, { headers }).subscribe((data) => {
      this.demandasSignal.set(data);
    });
  }

  refreshEstacionesRutaDemanda(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<IEstacionesRutaDemanda[]>(this.estacionesRutasUrl, { headers }).subscribe((data) => {
      this.estacionesRutaDemandaSignal.set(data);
    });
  }

  refreshCronogramas(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<ICronogramaHistorico[]>(this.cronogramasUrl, { headers }).subscribe((data) => {
      this.cronogramasSignal.set(data);
    });
  }

  // Método para refrescar los datos de buses manualmente
  refreshBuses(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<IBusInfoEstado[]>(this.busesUrl, { headers }).subscribe((data) => {
      this.busesSignal.set(data); // Actualiza el signal con los nuevos datos
    });
  }
}
