import { Component, Input } from '@angular/core';
import { ICountry } from '../../../models/country.model';

@Component({
  selector: 'app-country-card',
  templateUrl: './country-card.component.html',
  styleUrls: ['./country-card.component.scss']
})
export class CountryCardComponent {
  @Input() country: ICountry;
}
