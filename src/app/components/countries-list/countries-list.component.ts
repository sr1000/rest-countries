import { Component, OnInit, ViewChild } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { ICountry } from '../../models/country.model';
import { NgForm } from '@angular/forms';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss']
})
export class CountriesListComponent implements OnInit {
  @ViewChild('searchForm', {static: false}) searchForm: NgForm;
  countriesRendered: ICountry[];
  filteringOptions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  isLoading = false;
  selectedFilter = null;
  error = null;

  private countries: ICountry[];
  private countriesToRender = 20;

  constructor(private countriesService: CountriesService) {
  }

  ngOnInit(): void {
    this.getAllCountries();
  }

  onSearch(): void {
    this.selectedFilter = null;

    const searchQuery = this.searchForm.value.query;
    if (!searchQuery) {
      this.getAllCountries();
      return;
    }

    this.searchCountries(searchQuery);
  }

  onFilter(): void {
    this.searchForm.reset();

    if (this.selectedFilter === null) {
      this.getAllCountries();
    } else {
      this.isLoading = true;
      this.countriesService.filterRegion(this.selectedFilter).pipe(
        catchError(errorMessage => {
          this.error = errorMessage.error.message;
          return throwError(errorMessage);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe(data => {
        this.countries = data;

        this.resetScroll();
        this.error = null;
      });
    }
  }

  onScroll(): void {
    const countriesToAdd = this.countries.slice(this.countriesToRender, this.countriesToRender + 20);
    this.countriesToRender += 20;
    this.countriesRendered.push(...countriesToAdd);
  }

  private getAllCountries(): void {
    this.isLoading = true;
    this.countriesService.getAllCountries().pipe(
      catchError(errorMessage => {
        this.error = errorMessage.error.message;
        return throwError(errorMessage);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(data => {
      this.countries = data;
      this.countriesRendered = this.countries.slice(0, this.countriesToRender);

      this.resetScroll();
      this.error = null;
    });
  }

  private searchCountries(searchQuery: string) {
    this.isLoading = true;
    this.countriesService.getCountry(searchQuery).pipe(
      catchError(errorMessage => {
        this.error = errorMessage.error.message;
        return throwError(errorMessage);
      }),
      finalize(() => {
        this.isLoading = false;
        this.searchForm.reset();
      })
    ).subscribe(data => {
      this.countries = data;

      this.resetScroll();
      this.error = null;
    });
  }

  private resetScroll(): void {
    this.countriesToRender = 20;
    this.countriesRendered = this.countries.slice(0, this.countriesToRender);
  }

}
