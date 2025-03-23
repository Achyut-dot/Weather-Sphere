import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-weather-icon',
  templateUrl: './weather-icon.component.html',
  styleUrls: ['./weather-icon.component.scss']
})
export class WeatherIconComponent implements OnChanges {
  @Input() iconCode: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  iconUrl: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iconCode']) {
      this.updateIconUrl();
    }
  }

  private updateIconUrl(): void {
    if (this.iconCode) {
      const iconSize = this.getIconSize();
      this.iconUrl = `${environment.openWeatherIconUrl}/${this.iconCode}${iconSize}.png`;
    }
  }

  private getIconSize(): string {
    switch (this.size) {
      case 'small':
        return '';
      case 'medium':
        return '@2x';
      case 'large':
        return '@4x';
      default:
        return '@2x';
    }
  }
}