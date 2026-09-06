import { NgClass, SlicePipe } from '@angular/common';
import {
  Component,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  ISpecificCategory,
} from '../../../core/interfaces/ISpecificCategory';
import { HijriDatePipe } from '../../../core/pipes/date-hijri.pipe';
import { ImagesSrcPipe } from '../../../core/pipes/images-src.pipe';
import { StringSpliterPipe } from '../../../core/pipes/string-spliter.pipe';
import { CategoriesService } from '../../../core/services/content/categories.service';

@Component({
  selector: 'app-founding-news',
  imports: [
    NgxSkeletonLoaderModule,
    SlicePipe,
    RouterLink,
    ImagesSrcPipe,
    HijriDatePipe,
    CarouselModule,
    NgxPaginationModule,
    StringSpliterPipe,
    NgClass,
  ],
  templateUrl: './founding-news.component.html',
  styleUrl: './founding-news.component.scss'
})
export class FoundingNewsComponent {
  isNational = input<boolean>(true);
  allNews = signal<ISpecificCategory | null>(null);
  isLoading = signal<boolean>(true);
  currentSlugId = linkedSignal<string>(() => this.isNational() ? 'nation_day' : 'foundation_day');
  currentPage = signal(1);
  totalItems = signal(0);
  isDesktop = input();

  constructor(
    private _CategoriesService: CategoriesService,
  ) { }

  ngOnInit(): void {
    const slugId = this.isNational() ? 'nation_day' : 'foundation_day';
    this.currentSlugId.set(slugId);
    this.getAnotherCategories(this.currentSlugId(), this.currentPage());
  }

  pageChanged(page: number): void {
    this.currentPage.set(page);
    this.getAnotherCategories(this.currentSlugId(), this.currentPage());
  }

  getAnotherCategories(categoryId: string, page: number): void {
    this.isLoading.set(true);
    this._CategoriesService.getCurrentCategories(categoryId, page).subscribe({
      next: (response) => {
        this.allNews.set(response as ISpecificCategory);
        this.totalItems.set(response?.blogs?.total as number ?? 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  imageLoaded(e: any) {
    let targetImage = e.target as HTMLElement;
    targetImage.nextElementSibling?.classList.add('d-none');
  }

  skeltonArray = [0, 1, 2, 3, 4, 5, 6, 7];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 3,
    autoWidth: true,
    nav: true,
  };
}
