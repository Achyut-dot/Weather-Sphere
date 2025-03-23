import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type WeatherTheme = 'clear-day' | 'clear-night' | 'clouds-day' | 'clouds-night' |
  'rain-day' | 'rain-night' | 'snow-day' | 'snow-night' | 'mist-day' | 'mist-night' |
  'thunderstorm' | 'default';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<WeatherTheme>('default');
  public theme$ = this.themeSubject.asObservable();

  setThemeFromWeather(condition: string, isDay: boolean): void {
    const dayState = isDay ? 'day' : 'night';
    let theme: WeatherTheme = 'default';

    switch (condition.toLowerCase()) {
      case 'clear':
        theme = isDay ? 'clear-day' : 'clear-night';
        break;
      case 'clouds':
      case 'few clouds':
      case 'scattered clouds':
      case 'broken clouds':
      case 'overcast clouds':
        theme = isDay ? 'clouds-day' : 'clouds-night';
        break;
      case 'rain':
      case 'shower rain':
      case 'light rain':
      case 'moderate rain':
      case 'drizzle':
        theme = isDay ? 'rain-day' : 'rain-night';
        break;
      case 'thunderstorm':
        theme = 'thunderstorm';
        break;
      case 'snow':
        theme = isDay ? 'snow-day' : 'snow-night';
        break;
      case 'mist':
      case 'fog':
      case 'haze':
        theme = isDay ? 'mist-day' : 'mist-night';
        break;
      default:
        theme = isDay ? 'clear-day' : 'clear-night';
    }

    this.themeSubject.next(theme);
    document.body.className = `theme-${theme}`;
  }
}