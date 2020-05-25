import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICountry } from '../models/country.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getAllCountries(): Observable<ICountry[]> {
    return this.http.get<ICountry[]>(`${this.API_URL}/all`);
  }

  getCountry(country: string): Observable<ICountry[]> {
    return this.http.get<ICountry[]>(`${this.API_URL}/name/${country}`);
  }

  getBorderCountries(countryCodes: string[]): Observable<ICountry[]> {
    const url = this.makeUrl('/alpha', countryCodes);
    return this.http.get<ICountry[]>(url);
  }

  filterRegion(region: string): Observable<ICountry[]> {
    return this.http.get<ICountry[]>(`${this.API_URL}/region/${region}`);
  }

  private makeUrl(resource: string, codes: string[]): string {
    let url = `${this.API_URL}${resource}`;

    url += '?codes=';
    for (const code of codes) {
      url += `${code};`;
    }
    url = url.slice(0, url.length - 1);

    return url;
  }
}

