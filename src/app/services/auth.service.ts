import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { IAuthResponse } from '../models/auth-response.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user = new BehaviorSubject<User>(null);

  private FIREBASE_KEY = environment.firebaseKey;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  signup(email: string, password: string): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.FIREBASE_KEY}`, {
        email,
        password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError), tap(res => this.handleAuthenticationData(res.email, res.localId, res.idToken, +res.expiresIn)));
  }

  login(email: string, password: string): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.FIREBASE_KEY}`, {
        email,
        password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError), tap(res => this.handleAuthenticationData(res.email, res.localId, res.idToken, +res.expiresIn)));
  }

  logout(): void {
    this.resetUserData();
    this.resetTokenExpirationTimer();
    this.router.navigate(['/auth']).then();
  }

  autoLogin(): void {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if (loadedUser.token) {
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
      this.user.next(loadedUser);
    }
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'A user with this email already exists.';
        break;
      case 'WEAK_PASSWORD : Password should be at least 6 characters':
        errorMessage = 'Password should be at least 6 characters long.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'User not found.';
        break;
      case 'INVALID_EMAIL':
        errorMessage = 'Invalid email.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid user credentials.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER : Too many unsuccessful login attempts. Please try again later.':
        errorMessage = 'Too many unsuccessful login attempts. Please try again later.';
        break;
    }

    return throwError(errorMessage);
  }

  private handleAuthenticationData(email: string, id: string, token: string, expiresIn: number): void {
    const tokenExpirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    const userData = new User(email, id, token, tokenExpirationDate);
    this.user.next(userData);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  private resetTokenExpirationTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  private resetUserData(): void {
    this.user.next(null);
    localStorage.removeItem('userData');
  }
}
