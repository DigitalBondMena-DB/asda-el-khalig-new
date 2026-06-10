import { isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  RendererFactory2,
  effect,
  inject,
  DOCUMENT
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private router = inject(Router);
  private rendererFactory = inject(RendererFactory2);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  private renderer = this.rendererFactory.createRenderer(null, null);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Map route changes to current route data
  private routeData$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.getRouteData())
  );

  // Convert the route data observable to a Signal
  private routeData = toSignal(this.routeData$, {
    initialValue: this.getRouteData(),
  });

  constructor() {
    // Effect automatically runs whenever routeData signal updates
    effect(() => {
      const data = this.routeData();
      this.updateSeoData(data);
    });
  }

  /**
   * Updates title, description meta, and canonical link based on the route data.
   */
  private updateSeoData(routeData: any): void {
    // 1. Update Title
    const pageTitle =
      routeData?.title ||
      'صحيفة أصداء الخليج | صحيفة سعودية مرخصة | رئيس التحرير سلمان بن أحمد العيد';
    this.setTitle(pageTitle);

    // 2. Update Description Meta Tag
    const pageDescription =
      routeData?.description ||
      'صحيفة أصداء الخليج صحيفة سعودية مرخصة تقدم الأخبار والتقارير الحصرية ، برئاسة رئيس التحرير سلمان بن أحمد العيد تابع أحدث المستجدات السياسية الاقتصادية والرياضية';
    this.setMetaTag('description', pageDescription);

    // 3. Update Canonical URL (Browser only)
    if (this.isBrowser) {
      this.setCanonicalUrl(window.location.href);
    }
  }

  /**
   * Traversing the active route tree to get route data.
   */
  private getRouteData(): any {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.data;
  }

  /**
   * Sets the title tag in head.
   */
  private setTitle(title: string): void {
    let titleElement = this.document.querySelector('title');
    if (!titleElement) {
      titleElement = this.renderer.createElement('title');
      this.renderer.appendChild(this.document.head, titleElement);
    }
    this.renderer.setProperty(titleElement, 'textContent', title);
  }

  /**
   * Sets a meta tag by name.
   */
  private setMetaTag(name: string, content: string): void {
    let metaElement = this.document.querySelector(`meta[name="${name}"]`);
    if (!metaElement) {
      metaElement = this.renderer.createElement('meta');
      this.renderer.setAttribute(metaElement, 'name', name);
      this.renderer.appendChild(this.document.head, metaElement);
    }
    this.renderer.setAttribute(metaElement, 'content', content);
  }

  /**
   * Sets the canonical URL link tag.
   */
  private setCanonicalUrl(url: string): void {
    let linkElement = this.document.querySelector('link[rel="canonical"]');
    if (!linkElement) {
      linkElement = this.renderer.createElement('link');
      this.renderer.setAttribute(linkElement, 'rel', 'canonical');
      this.renderer.appendChild(this.document.head, linkElement);
    }
    this.renderer.setAttribute(linkElement, 'href', url);
  }
}
