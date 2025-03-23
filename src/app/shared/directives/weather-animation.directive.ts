import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appWeatherAnimation]'
})
export class WeatherAnimationDirective implements OnChanges {
  @Input() weatherCondition: string = '';
  @Input() isDay: boolean = true;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weatherCondition'] || changes['isDay']) {
      this.applyAnimation();
    }
  }

  private applyAnimation(): void {
    // First remove any existing animation classes
    this.renderer.removeClass(this.el.nativeElement, 'animation-rain');
    this.renderer.removeClass(this.el.nativeElement, 'animation-snow');
    this.renderer.removeClass(this.el.nativeElement, 'animation-thunderstorm');
    this.renderer.removeClass(this.el.nativeElement, 'animation-clouds');
    this.renderer.removeClass(this.el.nativeElement, 'animation-mist');
    this.renderer.removeClass(this.el.nativeElement, 'animation-sunny');

    // Apply new animation based on weather condition
    const condition = this.weatherCondition.toLowerCase();

    if (condition.includes('rain') || condition.includes('drizzle')) {
      this.renderer.addClass(this.el.nativeElement, 'animation-rain');
    } else if (condition.includes('snow')) {
      this.renderer.addClass(this.el.nativeElement, 'animation-snow');
    } else if (condition.includes('thunderstorm')) {
      this.renderer.addClass(this.el.nativeElement, 'animation-thunderstorm');
    } else if (condition.includes('clouds')) {
      this.renderer.addClass(this.el.nativeElement, 'animation-clouds');
    } else if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
      this.renderer.addClass(this.el.nativeElement, 'animation-mist');
    } else if (condition.includes('clear') && this.isDay) {
      this.renderer.addClass(this.el.nativeElement, 'animation-sunny');
    }
  }
}