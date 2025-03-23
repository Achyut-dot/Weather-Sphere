import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  getUserLocation(): Observable<GeolocationCoordinates> {
    if (!navigator.geolocation) {
      return throwError(() => new Error('Geolocation is not supported by your browser'));
    }

    return from(
      new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position.coords);
          },
          (error) => {
            reject(this.getErrorMessage(error));
          },
          { timeout: 10000 }
        );
      })
    ).pipe(
      catchError(error => {
        return throwError(() => new Error(error));
      })
    );
  }

  private getErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'User denied the request for geolocation';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable';
      case error.TIMEOUT:
        return 'The request to get user location timed out';
      default:
        return 'An unknown error occurred';
    }
  }
}