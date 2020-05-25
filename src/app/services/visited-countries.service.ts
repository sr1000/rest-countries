import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ICountry } from '../models/country.model';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitedCountriesService {
  private FIREBASE_URL = environment.firebaseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getVisitedCountries(): Observable<ICountry[]> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.get<ICountry[]>(`${this.FIREBASE_URL}/visited/${user.id}.json`,
          {params: new HttpParams().set('auth', user.token)});
      }));
  }

  addToVisitedList(country: ICountry): Observable<ICountry> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.post<ICountry>(`${this.FIREBASE_URL}/visited/${user.id}.json`,
          country, {params: new HttpParams().set('auth', user.token)});
      }));
  }

  removeFromVisitedList(countryId: string): any {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.delete(`${this.FIREBASE_URL}/visited/${user.id}/${countryId}.json`,
          {params: new HttpParams().set('auth', user.token)});
      })
    );
  }
}
