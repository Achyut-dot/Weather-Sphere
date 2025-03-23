import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Weather[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherDisplay {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  conditions: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  sunrise: number;
  sunset: number;
  pressure: number;
  visibility: number;
  dateTime: number;
  timezone: number;
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class WeatherModule { }
