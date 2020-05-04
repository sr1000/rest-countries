import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountriesService } from '../../countries.service';
import { ICountry } from '../../models/country.model';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class CountryDetailsComponent implements OnInit {
  countryDetails: ICountry;
  borderCountries: ICountry[];

  constructor(private route: ActivatedRoute, private countriesService: CountriesService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const country = paramMap.get('country');
      this.fetchCountry(country);
    });
  }

  private fetchCountry(country: string): void {
    this.countriesService.getCountry(country).subscribe(data => {
      this.countryDetails = data[0];
      this.fetchBorderCountries(this.countryDetails.borders);
    });
  }

  private fetchBorderCountries(countryCodes: string[]): void {
    this.countriesService.getBorderCountries(countryCodes).subscribe(data => {
      this.borderCountries = data;
    });
  }

}
