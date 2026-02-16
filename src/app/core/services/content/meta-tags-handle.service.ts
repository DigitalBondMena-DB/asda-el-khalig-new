import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Inject,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaTagsHandleService {
  constructor(
    @Inject(PLATFORM_ID) private _PLATFORM_ID: object,
    private metaService: Meta,
    private titleService: Title
  ) {}

  handleMeta(): void {
    // if (isPlatformBrowser(this._PLATFORM_ID)) {
    //   if (window.location.href) {
    //     const canonicalUrl = window.location.href;
    //     // ✅ Find and remove existing canonical tag
    //     const existingCanonical = document.querySelector(
    //       'link[rel="canonical"]'
    //     );
    //     if (existingCanonical) {
    //       existingCanonical.remove();
    //     }
    //     // ✅ Add the new canonical tag
    //     this.metaService.addTag({ rel: 'canonical', href: canonicalUrl });
    //   }
    //   this.metaService.updateTag({
    //     name: 'description',
    //     content:
    //       'صحيفة أصداء الخليج | صحيفة سعودية مرخصة .. رئيس تحريرها سلمان بن أحمد العيد ج',
    //   });
    //   this.titleService.setTitle(
    //     'صحيفة أصداء الخليج | صحيفة سعودية مرخصة .. رئيس تحريرها سلمان بن أحمد العيد '
    //   );
    //   this.metaService.addTags([
    //     { name: 'og:title', content: 'أصداء الخليج - صحيفة سعودية مرخصة' },
    //     {
    //       name: 'og:description',
    //       content: 'صحيفة سعودية مرخصة .. رئيس تحريرها سلمان بن أحمد العيد',
    //     },
    //     {
    //       name: 'og:image',
    //       content:
    //         'https://digitalbondmena.com/El_Khaleeg/assets/favicon_io/apple-touch-icon.png',
    //     },
    //     { name: 'og:url', content: 'https://digitalbondmena.com/El_Khaleeg/' },
    //     { name: 'og:type', content: 'website' },
    //   ]);
    // }
  }
}
