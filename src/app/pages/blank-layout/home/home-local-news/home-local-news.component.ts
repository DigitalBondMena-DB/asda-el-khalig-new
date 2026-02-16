import { CommonModule, SlicePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  input,
  QueryList,
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
  standalone: true,
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
})
export class HomeLocalNewsComponent {
  localNews!: ISpecificCategory;
  sliceNumber = 3;
  sectionTitle = 'الأخبار المحلية';
  isShowSkeleton = true;
  @ViewChildren('toggleButtons') toggleButtons!: QueryList<ElementRef>;
  constructor(private _HomeContentService: HomeContentService) {}

  ngOnInit(): void {
    this.getLocalNews();
  }

  getLocalNews() {
    this.isShowSkeleton = true;
    this.sliceNumber = 1;
    this._HomeContentService.getHomeLocalNews().subscribe({
      next: (response) => {
        this.localNews = response;
        this.sectionTitle = 'الأخبار المحلية';
        this.isShowSkeleton = false;
      },
    });
  }
  getRandomNews() {
    this.isShowSkeleton = true;
    this.sliceNumber = 4;
    this._HomeContentService.getHomeRandomNews().subscribe({
      next: (response) => {
        this.localNews = response;
        this.sectionTitle = 'أخبار متنوعة';
        this.isShowSkeleton = false;
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
