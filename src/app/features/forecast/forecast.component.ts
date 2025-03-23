import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { WeatherService } from '../../core/services/weather.service';
import { ForecastDay } from '../../core/models/forecast.module';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit, OnDestroy {
  forecast$: Observable<ForecastDay[] | null> = of(null);
  error: string | null = null;
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['lat'] && params['lon']) {
        this.loadForecastByCoords(params['lat'], params['lon']);
      } else {
        this.route.params.pipe(
          takeUntil(this.destroy$)
        ).subscribe(routeParams => {
          if (routeParams['city']) {
            this.loadForecast(routeParams['city']);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadForecast(city: string): void {
    this.isLoading = true;
    this.error = null;

    this.forecast$ = this.weatherService.getForecast(city).pipe(
      catchError(error => {
        this.isLoading = false;
        this.error = error.message;
        return of(null);
      }),
      takeUntil(this.destroy$)
    );

    this.isLoading = false;
  }

  private loadForecastByCoords(lat: number, lon: number): void {
    this.isLoading = true;
    this.error = null;

    this.forecast$ = this.weatherService.getForecastByCoords(lat, lon).pipe(
      catchError(error => {
        this.isLoading = false;
        this.error = error.message;
        return of(null);
      }),
      takeUntil(this.destroy$)
    );

    this.isLoading = false;
  }
}