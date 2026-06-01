import { CommonModule, SlicePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../../core/interfaces/ISpecificCategory';
import { HijriDatePipe } from '../../../../core/pipes/date-hijri.pipe';
import { ImagesSrcPipe } from '../../../../core/pipes/images-src.pipe';
import { HomeContentService } from '../../../../core/services/content/home/home-content.service';

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
  localNews = signal<ISpecificCategory | null>(null);
  sectionTitle = signal('الأخبار المحلية');
  isShowSkeleton = signal<boolean>(true);
  @ViewChildren('toggleButtons') toggleButtons!: QueryList<ElementRef>;
  constructor(private _HomeContentService: HomeContentService) { }

  ngOnInit(): void {
    this.getLocalNews();
  }

  getLocalNews() {
    this.isShowSkeleton.set(true);
    this._HomeContentService.getHomeLocalNews().subscribe({
      next: (response) => {
        this.localNews.set(response);
        this.sectionTitle.set('الأخبار المحلية');
        this.isShowSkeleton.set(false);
      },
    });
  }
  getRandomNews() {
    this.isShowSkeleton.set(true);
    this._HomeContentService.getHomeRandomNews().subscribe({
      next: (response) => {
        this.localNews.set(response);
        this.sectionTitle.set('أخبار متنوعة');
        this.isShowSkeleton.set(false);
      },
    });
  }
  toggleButtonsHandler(element: HTMLElement) {
    this.toggleButtons.forEach((button) => {
      button.nativeElement.classList.remove('btn-main');
      button.nativeElement.classList.add('bg-white');
    });
    element.classList.add('btn-main');
  }

  skeleton: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  isDesktop = input();
}
