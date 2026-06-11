import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SliderBlogService } from '../../../../core/services/content/slider-blog.service';
import { NewsControlService } from '../../../../core/services/shared/news-control.service';
import { RemoveInlineStylesPipe } from '../../../../core/pipes/remove-inline-styles.pipe';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { HomeMasterComponent } from "./home-master/home-master.component";
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [
    RouterLink,
    NgxSkeletonLoaderModule,
    RemoveInlineStylesPipe,
    SafeHtmlPipe,
    HomeMasterComponent,
    NgOptimizedImage
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _NewsControlService = inject(NewsControlService);
  private readonly _SliderBlogService = inject(SliderBlogService);

  sliderData = signal<any>(null);
  allBreakingNews = signal<any>(null);

  ngOnInit(): void {
    this.getBreakingNews();
    this.getSliderData();
  }

  // ✅ SAFE subscription with auto cleanup
  getBreakingNews() {
    this._NewsControlService.getBreakingNews()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.allBreakingNews.set(response);
        }
      });
  }

  getSliderData() {
    this._SliderBlogService.getSliderData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.sliderData.set(response);
        }
      });
  }
}