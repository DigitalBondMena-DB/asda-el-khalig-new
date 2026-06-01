import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { IAllBreakingNews } from '../../../../core/interfaces/slider/IBreakingNews';
import { ISliderHome } from '../../../../core/interfaces/slider/ISliderHome';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { HomeContentService } from '../../../../core/services/content/home/home-content.service';
import { NewsControlService } from './../../../../core/services/shared/news-control.service';
import { RemoveInlineStylesPipe } from '../../../../core/pipes/remove-inline-styles.pipe';
import { HomeMasterComponent } from './home-master/home-master.component';
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-hero',
  imports: [
    CarouselModule,
    RouterLink,
    NgxSkeletonLoaderModule,
    SafeHtmlPipe,
    RemoveInlineStylesPipe,
    HomeMasterComponent,
    NgOptimizedImage
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  sliderData!: ISliderHome;
  allBreakingNews!: IAllBreakingNews;
  constructor(
    private _NewsControlService: NewsControlService,
    private _HomeContentService: HomeContentService,
  ) { }

  ngOnInit(): void {
    this.getBreakingNews();
    this.getSliderData();
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
