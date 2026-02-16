import { NgClass, SlicePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  standalone: true,
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
  styleUrl: './founding-articles.component.scss',
})
export class FoundingArticlesComponent {
  @Input({ required: true }) isNational: boolean = true;
  specificCategory!: ISpecificCategory | undefined;
  currentSlugId: string = this.isNational
    ? 'nation_day_blogs'
    : 'foundation_day_blogs';

  constructor(private _CategoriesService: CategoriesService) {}
  currentPage: number = 1;
  totalItems: number = 0;
  article: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  ngOnInit(): void {
    this.currentSlugId = this.isNational
      ? 'nation_day_blogs'
      : 'foundation_day_blogs';
    this.getArticles();
  }
  pageChanged(e: number) {
    this.specificCategory = undefined;
    this.currentPage = e;

    this._CategoriesService
      .getCurrentCategories(this.currentSlugId, this.currentPage)
      .subscribe({
        next: (response) => {
          this.specificCategory = response as ISpecificCategory;
          this.totalItems = response?.blogs.total as number;
        },
      });
  }

  getArticles() {
    this._CategoriesService.getCurrentCategories(this.currentSlugId).subscribe({
      next: (response) => {
        this.totalItems = response?.blogs.total as number;
        this.specificCategory = response as ISpecificCategory;
        console.log(this.totalItems);
      },
    });
  }
}
