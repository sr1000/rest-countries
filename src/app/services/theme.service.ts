import { Injectable } from '@angular/core';

export const darkTheme = {
  background: 'hsl(207, 26%, 17%)',
  'text-color': 'hsl(0, 0%, 100%)',
  'background-element': 'hsl(209, 23%, 22%)',
  'shadow-color': 'hsla(0, 0%, 0%, 0.16)',
  'input-text-color': 'hsl(0, 0%, 100%)',
  'shadow-header-color': 'hsla(0, 0%, 9%, 0.89)',
  'moon-icon': 'url("assets/moon-white.svg") no-repeat',
  'search-icon': 'var(--background-element) url("assets/search-white.svg") no-repeat 1rem 50%',
  'back-icon': 'var(--background-element) url("assets/arrow-white.svg") no-repeat 30% 50%',
  'image-filter': 'grayscale(0.3)'
};

export const lightTheme = {
  background: 'hsl(0, 0%, 97%)',
  'text-color': 'hsl(200, 15%, 8%)',
  'background-element': 'hsl(0, 0%, 100%)',
  'shadow-color': '#eee',
  'input-text-color': 'hsl(0, 0%, 52%)',
  'shadow-header-color': '#ddd',
  'moon-icon': 'url("assets/moon-dark.svg") no-repeat',
  'search-icon': 'var(--background-element) url("assets/search-dark.svg") no-repeat 1rem 50%',
  'back-icon': 'var(--background-element) url("assets/arrow-dark.svg") no-repeat 30% 50%',
  'image-filter': 'grayscale(0)'
};

@Injectable({
  providedIn: 'root'
})

export class ThemeService {
  toggleDark(): void {
    this.setTheme(darkTheme);
  }

  toggleLight(): void {
    this.setTheme(lightTheme);
  }

  private setTheme(theme: {}): void {
    Object.keys(theme).forEach(k =>
      document.documentElement.style.setProperty(`--${k}`, theme[k])
    );
  }
}
