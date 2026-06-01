import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../../core/interfaces/ISpecificCategory';
import { ImagesSrcPipe } from '../../../../core/pipes/images-src.pipe';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { StringSlicePipe } from '../../../../core/pipes/string-slice.pipe';
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
  relatedContent!: ISpecificCategory;
  @Input() currentRelatedContentId!: string;
  @Input() isRandom: boolean = false;
  isShowSkeleton: boolean = true;
  constructor(
    private _HomeContentService: HomeContentService,
    private _CategoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.getCurrentRelatedContent();
  }

  getCurrentRelatedContent(): void {
    this.isShowSkeleton = true;
    /** if isRandom = true get random news == categories component open */
    if (this.isRandom) {
      this._HomeContentService.getHomeRandomNews().subscribe({
        next: (response) => {
          this.relatedContent = response;
          this.isShowSkeleton = false;
        },
      });
    }
    /** if isRandom = false get blog news == details component open */
    if (!this.isRandom) {
      this._CategoriesService
        .getCurrentCategories(this.currentRelatedContentId)
        .subscribe({
          next: (response) => {
            this.relatedContent = response as ISpecificCategory;
            this.isShowSkeleton = false;
          },
        });
    }
  }
}
