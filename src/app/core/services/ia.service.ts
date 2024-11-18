import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IpredictCronograma} from '../models/IpredictCronograma.model'

interface TrainResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly trainUrl = 'http://localhost:5000/train'; // Endpoint de entrenamiento
  private readonly predictUrl = 'http://localhost:5000/predict'; // Nuevo endpoint para predicción

    // Estructura base para los datos de predicción
    private readonly basePredictData: IpredictCronograma[] = [
        { id: 2, estacion: 'Teran', ruta: 'B', pasajeros_esperando: 0 },
        { id: 5, estacion: 'BENAVIDES', ruta: 'B', pasajeros_esperando: 0 },
        { id: 6, estacion: 'JAVIER PRADO', ruta: 'EXP1', pasajeros_esperando: 0 },
        { id: 13, estacion: 'JAVIER PRADO', ruta: 'B', pasajeros_esperando: 0 },
        { id: 20, estacion: 'Canada', ruta: 'EXP1', pasajeros_esperando: 0 },
        { id: 21, estacion: 'Canada', ruta: 'B', pasajeros_esperando: 0 },
      ];

      constructor(private http: HttpClient) {}
      
      getBasePredictData(): IpredictCronograma[] {
        return JSON.parse(JSON.stringify(this.basePredictData)); // Devuelve una copia
      }


  // Método para entrenar el modelo
  trainModel(): Observable<TrainResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Como no se requiere enviar nada en la solicitud, usamos null en el cuerpo
    return this.http.post<TrainResponse>(this.trainUrl, null, { headers });
  }

  // Método para realizar predicciones
  predict(data: IpredictCronograma[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.predictUrl, data, { headers });
  }
}
