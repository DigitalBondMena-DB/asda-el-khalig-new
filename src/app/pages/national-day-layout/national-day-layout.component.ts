import { afterNextRender, Component, HostListener, signal } from '@angular/core';
import { FoundingAboutComponent } from '../founding-layout/founding-about/founding-about.component';
import { FoundingArticlesComponent } from '../founding-layout/founding-articles/founding-articles.component';
import { FoundingBannerComponent } from '../founding-layout/founding-banner/founding-banner.component';
import { FoundingFooterComponent } from '../founding-layout/founding-footer/founding-footer.component';
import { FoundingHeroComponent } from '../founding-layout/founding-hero/founding-hero.component';
import { FoundingInvestigationsComponent } from '../founding-layout/founding-investigations/founding-investigations.component';
import { FoundingNavbarComponent } from '../founding-layout/founding-navbar/founding-navbar.component';
import { FoundingNewsComponent } from '../founding-layout/founding-news/founding-news.component';

@Component({
  selector: 'app-national-day-layout',
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
  templateUrl: './national-day-layout.component.html',
  styleUrl: './national-day-layout.component.scss'
})
export class NationalDayLayoutComponent {
  isDesktop = signal<boolean>(true); // Default check
  constructor() {
    afterNextRender(() => {
      this.isDesktop.set(window.innerWidth > 992);
    });
  }
  @HostListener('window:resize')
  onResize() {
    this.isDesktop.set(window.innerWidth > 992);
  }
}
