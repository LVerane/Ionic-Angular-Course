import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { key } from '../../environments/environment-api';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userIsAuthenticated = false;
  private _userId = null;

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key.firebase_key}`,
      { email: email, password: password, returnSecureToken: true }
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key.firebase_key}`,
      { email: email, password: password, returnSecureToken: true }
    );
  }

  logout() {
    this._userIsAuthenticated = false;
  }
}
