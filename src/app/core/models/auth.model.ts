// src/app/core/models/auth.model.ts
export interface ILoginRequest {
    email: string;
    password: string;
  }
  
  export interface ILoginResponse {
    email: string;
    message: string;
    accessToken: string;
    status: boolean;
  }
  