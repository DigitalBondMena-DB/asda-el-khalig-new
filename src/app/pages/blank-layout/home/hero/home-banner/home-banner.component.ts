import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StaticCategoriesService } from '../../../../../core/services/content/static-categories.service';
import { SafeHtmlPipe } from '../../../../../core/pipes/safe-html.pipe';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home-banner',
  imports: [SafeHtmlPipe],
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeBannerComponent {
  private readonly http = inject(HttpClient);
  private readonly staticCategories = inject(StaticCategoriesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);

  // ─── signals ─────────────────────────────
  websiteCounter = signal<string | number>(0);
  currentTemp = signal<string>('');
  sar = signal<string>('');
  staticDate = signal<string>('');

  year = new Date().getFullYear();
  currentPopulation = '36.95';
  arabicLocale = 'en-US';

  ngOnInit() {

    this.loadCounter();
    this.loadWeather();
    this.loadCurrency();
    this.startClock();
  }

  // ─── counter (RxJS) ──────────────────────
  private loadCounter() {
    this.staticCategories
      .getViewsData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (isPlatformBrowser(this._PLATFORM_ID)) {
            this.websiteCounter.set(
              new Intl.NumberFormat(this.arabicLocale).format(
                res.counter.coutner_Value
              )
            );
          }
        },
      });
  }

  // ─── weather (RxJS) ──────────────────────
  private loadWeather() {

    const url =
      'https://api.weatherapi.com/v1/current.json?key=94d6f85346f344d699b111519251901&q=Riyadh&aqi=yes';

    this.http
      .get<any>(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.currentTemp.set(`${data.current.temp_c}°C / ${data.current.temp_c}°F`);
      });
  }

  // ─── currency ────────────────────────────
  private loadCurrency() {
    const url =
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

    this.http
      .get<any>(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.sar.set(data?.usd?.sar ?? '');
      });
  }

  // ─── clock (RXJS instead of setInterval) ─
  private startClock() {
    if (!isPlatformBrowser(this._PLATFORM_ID)) return;

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Riyadh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.zone.runOutsideAngular(() => {
      interval(1000)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const time = formatter.format(new Date());
          this.staticDate.set(time);
        });
    })

  }
}