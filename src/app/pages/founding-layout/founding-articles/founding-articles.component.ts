import { NgClass, SlicePipe } from '@angular/common';
import { Component, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../core/interfaces/ISpecificCategory';
import { ImagesSrcPipe } from '../../../core/pipes/images-src.pipe';
import { RemoveInlineStylesPipe } from '../../../core/pipes/remove-inline-styles.pipe';
import { SafeHtmlPipe } from '../../../core/pipes/safe-html.pipe';
import { CategoriesService } from '../../../core/services/content/categories.service';

@Component({
  selector: 'app-founding-articles',
  imports: [
    SlicePipe,
    RouterLink,
    NgxSkeletonLoaderModule,
    ImagesSrcPipe,
    SafeHtmlPipe,
    RemoveInlineStylesPipe,
    NgxPaginationModule,
    NgClass,
  ],
  templateUrl: './founding-articles.component.html',
  styleUrl: './founding-articles.component.scss'
})
export class FoundingArticlesComponent {
  isNational = input<boolean>(true);
  specificCategory = signal<ISpecificCategory | null>(null);
  currentSlugId = linkedSignal(() => this.isNational() ? 'nation_day_blogs' : 'foundation_day_blogs');

  constructor(private _CategoriesService: CategoriesService) { }
  currentPage = signal<number>(1);
  totalItems = signal<number>(0);
  article: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  ngOnInit(): void {
    const slugId = this.isNational()
      ? 'nation_day_blogs'
      : 'foundation_day_blogs';
    this.currentSlugId.set(slugId);
    this.getArticles();
  }
  pageChanged(e: number) {
    this.specificCategory.set(null);
    this.currentPage.set(e);

    this._CategoriesService
      .getCurrentCategories(this.currentSlugId(), this.currentPage())
      .subscribe({
        next: (response) => {
          this.specificCategory.set(response as ISpecificCategory);
          this.totalItems.set(response?.blogs.total as number);
        },
      });
  }

  getArticles() {
    this._CategoriesService.getCurrentCategories(this.currentSlugId()).subscribe({
      next: (response) => {
        this.totalItems.set(response?.blogs.total as number);
        this.specificCategory.set(response as ISpecificCategory);
      },
    });
  }
}
