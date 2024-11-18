import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IDemanda } from '../models/demanda.model';
import { IEstacionesRutaDemanda } from '../models/historico.model';
import { ICronogramaHistorico } from '../models/cronograma.model';
import { IBusInfoEstado } from '../models/bus.model';
import { Weather } from '../models/weather.model'; // Asegúrate de importar la interfaz Weather
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8080/api/demandas';
  private readonly estacionesRutasUrl = 'http://localhost:8080/api/estaciones-rutas/demanda';
  private readonly cronogramasUrl = 'http://localhost:8080/api/cronogramas/detalle';
  private readonly ultimaSalidaUrl = 'http://localhost:8080/api/cronogramas/ultima-salida'; // Nuevo endpoint
  private readonly busesUrl = 'http://localhost:8080/api/buses';
  private readonly weatherUrl = 'http://localhost:8080/weather'; // Nuevo endpoint

  demandasSignal = signal<IDemanda[]>([]);
  estacionesRutaDemandaSignal = signal<IEstacionesRutaDemanda[]>([]);
  cronogramasSignal = signal<ICronogramaHistorico[]>([]);
  ultimaSalidaSignal = signal<ICronogramaHistorico[]>([]); // Nueva señal
  busesSignal = signal<IBusInfoEstado[]>([]);

  constructor(private http: HttpClient) {
    this.loadDemandas();
    this.loadEstacionesRutaDemanda();
    this.loadCronogramas();
    this.loadUltimaSalida(); // Cargar última salida al iniciar
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

  private loadUltimaSalida(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<ICronogramaHistorico[]>(this.ultimaSalidaUrl, { headers }).subscribe((data) => {
      this.ultimaSalidaSignal.set(data); // Guardar en la señal correspondiente
    });
  }

  private loadBuses(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<IBusInfoEstado[]>(this.busesUrl, { headers }).subscribe((data) => {
      this.busesSignal.set(data);
    });
  }

  // Nuevo método para obtener los datos del clima
  // getWeatherData(lat: number, lon: number): void {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.getToken()}`,
  //   });

  //   const body = { lat, lon }; // El cuerpo de la solicitud

  //   this.http.post<Weather>(this.weatherUrl, body, { headers }).subscribe(
  //     (data) => {
  //       console.log('Weather data:', data); // Aquí puedes hacer lo que necesites con los datos
  //     },
  //     (error) => {
  //       console.error('Error al obtener los datos del clima', error);
  //     }
  //   );
  // }
  getWeatherData(lat: number, lon: number): Observable<Weather> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    const body = { lat, lon }; // El cuerpo de la solicitud

    return this.http.post<Weather>(this.weatherUrl, body, { headers });
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

  refreshUltimaSalida(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<ICronogramaHistorico[]>(this.ultimaSalidaUrl, { headers }).subscribe((data) => {
      this.ultimaSalidaSignal.set(data);
    });
  }

  refreshBuses(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<IBusInfoEstado[]>(this.busesUrl, { headers }).subscribe((data) => {
      this.busesSignal.set(data);
    });
  }
}


/*

import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IDemanda } from '../models/demanda.model';
import { IEstacionesRutaDemanda } from '../models/historico.model';
import { ICronogramaHistorico } from '../models/cronograma.model';
import { IBusInfoEstado } from '../models/bus.model';
import { Weather } from '../models/weather.model'; // Asegúrate de importar la interfaz Weather

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8080/api/demandas';
  private readonly estacionesRutasUrl = 'http://localhost:8080/api/estaciones-rutas/demanda';
  private readonly cronogramasUrl = 'http://localhost:8080/api/cronogramas/detalle';
  private readonly busesUrl = 'http://localhost:8080/api/buses';
  private readonly weatherUrl = 'http://localhost:8080/weather'; // Nuevo endpoint

  demandasSignal = signal<IDemanda[]>([]);
  estacionesRutaDemandaSignal = signal<IEstacionesRutaDemanda[]>([]);
  cronogramasSignal = signal<ICronogramaHistorico[]>([]);
  busesSignal = signal<IBusInfoEstado[]>([]);

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

  private loadBuses(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<IBusInfoEstado[]>(this.busesUrl, { headers }).subscribe((data) => {
      this.busesSignal.set(data);
    });
  }

  // Nuevo método para obtener los datos del clima
  getWeatherData(lat: number, lon: number): Observable<Weather> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    const body = { lat, lon }; // El cuerpo de la solicitud

    return this.http.post<Weather>(this.weatherUrl, body, { headers });
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

  refreshBuses(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http.get<IBusInfoEstado[]>(this.busesUrl, { headers }).subscribe((data) => {
      this.busesSignal.set(data);
    });
  }
}

*/