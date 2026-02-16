import { Component } from '@angular/core';
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
  standalone: true,
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
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent {
  currentId!: string;
  specificCategories!: ISpecificCategory | null;
  imageLoadedFlag = false;
  currentPage: number = 1;
  totalItems: number = 0;
  isShowSkeleton = true;
  pageChanged(e: number) {
    this.isShowSkeleton = true;
    window.scrollTo(0, 0);
    this.currentPage = e;
    this._SearchBlogsService
      .getSearchResults(this.currentId, this.currentPage)
      .subscribe({
        next: (response) => {
          this.specificCategories = response as ISpecificCategory;
          this.totalItems = response?.blogs.total as number;
          this.isShowSkeleton = false;
        },
      });
  }

  constructor(
    private _SearchBlogsService: SearchBlogsService,
    private _ActivatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Handle the active route on reload
    this.getInitialId();
  }

  getInitialId(): void {
    // Extract 'id' from the current route on page load
    const id = this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        let id = params.get('id');
        if (id) {
          this.currentId = id;
          this.getCurrentCategory(this.currentId);
        }
      },
    });
  }

  getCurrentCategory(blogId: string): void {
    this.isShowSkeleton = true;
    this._SearchBlogsService.getSearchResults(blogId).subscribe({
      next: (response) => {
        this.specificCategories = response as ISpecificCategory;
        this.totalItems = response?.blogs.total as number;
        this.isShowSkeleton = false;
      },
    });
  }

  imageLoaded(e: any) {
    let targetImage = e.target as HTMLElement;
    targetImage.nextElementSibling?.classList.add('d-none');
  }
}
