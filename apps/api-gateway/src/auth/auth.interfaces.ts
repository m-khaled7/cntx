import type { Metadata } from '@grpc/grpc-js';
import type { Observable } from 'rxjs';

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    refreshToken: string;
    accessToken: string;
}

export type EmptyRequest = Record<string, never>;
export type EmptyResponse = Record<string, never>;

export interface IamAuthServiceClient {
    register(dto: RegisterRequest): Observable<AuthResponse>;
    login(dto: LoginRequest): Observable<AuthResponse>;
    refreshToken(dto: EmptyRequest, metadata: Metadata): Observable<AuthResponse>;
    logout(dto: EmptyRequest, metadata: Metadata): Observable<EmptyResponse>;
}

