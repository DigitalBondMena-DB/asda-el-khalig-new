import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlankNavbarComponent } from '../../../core/components/blank-navbar/blank-navbar.component';
import { MetaTagsHandleService } from '../../../core/services/content/meta-tags-handle.service';
import { HeroComponent } from './hero/hero.component';
import { HomeBannerComponent } from './hero/home-banner/home-banner.component';
import { HomeMasterComponent } from './hero/home-master/home-master.component';
import { HomeAdvertisingAreaComponent } from './home-advertising-area/home-advertising-area.component';
import { HomeArticlesComponent } from './home-articles/home-articles.component';
import { HomeInvestigationsComponent } from './home-investigations/home-investigations.component';
import { HomeLocalNewsComponent } from './home-local-news/home-local-news.component';
import { HomeNewsComponent } from './home-news/home-news.component';
import { HomeVideosComponent } from './home-videos/home-videos.component';
import { NationalNewsComponent } from './national-news/national-news.component';
import { fromEvent, startWith, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    HomeAdvertisingAreaComponent,
    HomeArticlesComponent,
    HomeInvestigationsComponent,
    HomeLocalNewsComponent,
    HomeVideosComponent,
    HomeBannerComponent,
    HomeNewsComponent,
    BlankNavbarComponent,
    NationalNewsComponent,
    HomeMasterComponent,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private destroyRef = inject(DestroyRef);
  private _MetaTagsHandleService = inject(MetaTagsHandleService);
  private platformId = inject(PLATFORM_ID);
  isDesktop = signal(false);

  constructor() {
    afterNextRender(() => {
      this.setupResizeListener()
    });
  }
  ngOnInit(): void {
    this._MetaTagsHandleService.handleMeta();
    this.checkScreen()
  }
  private setupResizeListener() {
    fromEvent(window, 'resize')
      .pipe(
        throttleTime(200),
        startWith(null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.checkScreen();
      });
  }
  private checkScreen() {
    if (isPlatformServer(this.platformId)) return;
    this.isDesktop.set(window.innerWidth > 992);

  }
}
