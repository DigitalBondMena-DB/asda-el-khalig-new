import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { IAllBreakingNews } from '../../../core/interfaces/slider/IBreakingNews';
import { ISliderHome } from '../../../core/interfaces/slider/ISliderHome';
import { RemoveInlineStylesPipe } from '../../../core/pipes/remove-inline-styles.pipe';
import { SafeHtmlPipe } from '../../../core/pipes/safe-html.pipe';
import { CategoriesService } from '../../../core/services/content/categories.service';
import { HomeContentService } from '../../../core/services/content/home/home-content.service';
import { NewsControlService } from '../../../core/services/shared/news-control.service';

@Component({
  selector: 'app-founding-hero',
  imports: [
    CarouselModule,
    RouterLink,
    NgxSkeletonLoaderModule,
    SafeHtmlPipe,
    RemoveInlineStylesPipe,
    NgClass,
  ],
  templateUrl: './founding-hero.component.html',
  styleUrl: './founding-hero.component.scss'
})
export class FoundingHeroComponent {
  @Input({ required: true }) isNational: boolean = false;
  sliderData!: ISliderHome;
  masterBlog!: any;
  allBreakingNews!: IAllBreakingNews;
  constructor(
    private _NewsControlService: NewsControlService,
    private _HomeContentService: HomeContentService,
    private _CategoriesService: CategoriesService
  ) { }
  ngOnInit(): void {
    this.getBreakingNews();
    this.getSliderData();
    this.onClickGetLastEditorNewsId();
  }

  getBreakingNews() {
    this._NewsControlService.getBreakingNews().subscribe({
      next: (response) => {
        this.allBreakingNews = response;
      },
    });
  }

  getSliderData() {
    this._HomeContentService.getHomeSlider().subscribe({
      next: (response) => {
        this.sliderData = response;
      },
    });
  }

  onClickGetLastEditorNewsId(): void {
    this._CategoriesService.getEditorBlog().subscribe({
      next: (response) => {
        if (response?.blogs) {
          this.masterBlog = response;
        }
      },
    });
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
  isDragging = false; // Track dragging state

  onDragStart() {
    this.isDragging = true;
  }

  onDragEnd() {
    setTimeout(() => (this.isDragging = false), 200); // Delay to avoid immediate click
  }

  shouldNavigate(): boolean {
    return !this.isDragging;
  }
}
