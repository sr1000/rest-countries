import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  authForm = this.fb.group({
    email: [null],
    password: [null]
  });

  isLoading = false;
  error: string = null;

  isLoginMode = false;

  private auth$ = new Observable();

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  onSubmit(): void {
    if (!this.authForm.valid) {
      return;
    }

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    this.isLoading = true;

    if (this.isLoginMode) {
      this.auth$ = this.authService.login(email, password);
    } else {
      this.auth$ = this.authService.signup(email, password);
    }

    this.auth$.pipe(
      catchError(errorMessage => {
        this.error = errorMessage;

        return throwError(errorMessage);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(() => {
        this.router.navigate(['/']).then();
      }
    );
  }

  toggleAuthMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
  }
}
