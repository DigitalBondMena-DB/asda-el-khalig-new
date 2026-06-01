import { ChangeDetectionStrategy, Component, ElementRef, inject, model, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-blank-navbar',
  imports: [RouterLink, FormsModule, RouterLinkActive],
  templateUrl: './blank-navbar.component.html',
  styleUrl: './blank-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlankNavbarComponent {
  private readonly _Router = inject(Router)

  desktopSearchInput = viewChild<ElementRef>('inputSearch');
  mobileSearchInput = viewChild<ElementRef>('mobileInputSearch');

  searchResult = model<string>('');

  categories = [
    { router: '/', id: null, name: 'الرئيسية' },
    { router: '/archives/blogs', id: '01', name: 'أخبار محلية' },
    { router: '/archives/blogs', id: '02', name: 'أخبار العالم' },
    { router: '/archives/blogs', id: '03', name: 'الرياضة' },
    { router: '/archives/blogs', id: 'f', name: 'ثقافة وفن' },
    { router: '/archives/blogs', id: '04', name: 'الاقتصاد' },
    { router: '/archives/blogs', id: '05', name: 'التعليم' },
    { router: '/archives/blogs', id: '08', name: 'المقالات' },
    { router: '/archives/blogs', id: 'i', name: 'تحقيقات' },
    { router: '/archives/blogs', id: '09', name: 'أخبار المجتمع' },
    { router: '/archives/blogs', id: '07', name: 'دراسات وأبحاث' },
    { router: '/archives/blogs', id: '11', name: 'كاريكاتير' },
    { router: '/archives/blogs', id: 'g', name: 'الصحة والحياة' },
    { router: '/archives/blogs', id: '06', name: 'علوم وتكنولوجيا' },
    { router: '/archives/blogs', id: 'h', name: 'وقائع أمنية' },
    { router: '/archives/blogs', id: 'y', name: 'منوعات' },
    { router: '/founding-day', id: null, name: 'يوم التأسيس' },
    { router: '/archives/blogs', id: '10', name: 'زاوية رئيس التحرير' },
  ];

  // Focus on search input when search icon is clicked
  focusSearchInput(): void {
    // Check if we're on mobile or desktop view
    if (window.innerWidth < 768) {
      if (this.mobileSearchInput()) {
        this.mobileSearchInput()?.nativeElement.focus();
      }
    } else {
      if (this.desktopSearchInput()) {
        this.desktopSearchInput()?.nativeElement.focus();
      }
    }
  }

  searchResults(searchResult: string): void {
    if (searchResult.length > 0) {
      this._Router.navigate([`/archives/search`, searchResult]);
    }
  }
}
