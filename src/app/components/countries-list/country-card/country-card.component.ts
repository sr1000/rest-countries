import { Component, Input, OnInit } from '@angular/core';
import { ICountry } from '../../../models/country.model';

@Component({
  selector: 'app-country-card',
  templateUrl: './country-card.component.html',
  styleUrls: ['./country-card.component.scss']
})
export class CountryCardComponent implements OnInit {
  @Input() country: ICountry;

  constructor() {
  }

  ngOnInit() {
  }

}
