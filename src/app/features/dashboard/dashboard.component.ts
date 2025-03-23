import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeolocationService } from '../../core/services/geolocation.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  error: string | null = null;

  constructor(
    private geolocationService: GeolocationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Check if we already have a city in the route
    this.route.params.subscribe(params => {
      if (!params['city']) {
        this.tryGetUserLocation();
      }
    });
  }

  private tryGetUserLocation(): void {
    this.geolocationService.getUserLocation()
      .pipe(
        catchError(error => {
          this.error = `Couldn't get your location: ${error.message}`;
          return of(null);
        })
      )
      .subscribe(coords => {
        if (coords) {
          this.router.navigate(['/weather'], {
            queryParams: {
              lat: coords.latitude,
              lon: coords.longitude
            }
          });
        }
      });
  }
}