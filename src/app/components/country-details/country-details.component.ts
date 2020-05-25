import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountriesService } from '../../services/countries.service';
import { ICountry } from '../../models/country.model';
import { VisitedCountriesService } from '../../services/visited-countries.service';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class CountryDetailsComponent implements OnInit {
  countryDetails: ICountry;
  borderCountries: ICountry[];

  isVisited = false;
  visitedCountryId: string = null;
  isLoading = false;

  constructor(private route: ActivatedRoute, private countriesService: CountriesService, private visitedCountriesService: VisitedCountriesService) {
  }

  ngOnInit(): void {
    this.getRouteParamsAndFetchCountry();
  }

  onToggleVisited(): void {
    if (this.isVisited) {
      this.removeFromVisited(this.visitedCountryId);
    } else {
      this.addToVisited(this.countryDetails);
    }
  }

  private getRouteParamsAndFetchCountry(): void {
    this.isLoading = true;
    this.route.paramMap.pipe(catchError(errorMessage => {
        return throwError(errorMessage);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(paramMap => {
      this.getCountryDetails(paramMap.get('country'));
    });
  }

  private getCountryDetails(country: string): void {
    this.isLoading = true;
    this.countriesService.getCountry(country).pipe(
      catchError(errorMessage => {
        return throwError(errorMessage);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(data => {
      this.countryDetails = data[0];
      if (this.countryDetails.borders.length > 0) {
        this.getBorderCountries(this.countryDetails.borders);
      }

      this.handleVisitedStatus(this.countryDetails);
    });
  }

  private handleVisitedStatus(currentCountry: ICountry): void {
    this.isLoading = true;
    this.visitedCountriesService.getVisitedCountries().pipe(
      catchError(errorMessage => {
        return throwError(errorMessage);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(visitedCountries => {
      if (visitedCountries) {
        this.isVisited = this.checkIfVisited(visitedCountries, currentCountry);
      }
    });
  }

  private checkIfVisited(visitedCountries: ICountry[], currentCountry: ICountry) {
    for (const key of Object.keys(visitedCountries)) {
      if (visitedCountries[key].name === currentCountry.name) {
        this.visitedCountryId = key;
        return true;
      }
    }
    return false;
  }

  private getBorderCountries(countryCodes: string[]): void {
    this.isLoading = true;
    this.countriesService.getBorderCountries(countryCodes).pipe(
      catchError(errorMessage => {
        return throwError(errorMessage);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(data => {
      this.borderCountries = data;
    });
  }

  private addToVisited(country: ICountry): void {
    this.isLoading = true;
    this.visitedCountriesService.addToVisitedList(country).pipe(
      catchError(errorMessage => {
        return throwError(errorMessage);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(res => {
      this.visitedCountryId = res.name;
      this.isVisited = true;
    });
  }

  private removeFromVisited(countryId: string) {
    this.isLoading = true;
    this.visitedCountriesService.removeFromVisitedList(countryId).pipe(
      catchError(errorMessage => {
        return throwError(errorMessage);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(() => {
      this.resetVisitedStatus();
    });
  }

  private resetVisitedStatus(): void {
    this.isVisited = false;
    this.visitedCountryId = null;
  }

}
