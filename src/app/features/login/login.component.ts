// src/app/core/components/login/login.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../core/services/login.service';
import { ILoginRequest } from '../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService // Inyecta el LoginService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.loginForm.get(field);
    return !!formControl && formControl.invalid && (formControl.dirty || formControl.touched);
  }


async onSubmit() {
  if (this.loginForm.valid) {
    this.isLoading = true;
    const credentials: ILoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    
    try {
      const response = await this.loginService.login(credentials);
      if (response.status) {
        // console.log('Login successful:', response);
        // Redirige a la página principal después del inicio de sesión exitoso
        this.router.navigateByUrl('/dashboard');
      } else {
        console.error('Login failed:', response.message);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  } else {
    // Marca todos los campos como tocados para mostrar errores
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}

}
