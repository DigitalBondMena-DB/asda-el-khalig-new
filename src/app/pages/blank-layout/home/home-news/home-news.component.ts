import { SlicePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  QueryList,
  signal,
  viewChild,
  ViewChild,
  viewChildren,
  ViewChildren,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { IBlog } from '../../../../core/interfaces/ISpecificCategory';
import { HijriDatePipe } from '../../../../core/pipes/date-hijri.pipe';
import { ImagesSrcPipe } from '../../../../core/pipes/images-src.pipe';
import { StringSpliterPipe } from '../../../../core/pipes/string-spliter.pipe';
import { CategoriesService } from '../../../../core/services/content/categories.service';
import { HomeContentService } from '../../../../core/services/content/home/home-content.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-news',
  imports: [
    NgxSkeletonLoaderModule,
    SlicePipe,
    RouterLink,
    ImagesSrcPipe,
    HijriDatePipe,
    CarouselModule,
    StringSpliterPipe,
  ],
  templateUrl: './home-news.component.html',
  styleUrl: './home-news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeNewsComponent implements OnInit {
  private destroyRef = inject(DestroyRef)
  private _HomeContentService = inject(HomeContentService);
  private _CategoriesService = inject(CategoriesService);
  private _Router = inject(Router);

  isDesktop = input();
  allNews = signal<IBlog[]>([]);
  newsTitle = signal<string>('الأخبار');
  skeleton: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  PlaceHolder = viewChild<ElementRef>('PlaceHolder');
  navBtns = viewChildren<ElementRef>('categoryBtn');

  ngOnInit(): void {
    if (this.PlaceHolder())
      this.PlaceHolder()?.nativeElement.classList.add('d-none');
    this.getRandomNews();
  }
  ngOnDestroy(): void {
    if (this.PlaceHolder())
      this.PlaceHolder()?.nativeElement.classList.add('d-none');
  }
  getRandomNews(): void {
    this.allNews.set([]);
    if (this.PlaceHolder())
      this.PlaceHolder()?.nativeElement.classList.remove('d-none');
    this._HomeContentService.getHomeRandomNews().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.allNews.set(response?.blogs?.data || []);
        if (this.PlaceHolder())
          this.PlaceHolder()?.nativeElement.classList.add('d-none');
      },
    });
  }

  getAnotherCategories(categoryId: string): void {
    this.allNews.set([]);
    if (this.PlaceHolder())
      this.PlaceHolder()?.nativeElement.classList.remove('d-none');
    this._CategoriesService.getCurrentCategories(categoryId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.allNews.set(response?.blogs?.data || []);
        if (this.PlaceHolder())
          this.PlaceHolder()?.nativeElement.classList.add('d-none');
      },
    });
  }

  openCurrentSlug(slugId: string): void {
    this._Router.navigate([`/archives`, slugId]);
  }

  toggleClickedBtns(element: Event): void {
    this.navBtns()?.forEach((btn) => {
      let input = btn.nativeElement as HTMLElement;
      input.classList.remove('active');
    });
    let input = element.target as HTMLElement;
    this.newsTitle.set(input.innerText);
    input.classList.add('active');
  }
  imageLoaded(e: any) {
    let targetImage = e.target as HTMLElement;
    targetImage.nextElementSibling?.classList.add('d-none');
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 3,
    autoWidth: true,
    nav: true,
  };
}
