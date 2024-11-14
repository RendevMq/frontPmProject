// src/app/core/services/login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILoginRequest, ILoginResponse } from '../models/auth.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly authUrl = 'http://localhost:8080/auth/log-in';
  private readonly validateUrl = 'http://localhost:8080/auth/validate';

  constructor(private http: HttpClient) {}

  login(credentials: ILoginRequest): Promise<ILoginResponse> {
    return new Promise((resolve, reject) => {
      this.http.post<ILoginResponse>(this.authUrl, credentials).subscribe({
        next: (response) => {
          if (response.accessToken) {
            localStorage.setItem('authToken', response.accessToken); // Guarda el token en localStorage
          }
          resolve(response);
        },
        error: (error) => reject(error),
      });
    });
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Elimina el token de localStorage
  }

  validateToken(): Observable<boolean> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return of(false); // Retorna false si no hay token
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    console.log('Token enviado:', token); // Agrega este log para verificar el token
  
    return this.http.get(this.validateUrl, { headers }).pipe(
      map(() => {
        console.log('Token válido'); // Log para cuando el token es válido
        return true;
      }),
      catchError((error) => {
        console.error('Error de validación de token:', error); // Log para cuando hay error
        return of(false);
      })
    );
  }
  
}
