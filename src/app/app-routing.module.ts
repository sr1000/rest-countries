import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountriesListComponent } from './components/countries-list/countries-list.component';
import { CountryDetailsComponent } from './components/country-details/country-details.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './components/guards/auth.guard';
import { LoggedInGuard } from './components/guards/logged-in.guard';
import { CountriesVisitedComponent } from './components/countries-visited/countries-visited.component';


const routes: Routes = [
  {
    path: 'auth', component: AuthComponent, canActivate: [LoggedInGuard]
  },
  {
    path: 'overview', component: CountriesListComponent, canActivate: [AuthGuard]
  },
  {
    path: 'country/:country', component: CountryDetailsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'visited', component: CountriesVisitedComponent, canActivate: [AuthGuard]
  },
  {
    path: '**', redirectTo: '/overview', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
