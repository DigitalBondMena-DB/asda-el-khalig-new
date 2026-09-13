import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { fromEvent, Subscription, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SliderBlogService } from '../../../../core/services/content/slider-blog.service';
import { NewsControlService } from '../../../../core/services/shared/news-control.service';
import { RemoveInlineStylesPipe } from '../../../../core/pipes/remove-inline-styles.pipe';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { HomeMasterComponent } from './home-master/home-master.component';
import { ISliderHome } from '../../../../core/interfaces/slider/ISliderHome';

interface VirtualSlide {
  post_id: number;
  post_title: string;
  post_date?: string;
  post_content: string;
  featured_image: string;
  old_status?: string;
  _isClone?: boolean;
  _cloneKey?: string;
}

@Component({
  selector: 'app-hero',
  imports: [
    RouterLink,
    RemoveInlineStylesPipe,
    SafeHtmlPipe,
    HomeMasterComponent
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly _NewsControlService = inject(NewsControlService);
  private readonly _SliderBlogService = inject(SliderBlogService);

  sliderData = signal<ISliderHome | null>(null);
  allBreakingNews = signal<any>(null);

  // Slider state
  virtualIndex = signal(1);
  dragOffset = signal(0);
  isTransitioning = signal(true);
  isDragging = signal(false);

  private isPointerDown = false;
  private hasMoved = false;
  private startX = 0;
  private startY = 0;
  private isHovered = false;
  private isDocumentHidden = false;
  private autoplaySub?: Subscription;

  slides = computed(() => this.sliderData()?.blogs ?? []);

  virtualSlides = computed<VirtualSlide[]>(() => {
    const s = this.slides();
    if (s.length <= 1) return s;
    const firstClone: VirtualSlide = {
      ...s[0],
      _isClone: true,
      _cloneKey: '-first-clone'
    };
    const lastClone: VirtualSlide = {
      ...s[s.length - 1],
      _isClone: true,
      _cloneKey: '-last-clone'
    };
    return [lastClone, ...s, firstClone];
  });

  currentDotIndex = computed(() => {
    const count = this.slides().length;
    if (count <= 1) return 0;
    const vi = this.virtualIndex();
    if (vi === count + 1) return 0;
    if (vi === 0) return count - 1;
    return vi - 1;
  });

  trackTransform = computed(() => {
    const vi = this.virtualIndex();
    const offset = this.dragOffset();
    if (offset !== 0) {
      return `translate3d(calc(-${vi * 100}% + ${offset}px), 0, 0)`;
    }
    return `translate3d(-${vi * 100}%, 0, 0)`;
  });

  trackTransition = computed(() => {
    return this.isTransitioning()
      ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
      : 'none';
  });

  ngOnInit(): void {
    this.getBreakingNews();
    this.getSliderData();
    this.setupVisibilityListener();

    this.destroyRef.onDestroy(() => {
      this.cleanupPointer();
      this.stopAutoplay();
    });
  }

  getBreakingNews(): void {
    this._NewsControlService.getBreakingNews()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.allBreakingNews.set(response);
        }
      });
  }

  getSliderData(): void {
    this._SliderBlogService.getSliderData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.sliderData.set(response);
          const firstBlog = response?.blogs?.[0];
          if (firstBlog?.featured_image) {
            this.updatePreloadLink(firstBlog.featured_image);
          }
          if ((response?.blogs?.length ?? 0) > 1) {
            this.virtualIndex.set(1);
            this.startAutoplay();
          } else {
            this.virtualIndex.set(0);
          }
        }
      });
  }

  private updatePreloadLink(imageUrl: string): void {
    if (!imageUrl) return;
    try {
      let link = this.document.querySelector('link[rel="preload"][as="image"]') as HTMLLinkElement;
      if (!link) {
        link = this.document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        this.document.head.appendChild(link);
      }
      link.href = imageUrl;
      link.setAttribute('fetchpriority', 'high');
    } catch {}
  }

  private setupVisibilityListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    fromEvent(document, 'visibilitychange')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isDocumentHidden = document.hidden;
      });
  }

  // Autoplay
  startAutoplay(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.stopAutoplay();
    if (this.slides().length <= 1) return;

    this.autoplaySub = timer(5000, 5000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.isHovered && !this.isPointerDown && !this.isDocumentHidden) {
          this.nextSlide();
        }
      });
  }

  stopAutoplay(): void {
    if (this.autoplaySub) {
      this.autoplaySub.unsubscribe();
      this.autoplaySub = undefined;
    }
  }

  pauseAutoplay(): void {
    this.isHovered = true;
  }

  resumeAutoplay(): void {
    this.isHovered = false;
  }

  restartAutoplay(): void {
    this.startAutoplay();
  }

  // Navigation
  nextSlide(): void {
    const count = this.slides().length;
    if (count <= 1) return;
    this.isTransitioning.set(true);
    this.virtualIndex.update((v) => v + 1);
  }

  prevSlide(): void {
    const count = this.slides().length;
    if (count <= 1) return;
    this.isTransitioning.set(true);
    this.virtualIndex.update((v) => v - 1);
  }

  goToSlide(dotIndex: number): void {
    const count = this.slides().length;
    if (count <= 1) return;
    this.restartAutoplay();
    this.isTransitioning.set(true);
    this.virtualIndex.set(dotIndex + 1);
  }

  onTransitionEnd(): void {
    const count = this.slides().length;
    if (count <= 1) return;

    const currentVi = this.virtualIndex();
    if (currentVi === count + 1) {
      this.isTransitioning.set(false);
      this.virtualIndex.set(1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.isTransitioning.set(true);
        });
      });
    } else if (currentVi === 0) {
      this.isTransitioning.set(false);
      this.virtualIndex.set(count);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.isTransitioning.set(true);
        });
      });
    }
  }

  // Global Pointer & Drag handling
  private readonly windowPointerMove = (event: PointerEvent): void => {
    if (!this.isPointerDown) return;

    const diffX = event.clientX - this.startX;
    const diffY = event.clientY - this.startY;

    if (!this.hasMoved) {
      if (event.pointerType === 'touch' && Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 8) {
        this.cleanupPointer();
        this.resumeAutoplay();
        return;
      }

      if (Math.abs(diffX) > 5) {
        this.hasMoved = true;
        this.isDragging.set(true);
        this.isTransitioning.set(false);
      }
    }

    if (this.hasMoved) {
      this.dragOffset.set(diffX);
    }
  };

  private readonly windowPointerUp = (event: PointerEvent): void => {
    if (!this.isPointerDown) return;

    const diffX = event.clientX - this.startX;
    const moved = this.hasMoved;

    this.cleanupPointer();

    if (moved) {
      this.isTransitioning.set(true);
      this.dragOffset.set(0);

      const threshold = 40;
      if (diffX < -threshold) {
        this.nextSlide();
      } else if (diffX > threshold) {
        this.prevSlide();
      }

      setTimeout(() => {
        this.isDragging.set(false);
      }, 150);
    } else {
      this.isDragging.set(false);
    }

    this.resumeAutoplay();
  };

  onPointerDown(event: PointerEvent): void {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    if (this.slides().length <= 1) return;

    this.isPointerDown = true;
    this.hasMoved = false;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.pauseAutoplay();

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('pointermove', this.windowPointerMove, { passive: true });
      window.addEventListener('pointerup', this.windowPointerUp);
      window.addEventListener('pointercancel', this.windowPointerUp);
    }
  }

  private cleanupPointer(): void {
    this.isPointerDown = false;
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('pointermove', this.windowPointerMove);
      window.removeEventListener('pointerup', this.windowPointerUp);
      window.removeEventListener('pointercancel', this.windowPointerUp);
    }
  }

  onSlideClick(event: MouseEvent): void {
    if (this.isDragging() || this.hasMoved) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  shouldNavigate(): boolean {
    return !this.isDragging();
  }

  isSlideActive(idx: number): boolean {
    return this.virtualIndex() === idx;
  }

  isPriority(idx: number): boolean {
    return this.slides().length <= 1 ? idx === 0 : idx === 1;
  }

  isInitialSlide(idx: number): boolean {
    return this.isPriority(idx);
  }
}