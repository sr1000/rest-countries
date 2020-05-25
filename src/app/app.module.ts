import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { CountriesListComponent } from './components/countries-list/countries-list.component';
import { CountryCardComponent } from './components/countries-list/country-card/country-card.component';
import { CountryDetailsComponent } from './components/country-details/country-details.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThemeService } from './services/theme.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AuthComponent } from './components/auth/auth.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { CountriesVisitedComponent } from './components/countries-visited/countries-visited.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CountriesListComponent,
    CountryCardComponent,
    CountryDetailsComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    CountriesVisitedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    InfiniteScrollModule,
    ReactiveFormsModule
  ],
  providers: [ThemeService, {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
