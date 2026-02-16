import { afterNextRender, Component, HostListener } from '@angular/core';
import { FoundingAboutComponent } from './founding-about/founding-about.component';
import { FoundingArticlesComponent } from './founding-articles/founding-articles.component';
import { FoundingHeroComponent } from './founding-hero/founding-hero.component';
import { FoundingInvestigationsComponent } from './founding-investigations/founding-investigations.component';
import { FoundingNavbarComponent } from './founding-navbar/founding-navbar.component';
import { FoundingFooterComponent } from './founding-footer/founding-footer.component';
import { FoundingNewsComponent } from './founding-news/founding-news.component';
import { FoundingBannerComponent } from './founding-banner/founding-banner.component';

@Component({
  selector: 'app-founding-layout',
  standalone: true,
  imports: [
    FoundingAboutComponent,
    FoundingArticlesComponent,
    FoundingHeroComponent,
    FoundingInvestigationsComponent,
    FoundingNavbarComponent,
    FoundingFooterComponent,
    FoundingNewsComponent,
    FoundingBannerComponent,
  ],
  templateUrl: './founding-layout.component.html',
  styleUrl: './founding-layout.component.scss',
})
export class FoundingLayoutComponent {
  isDesktop: boolean = true; // Default check
  constructor() {
    afterNextRender(() => {
      this.isDesktop = window.innerWidth > 992;
    });
  }
  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth > 992;
  }
}
