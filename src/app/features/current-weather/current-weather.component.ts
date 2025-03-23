import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { WeatherService } from '../../core/services/weather.service';
import { ThemeService } from '../../core/services/theme.service';
import { WeatherDisplay } from '../../core/models/weather.module';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss']
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {
  weather$: Observable<WeatherDisplay | null> = of(null);
  error: string | null = null;
  isLoading = true;
  cityName: string | null = null;
  isDay = true;

  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private route: ActivatedRoute,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['lat'] && params['lon']) {
        this.loadWeatherByCoords(params['lat'], params['lon']);
        if (params['name']) {
          this.cityName = params['name'];
        }
      } else {
        this.route.params.pipe(
          takeUntil(this.destroy$)
        ).subscribe(routeParams => {
          if (routeParams['city']) {
            this.loadWeather(routeParams['city']);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadWeather(city: string): void {
    this.isLoading = true;
    this.error = null;
    this.cityName = city;

    this.weather$ = this.weatherService.getCurrentWeather(city).pipe(
      tap(weather => {
        this.checkDayTime(weather);
        this.themeService.setThemeFromWeather(weather.conditions, this.isDay);
      }),
      catchError(error => {
        this.isLoading = false;
        this.error = error.message;
        return of(null);
      }),
      tap(() => {
        this.isLoading = false;
      })
    );
  }

  private loadWeatherByCoords(lat: number, lon: number): void {
    this.isLoading = true;
    this.error = null;

    this.weather$ = this.weatherService.getCurrentWeatherByCoords(lat, lon).pipe(
      tap(weather => {
        if (!this.cityName) {
          this.cityName = weather.city;
        }
        this.checkDayTime(weather);
        this.themeService.setThemeFromWeather(weather.conditions, this.isDay);
      }),
      catchError(error => {
        this.isLoading = false;
        this.error = error.message;
        return of(null);
      }),
      tap(() => {
        this.isLoading = false;
      })
    );
  }

  private checkDayTime(weather: WeatherDisplay): void {
    const currentTime = new Date().getTime() / 1000 + weather.timezone;
    this.isDay = currentTime > weather.sunrise && currentTime < weather.sunset;
  }
}