import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../../core/interfaces/ISpecificCategory';
import { ImagesSrcPipe } from '../../../../core/pipes/images-src.pipe';
import { CategoriesService } from '../../../../core/services/content/categories.service';
import { HomeContentService } from '../../../../core/services/content/home/home-content.service';
import { AdvertisingAreaComponent } from '../../../../shared/components/advertising-area/advertising-area.component';

@Component({
  selector: 'app-related-content',
  imports: [
    NgxSkeletonLoaderModule,
    AdvertisingAreaComponent,
    RouterLink,
    ImagesSrcPipe,
  ],
  templateUrl: './related-content.component.html',
  styleUrl: './related-content.component.scss'
})
export class RelatedContentComponent {
  private _HomeContentService = inject(HomeContentService);
  private _CategoriesService = inject(CategoriesService);
  relatedContent = signal<ISpecificCategory | null>(null);
  currentRelatedContentId = input<string>();
  isRandom = input<boolean>(false);
  isShowSkeleton = signal<boolean>(true);


  ngOnInit(): void {
    this.getCurrentRelatedContent();
  }

  getCurrentRelatedContent(): void {
    this.isShowSkeleton.set(true);
    /** if isRandom = true get random news == categories component open */
    if (this.isRandom()) {
      this._HomeContentService.getHomeRandomNews().subscribe({
        next: (response) => {
          this.relatedContent.set(response);
          this.isShowSkeleton.set(false);
        },
      });
    }
    /** if isRandom = false get blog news == details component open */
    if (!this.isRandom()) {
      this._CategoriesService
        .getCurrentCategories(this.currentRelatedContentId()!)
        .subscribe({
          next: (response) => {
            this.relatedContent.set(response);
            this.isShowSkeleton.set(false);
          },
        });
    }
  }
}
