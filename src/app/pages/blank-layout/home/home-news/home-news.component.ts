import { SlicePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { IBlog, IBlogs } from '../../../../core/interfaces/ISpecificCategory';
import { HijriDatePipe } from '../../../../core/pipes/date-hijri.pipe';
import { ImagesSrcPipe } from '../../../../core/pipes/images-src.pipe';
import { StringSpliterPipe } from '../../../../core/pipes/string-spliter.pipe';
import { CategoriesService } from '../../../../core/services/content/categories.service';
import { HomeContentService } from '../../../../core/services/content/home/home-content.service';

@Component({
  selector: 'app-home-news',
  standalone: true,
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
})
export class HomeNewsComponent {
  allNews: IBlog[] = [];
  blogs!: IBlogs;
  newsTitle: string = 'الأخبار';
  currentCategoryId!: string;
  currentSlugId: string = '03';
  skeleton: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  isDesktop = input();

  @ViewChild('PlaceHolder') PlaceHolder!: ElementRef;
  @ViewChildren('categoryBtn') navBtns!: QueryList<ElementRef>;
  constructor(
    private _HomeContentService: HomeContentService,
    private _CategoriesService: CategoriesService,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    if (this.PlaceHolder)
      this.PlaceHolder.nativeElement.classList.add('d-none');
    this.getRandomNews();
  }
  ngOnDestroy(): void {
    if (this.PlaceHolder)
      this.PlaceHolder.nativeElement.classList.add('d-none');
  }
  getRandomNews(): void {
    this.allNews = [];
    if (this.PlaceHolder)
      this.PlaceHolder.nativeElement.classList.remove('d-none');
    this._HomeContentService.getHomeRandomNews().subscribe({
      next: (response) => {
        this.allNews = response?.blogs?.data || [];
        // this.currentSlugId = response.blogs.data[0].;
        if (this.PlaceHolder)
          this.PlaceHolder.nativeElement.classList.add('d-none');
      },
    });
  }

  getAnotherCategories(categoryId: string): void {
    this.allNews = [];
    if (this.PlaceHolder)
      this.PlaceHolder.nativeElement.classList.remove('d-none');
    this._CategoriesService.getCurrentCategories(categoryId).subscribe({
      next: (response) => {
        this.allNews = response?.blogs?.data || [];
        if (this.PlaceHolder)
          this.PlaceHolder.nativeElement.classList.add('d-none');
      },
    });
  }

  openCurrentSlug(slugId: string): void {
    this._Router.navigate([`/archives`, slugId]);
  }

  toggleClickedBtns(element: Event): void {
    this.navBtns.forEach((btn) => {
      let input = btn.nativeElement as HTMLElement;
      input.classList.remove('active');
    });
    let input = element.target as HTMLElement;
    this.newsTitle = input.innerText;
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
