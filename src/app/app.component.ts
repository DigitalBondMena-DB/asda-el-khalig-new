import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';
import { isFoundingDay, isNationalDay } from './core/constants/WEB_SITE_BASE_UTL';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isFoundingDay = isFoundingDay;
  isNationalDay = isNationalDay
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        // Remove any Bootstrap offcanvas leftovers on navigation
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        const backdrops = document.querySelectorAll('.offcanvas-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
      });
    }
  }
}

