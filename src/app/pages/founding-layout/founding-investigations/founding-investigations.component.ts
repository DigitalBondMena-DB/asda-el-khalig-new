import { NgClass, SlicePipe } from '@angular/common';
import { Component, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../core/interfaces/ISpecificCategory';
import { CategoriesService } from '../../../core/services/content/categories.service';

@Component({
  selector: 'app-founding-investigations',
  imports: [
    RouterLink,
    NgxSkeletonLoaderModule,
    NgxPaginationModule,
    SlicePipe,
    NgClass,
  ],
  templateUrl: './founding-investigations.component.html',
  styleUrl: './founding-investigations.component.scss'
})
export class FoundingInvestigationsComponent {
  isNational = input<boolean>(true);
  investigations = signal<ISpecificCategory | null>(null);
  currentPage = signal<number>(1);
  totalItems = signal<number>(0);
  isDesktop = input<boolean>(true);
  skeleton: number[] = [0, 1, 2, 3, 4, 5, 6, 7];

  currentSlugId = linkedSignal<string>(() =>
    this.isNational() ? 'nation_day_investigations' : 'foundation_day_investigations'
  );

  constructor(private _CategoriesService: CategoriesService) { }

  ngOnInit(): void {
    const slugId = this.isNational()
      ? 'nation_day_investigations'
      : 'foundation_day_investigations';
    this.currentSlugId.set(slugId);
    this.getLocalNews(this.currentSlugId(), this.currentPage());
  }

  pageChanged(page: number): void {
    this.investigations.set(null);
    this.currentPage.set(page);
    this.getLocalNews(this.currentSlugId(), this.currentPage());
  }

  getLocalNews(categoryId: string, page: number) {
    this._CategoriesService.getCurrentCategories(categoryId, page).subscribe({
      next: (response) => {
        this.investigations.set(response as ISpecificCategory);
        this.totalItems.set(response?.blogs?.total as number ?? 0);
      },
    });
  }
}
