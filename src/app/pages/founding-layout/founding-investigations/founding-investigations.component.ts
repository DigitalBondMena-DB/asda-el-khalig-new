import { NgClass, SlicePipe } from '@angular/common';
import { Component, Input, input } from '@angular/core';
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
  @Input({ required: true }) isNational: boolean = true;
  investigations!: ISpecificCategory | undefined;
  currentPage = 1;
  totalItems = 0;
  isDesktop = input();
  skeleton: number[] = [0, 1, 2, 3, 4, 5, 6, 7];

  // currentSlugId: string = 'foundation_day_investigations';
  currentSlugId: string = this.isNational ? 'nation_day_investigations' : 'i';
  constructor(private _CategoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.currentSlugId = this.isNational ? 'nation_day_investigations' : 'i';
    this.getLocalNews(this.currentSlugId, this.currentPage);
  }
  pageChanged(page: number): void {
    this.investigations = undefined;
    this.currentPage = page;
    this.getLocalNews(this.currentSlugId, this.currentPage);
  }

  getLocalNews(categoryId: string, page: number) {
    this._CategoriesService.getCurrentCategories(categoryId, page).subscribe({
      next: (response) => {
        this.investigations = response as ISpecificCategory;
        this.totalItems = response?.blogs.total as number;
        console.log(this.totalItems);
        console.log(response);
      },
    });
  }
}
