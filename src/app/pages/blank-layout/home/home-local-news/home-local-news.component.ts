import { CommonModule, SlicePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../../core/interfaces/ISpecificCategory';
import { HijriDatePipe } from '../../../../core/pipes/date-hijri.pipe';
import { ImagesSrcPipe } from '../../../../core/pipes/images-src.pipe';
import { HomeContentService } from '../../../../core/services/content/home/home-content.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-local-news',
  imports: [
    SlicePipe,
    HijriDatePipe,
    NgxSkeletonLoaderModule,
    RouterLink,
    ImagesSrcPipe,
    CommonModule,
  ],
  templateUrl: './home-local-news.component.html',
  styleUrl: './home-local-news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeLocalNewsComponent {
  private _HomeContentService = inject(HomeContentService);
  private destroyRef = inject(DestroyRef);
  isDesktop = input();
  localNews = signal<ISpecificCategory | null>(null);
  sectionTitle = signal('الأخبار المحلية');
  toggleButtons = viewChildren<ElementRef>('toggleButtons');


  ngOnInit(): void {
    this.getLocalNews();
  }

  getLocalNews() {
    this._HomeContentService.getHomeLocalNews().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.localNews.set(response);
        this.sectionTitle.set('الأخبار المحلية');
      },
    });
  }
  getRandomNews() {
    this._HomeContentService.getHomeRandomNews().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.localNews.set(response);
        this.sectionTitle.set('أخبار متنوعة');
      },
    });
  }
  toggleButtonsHandler(element: HTMLElement) {
    this.toggleButtons()?.forEach((button) => {
      button.nativeElement.classList.remove('btn-main');
      button.nativeElement.classList.add('bg-white');
    });
    element.classList.add('btn-main');
  }


}
