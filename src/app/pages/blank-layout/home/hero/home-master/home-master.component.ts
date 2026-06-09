import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CategoriesService } from '../../../../../core/services/content/categories.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

@Component({
  selector: 'app-home-master',
  imports: [CarouselModule, RouterLink, NgxSkeletonLoaderModule],
  templateUrl: './home-master.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeMasterComponent {
  private destroyRef = inject(DestroyRef);
  private _CategoriesService = inject(CategoriesService);
  masterBlog = signal<any>(null);


  ngOnInit(): void {
    this.onClickGetLastEditorNewsId();
  }

  onClickGetLastEditorNewsId(): void {
    this._CategoriesService.getEditorBlog().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response?.blogs) {
          this.masterBlog.set(response);
        }
      },
    });
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
  isDragging = signal(false); // Track dragging state

  onDragStart() {
    this.isDragging.set(true);
  }

  onDragEnd() {
    timer(200).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isDragging.set(false);
      }
    });
  }

  shouldNavigate(): boolean {
    return !this.isDragging();
  }
}
