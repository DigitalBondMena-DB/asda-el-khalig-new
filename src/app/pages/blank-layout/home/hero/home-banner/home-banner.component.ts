import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IWeatherAPI } from '../../../../../core/interfaces/IWeatherAPI';
import { SafeHtmlPipe } from '../../../../../core/pipes/safe-html.pipe';
import { StaticCategoriesService } from '../../../../../core/services/content/static-categories.service';

@Component({
  selector: 'app-home-banner',
  imports: [SafeHtmlPipe],
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.scss'
})
export class HomeBannerComponent implements OnInit, OnDestroy {

  private readonly PLATFORM_ID = inject(PLATFORM_ID);
  private readonly _httpClient = inject(HttpClient);
  private readonly _staticCategories = inject(StaticCategoriesService);
  private readonly _destroyRef = inject(DestroyRef);

  arabicLocale = 'en-US';
  currentTemp = '';
  sar = '';
  staticDate = '';
  websiteCounter: number | string = 0;
  year = new Date().getFullYear();
  currentPopulation = '36.95';

  private _clockInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    if (isPlatformServer(this.PLATFORM_ID)) return;

    this._loadCounter();
    this._loadWeather();
    this._loadCurrency();
    this._startClock();
  }

  ngOnDestroy(): void {
    if (this._clockInterval) {
      clearInterval(this._clockInterval);
      this._clockInterval = null;
    }
  }

  // ─── private helpers ──────────────────────────────────────────

  private _loadCounter(): void {
    this._staticCategories.getViewsData()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.websiteCounter = new Intl.NumberFormat(this.arabicLocale)
            .format(response.counter.coutner_Value);
        },
        error: (err) => console.error('Counter failed:', err),
      });
  }

  private _loadWeather(): void {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=24.7136&longitude=46.6753&current_weather=true';

    this._httpClient.get<any>(url)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => {
          const temp_c = data.current_weather.temperature;
          const f = (temp_c * 9) / 5 + 32;
          this.currentTemp =
            `${Math.trunc(temp_c)}<sup>o</sup>C / ${Math.trunc(f)}<sup>o</sup>F`;
        },
        error: (err) => console.error('Weather failed:', err),
      });
  }

  private _loadCurrency(): void {
    const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest'
      + '/v1/currencies/usd.json';

    this._httpClient.get<{ usd: { sar: string } }>(url)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => { this.sar = data.usd.sar; },
        error: (err) => console.error('Currency failed:', err),
      });
  }

  private _startClock(): void {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Riyadh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const tick = () => { this.staticDate = fmt.format(new Date()); };

    tick(); // اعرض الوقت فوراً
    this._clockInterval = setInterval(tick, 1000);
  }
}