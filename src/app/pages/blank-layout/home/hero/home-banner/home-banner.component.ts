import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { IWeatherAPI } from '../../../../../core/interfaces/IWeatherAPI';
import { SafeHtmlPipe } from '../../../../../core/pipes/safe-html.pipe';
import { StaticCategoriesService } from '../../../../../core/services/content/static-categories.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-banner',
  standalone: true,
  imports: [SafeHtmlPipe],
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.scss',
})
export class HomeBannerComponent {
  arabicLocale = 'en-EN';
  currentTemp: string = '';
  sar: string = '';
  staticDate = '';
  websiteCounter: number | string = 0;
  year = new Date().getFullYear();
  currentPopulation: string = '36.95';
  constructor(
    private _HttpClient: HttpClient,
    @Inject(PLATFORM_ID) private PLATFORM_ID: object,
    private _StaticCategoriesService: StaticCategoriesService
  ) {}

  Sub01!: Subscription;
  Sub02!: Subscription;
  Sub03!: Subscription;

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.PLATFORM_ID)) {
      this.Sub01.unsubscribe();
      this.Sub02.unsubscribe();
      this.Sub03.unsubscribe();
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.PLATFORM_ID)) {
      this.Sub01 = this._StaticCategoriesService.getViewsData().subscribe({
        next: (response) => {
          this.websiteCounter = new Intl.NumberFormat(this.arabicLocale).format(
            response.counter.coutner_Value
          );
        },
      });
      const url =
        'https://api.weatherapi.com/v1/current.json?key=94d6f85346f344d699b111519251901&q=Riyadh&aqi=yes';
      // const url =
      //   'https://api.open-meteo.com/v1/forecast?latitude=25&longitude=45&hourly=temperature_2m&timeformat=unixtime&forecast_days=1';

      const currency =
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

      this.Sub02 = this._HttpClient.get<IWeatherAPI>(url).subscribe({
        next: (data: IWeatherAPI) => {
          const temperatureCelsius = data.current.temp_c;
          const temperatureFahrenheit = (temperatureCelsius * 9) / 5 + 32;
          // Log both Celsius and Fahrenheit
          this.currentTemp = `${Math.trunc(
            temperatureCelsius
          )}<sup>o</sup>C / ${Math.trunc(temperatureFahrenheit)}<sup>o</sup>F`;
        },
      });
      this.Sub03 = this._HttpClient.get<any>(currency).subscribe({
        next: (data: any) => {
          this.sar = data.usd.sar;
        },
      });
      setInterval(() => {
        let time = new Date();
        const saudiTime = new Intl.DateTimeFormat('en-EN', {
          timeZone: 'Asia/Riyadh',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(time);

        this.staticDate = saudiTime;
      }, 1000);
    }
  }
}
