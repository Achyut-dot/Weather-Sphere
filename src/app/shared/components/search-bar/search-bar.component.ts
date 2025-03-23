import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap, filter, catchError } from 'rxjs/operators';
import { CitySearchService } from '../../../core/services/city-search.service';
import { City } from '../../../core/models/city.module';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  suggestions$: Observable<City[]> = of([]);
  isLoading = false;
  showSuggestions = false;
  private destroy$ = new Subject<void>();

  constructor(
    private citySearchService: CitySearchService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.suggestions$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(query => !!query && typeof query === 'string' && query.length >= 2),
      tap(() => {
        this.isLoading = true;
        this.showSuggestions = true;
      }),
      switchMap(query => this.citySearchService.searchCities(query!).pipe(
        catchError(() => of([])),
        tap(() => this.isLoading = false)
      )),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchSubmit(): void {
    const searchValue = this.searchControl.value;

    if (searchValue && typeof searchValue === 'string' && searchValue.trim()) {
      this.router.navigate(['/weather', searchValue.trim()]);
      this.searchControl.setValue('');
      this.showSuggestions = false;
    }
  }

  onSuggestionClick(city: City): void {
    const cityName = city.state
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`;

    this.router.navigate(['/weather'], {
      queryParams: {
        lat: city.lat,
        lon: city.lon,
        name: cityName
      }
    });

    this.searchControl.setValue('');
    this.showSuggestions = false;
  }

  onBlur(): void {
    // Small delay to allow click events to register on suggestions
    setTimeout(() => {
      this.showSuggestions = false;
    }, 150);
  }

  onFocus(): void {
    const searchValue = this.searchControl.value;
    if (searchValue && typeof searchValue === 'string' && searchValue.length >= 2) {
      this.showSuggestions = true;
    }
  }

  getFormattedCityName(city: City): string {
    return city.state
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`;
  }
}