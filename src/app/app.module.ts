import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CurrentWeatherComponent } from './features/current-weather/current-weather.component';
import { ForecastComponent } from './features/forecast/forecast.component';
import { SearchBarComponent } from './shared/components/search-bar/search-bar.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { WeatherIconComponent } from './shared/components/weather-icon/weather-icon.component';
import { ErrorMessageComponent } from './shared/components/error-message/error-message.component';
import { TemperaturePipe } from './shared/pipes/temperature.pipe';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { WeatherAnimationDirective } from './shared/directives/weather-animation.directive';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CurrentWeatherComponent,
    ForecastComponent,
    SearchBarComponent,
    LoaderComponent,
    WeatherIconComponent,
    ErrorMessageComponent,
    TemperaturePipe,
    DateFormatPipe,
    WeatherAnimationDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }