import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WeatherResponse, WeatherDisplay } from '../models/weather.module';
import { ForecastResponse, ForecastDay, ForecastItem } from '../models/forecast.module';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseUrl = environment.openWeatherBaseUrl;

  constructor(private http: HttpClient) { }

  getCurrentWeather(city: string): Observable<WeatherDisplay> {
    const url = `${this.baseUrl}/weather?q=${city}&units=metric&appid=${environment.openWeatherApiKey}`;
    return this.http.get<WeatherResponse>(url).pipe(
      map(response => this.transformWeatherData(response)),
      catchError(error => {
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  getCurrentWeatherByCoords(lat: number, lon: number): Observable<WeatherDisplay> {
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${environment.openWeatherApiKey}`;
    return this.http.get<WeatherResponse>(url).pipe(
      map(response => this.transformWeatherData(response)),
      catchError(error => {
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  getForecast(city: string): Observable<ForecastDay[]> {
    const url = `${this.baseUrl}/forecast?q=${city}&units=metric&appid=${environment.openWeatherApiKey}`;
    return this.http.get<ForecastResponse>(url).pipe(
      map(response => this.transformForecastData(response)),
      catchError(error => {
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  getForecastByCoords(lat: number, lon: number): Observable<ForecastDay[]> {
    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${environment.openWeatherApiKey}`;
    return this.http.get<ForecastResponse>(url).pipe(
      map(response => this.transformForecastData(response)),
      catchError(error => {
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  private transformWeatherData(data: WeatherResponse): WeatherDisplay {
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      conditions: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      pressure: data.main.pressure,
      visibility: data.visibility,
      dateTime: data.dt,
      timezone: data.timezone
    };
  }

  private transformForecastData(data: ForecastResponse): ForecastDay[] {
    const forecastMap = new Map<string, ForecastItem[]>();

    // Group forecast items by day
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];

      if (!forecastMap.has(dateKey)) {
        forecastMap.set(dateKey, []);
      }

      forecastMap.get(dateKey)?.push(item);
    });

    // Create forecast days
    const forecastDays: ForecastDay[] = [];
    forecastMap.forEach((items, dateKey) => {
      const date = new Date(dateKey);
      const day = this.getDayName(date);

      // Calculate min, max and average temperatures
      const temps = items.map(item => item.main.temp);
      const minTemp = Math.round(Math.min(...temps));
      const maxTemp = Math.round(Math.max(...temps));
      const averageTemp = Math.round(temps.reduce((sum, temp) => sum + temp, 0) / temps.length);

      // Get the most frequent weather condition for the day
      const weatherConditions = items.map(item => item.weather[0].main);
      const weatherCounts = weatherConditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      let mostFrequentWeather = '';
      let maxCount = 0;

      Object.entries(weatherCounts).forEach(([condition, count]) => {
        if (count > maxCount) {
          mostFrequentWeather = condition;
          maxCount = count;
        }
      });

      // Use noon forecast for the icon if available, otherwise use the first item
      const noonForecast = items.find(item => {
        const forecastHour = new Date(item.dt * 1000).getHours();
        return forecastHour >= 11 && forecastHour <= 13;
      });

      const representativeForecast = noonForecast || items[0];

      forecastDays.push({
        date: dateKey,
        day,
        items,
        averageTemp,
        minTemp,
        maxTemp,
        icon: representativeForecast.weather[0].icon,
        description: representativeForecast.weather[0].description
      });
    });

    // Sort forecast days by date
    forecastDays.sort((a, b) => a.date.localeCompare(b.date));

    // Return only the next 5 days
    return forecastDays.slice(0, 5);
  }

  private getDayName(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  private getErrorMessage(error: any): string {
    if (error.status === 404) {
      return 'City not found. Please check the spelling and try again.';
    } else if (error.status === 401) {
      return 'API key is invalid or missing.';
    } else {
      return 'An error occurred while fetching weather data. Please try again later.';
    }
  }
}