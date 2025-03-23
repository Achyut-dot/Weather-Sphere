import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperature'
})
export class TemperaturePipe implements PipeTransform {
  transform(value: number, unit: 'C' | 'F' = 'C'): string {
    if (value === null || isNaN(value)) {
      return 'N/A';
    }

    let temp = value;
    let symbol = '°C';

    if (unit === 'F') {
      temp = (value * 9 / 5) + 32;
      symbol = '°F';
    }

    return `${Math.round(temp)}${symbol}`;
  }
}