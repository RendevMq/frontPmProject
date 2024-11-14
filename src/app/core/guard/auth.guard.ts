// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authGuard: CanMatchFn = (): Observable<boolean> => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  return loginService.validateToken().pipe(
    map((isValid) => {
      console.log('Token is valid:', isValid);
      if (isValid) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
