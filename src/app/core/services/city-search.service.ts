import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { City } from '../models/city.module';

@Injectable({
  providedIn: 'root'
})
export class CitySearchService {
  private baseUrl = environment.geoLocationApiUrl;
  private cachedResults = new Map<string, City[]>();
  private cacheExpiryTime = 24 * 60 * 60 * 1000; // 24 hours
  private lastCacheCleanup = Date.now();

  constructor(private http: HttpClient) { }

  searchCities(query: string): Observable<City[]> {
    // Don't search for very short queries
    if (query.length < 2) {
      return of([]);
    }

    // Check if we have cached results
    const cacheKey = query.toLowerCase();
    const cachedEntry = this.cachedResults.get(cacheKey);

    if (cachedEntry) {
      return of(cachedEntry);
    }

    // Clean up old cache entries periodically
    this.cleanupCache();

    // Fetch from API
    const url = `${this.baseUrl}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${environment.openWeatherApiKey}`;

    return this.http.get<any[]>(url).pipe(
      map(response => {
        const cities = response.map(item => ({
          name: item.name,
          country: item.country,
          state: item.state,
          lat: item.lat,
          lon: item.lon
        }));

        // Cache the results
        this.cacheResults(cacheKey, cities);

        return cities;
      }),
      catchError(error => {
        return throwError(() => new Error('Error fetching city suggestions'));
      })
    );
  }

  private cacheResults(key: string, results: City[]): void {
    this.cachedResults.set(key, results);
  }

  private cleanupCache(): void {
    const now = Date.now();

    // Only clean up once per day
    if (now - this.lastCacheCleanup < 24 * 60 * 60 * 1000) {
      return;
    }

    this.lastCacheCleanup = now;

    const keysToDelete: string[] = [];
    const cacheExpiryTime = this.cacheExpiryTime;

    this.cachedResults.forEach((value, key) => {
      const entryAge = now - this.lastCacheCleanup;
      if (entryAge > cacheExpiryTime) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.cachedResults.delete(key);
    });
  }
}
