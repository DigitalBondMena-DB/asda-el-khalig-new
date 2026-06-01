import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';

import { filter } from 'rxjs';
import { isFoundingDay } from './core/constants/WEB_SITE_BASE_UTL';
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Asdaa-el-khaleeg';
  isFoundingDay = isFoundingDay;
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: Object,
  ) {

  }
  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.listenToRouteChanges();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      setTimeout(() => {
        let navbars = document.querySelectorAll('.navbar');
        navbars.forEach((navbar) => new bootstrap.Collapse(navbar));
      }, 100);

      window.addEventListener('load', () => {
        const lightBox = document.querySelector('.lightBox');
        if (lightBox) {
          lightBox.classList.add('d-none');
        }
        const lightBoxDetails = document.querySelector('.lightBox-details');
        if (lightBoxDetails) {
          lightBoxDetails.classList.add('d-none');
        }
      });
    }
  }

  private listenToRouteChanges(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateMetaData();
        this.updateCanonicalUrl();
      });
  }

  private updateMetaData(): void {
    const routeData = this.getRouteData(this.activatedRoute);
    const pageTitle =
      routeData?.title ||
      'صحيفة أصداء الخليج | صحيفة سعودية مرخصة | رئيس التحرير سلمان بن أحمد العيد';
    this.titleService.setTitle(pageTitle);

    const pageDescription =
      routeData?.description ||
      'صحيفة أصداء الخليج صحيفة سعودية مرخصة تقدم الأخبار والتقارير الحصرية ، برئاسة رئيس التحرير سلمان بن أحمد العيد تابع أحدث المستجدات السياسية الاقتصادية والرياضية';
    this.metaService.updateTag({
      name: 'description',
      content: pageDescription,
    });
  }

  private updateCanonicalUrl(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const canonicalSelector = 'link[rel="canonical"]';
      let existingCanonical = document.querySelector(
        canonicalSelector,
      ) as HTMLLinkElement;

      if (existingCanonical) {
        existingCanonical.href = window.location.href;
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = window.location.href;
        document.head.appendChild(link);
      }
    }
  }

  private getRouteData(route: ActivatedRoute): any {
    let activeRoute = route;
    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }
    return activeRoute.snapshot.data;
  }
}
