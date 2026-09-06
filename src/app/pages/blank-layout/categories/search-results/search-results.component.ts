import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesService } from '../../../../core/services/content/categories.service';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../../core/interfaces/ISpecificCategory';
import { HijriDatePipe } from '../../../../core/pipes/date-hijri.pipe';
import { ImagesSrcPipe } from '../../../../core/pipes/images-src.pipe';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { StringSlicePipe } from '../../../../core/pipes/string-slice.pipe';
import { SearchBlogsService } from '../../../../core/services/content/home/search-blogs.service';

@Component({
    selector: 'app-search-results',
    imports: [
        HijriDatePipe,
        StringSlicePipe,
        RouterLink,
        NgxPaginationModule,
        ImagesSrcPipe,
        NgxSkeletonLoaderModule,
        SafeHtmlPipe,
    ],
    templateUrl: './search-results.component.html',
    styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {
  private readonly _SearchBlogsService = inject(SearchBlogsService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);

  currentId = signal<string>('');
  specificCategories = signal<ISpecificCategory | null>(null);
  imageLoadedFlag = signal<boolean>(false);
  currentPage = signal<number>(1);
  totalItems = signal<number>(0);
  isShowSkeleton = signal<boolean>(true);

  ngOnInit(): void {
    // Extract 'id' from the current route on page load
    this._ActivatedRoute.paramMap
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (params) => {
          let id = params.get('id');
          if (id) {
            this.currentId.set(id);
            this.getCurrentCategory(id);
          }
        },
      });
  }

  pageChanged(e: number) {
    this.isShowSkeleton.set(true);
    window.scrollTo(0, 0);
    this.currentPage.set(e);
    this._SearchBlogsService
      .getSearchResults(this.currentId(), this.currentPage())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.specificCategories.set(response as ISpecificCategory);
          this.totalItems.set(response?.blogs.total as number);
          this.isShowSkeleton.set(false);
        },
      });
  }

  getCurrentCategory(blogId: string): void {
    this.isShowSkeleton.set(true);
    this._SearchBlogsService
      .getSearchResults(blogId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.specificCategories.set(response as ISpecificCategory);
          this.totalItems.set(response?.blogs.total as number);
          this.isShowSkeleton.set(false);
        },
      });
  }

  imageLoaded(e: Event) {
    let targetImage = e.target as HTMLElement;
    targetImage.nextElementSibling?.classList.add('d-none');
  }
}
