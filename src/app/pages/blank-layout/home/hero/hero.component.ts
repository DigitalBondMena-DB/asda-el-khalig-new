import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgOptimizedImage } from '@angular/common';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SliderBlogService } from '../../../../core/services/content/slider-blog.service';
import { NewsControlService } from '../../../../core/services/shared/news-control.service';
import { RemoveInlineStylesPipe } from '../../../../core/pipes/remove-inline-styles.pipe';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { HomeMasterComponent } from "./home-master/home-master.component";

@Component({
  selector: 'app-hero',
  imports: [
    CarouselModule,
    RouterLink,
    NgxSkeletonLoaderModule,
    NgOptimizedImage,
    RemoveInlineStylesPipe,
    SafeHtmlPipe,
    HomeMasterComponent
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

  isDragging = signal(false);

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

  // ✅ replace setTimeout with RxJS timer (safe destroy)
  onDragEnd() {
    timer(200)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isDragging.set(false);
      });
  }

  onDragStart() {
    this.isDragging.set(true);
  }

  shouldNavigate(): boolean {
    return !this.isDragging();
  }

  imageLoaded(event: HTMLImageElement): void {
    event.nextElementSibling?.remove();
  }

  /** Carousel Options */
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    rtl: true,
    autoplay: true,
    autoplaySpeed: 500,
    navSpeed: 700,
    items: 1,
    nav: false,
  };
}