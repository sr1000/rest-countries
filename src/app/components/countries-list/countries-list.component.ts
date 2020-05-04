import { Component, OnInit, ViewChild } from '@angular/core';
import { CountriesService } from '../../countries.service';
import { ICountry } from '../../models/country.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss']
})
export class CountriesListComponent implements OnInit {
  @ViewChild('searchForm', {static: false}) searchForm: NgForm;
  countries: ICountry[];

  filteringOptions = ['Asia', 'Americas', 'Africa', 'Europe', 'Oceania'];

  selectedCars = [3];
  cars = [
    {id: 1, name: 'Volvo'},
    {id: 2, name: 'Saab', disabled: true},
    {id: 3, name: 'Opel'},
    {id: 4, name: 'Audi'},
  ];

  constructor(private countriesService: CountriesService) {
  }

  ngOnInit() {
    this.countriesService.getAllCountries().subscribe(data => {
      this.countries = data;
    });
  }

  onSearch() {
    this.countriesService.getCountry(this.searchForm.value.query).subscribe(data => {
      this.countries = data;
    });
  }

}
