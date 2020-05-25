import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;

  private isDarkMode = false;
  private userSub = new Subscription();

  constructor(private themeService: ThemeService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.themeService.toggleLight();

    this.userSub = this.authService.user.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onChangeTheme(): void {
    this.isDarkMode ? this.themeService.toggleLight() : this.themeService.toggleDark();
    this.isDarkMode = !this.isDarkMode;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
