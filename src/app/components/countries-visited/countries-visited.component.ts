import { Component, OnInit } from '@angular/core';
import { ICountry } from '../../models/country.model';
import { VisitedCountriesService } from '../../services/visited-countries.service';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-countries-visited',
  templateUrl: './countries-visited.component.html',
  styleUrls: ['./countries-visited.component.scss']
})
export class CountriesVisitedComponent implements OnInit {
  countriesVisited: ICountry[];
  isLoading = false;

  constructor(private visitedCountriesService: VisitedCountriesService) {
  }

  ngOnInit(): void {
    this.getVisitedCountries();
  }

  private getVisitedCountries(): void {
    this.isLoading = true;
    this.visitedCountriesService.getVisitedCountries().pipe(
      catchError(errorMessage => {
        return throwError(errorMessage);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(data => this.countriesVisited = data);
  }

}
