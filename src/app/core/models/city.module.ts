import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface City {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CityModule { }
