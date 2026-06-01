import { NgClass, SlicePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  IBlogs,
  ISpecificCategory,
} from '../../../core/interfaces/ISpecificCategory';
import { HijriDatePipe } from '../../../core/pipes/date-hijri.pipe';
import { ImagesSrcPipe } from '../../../core/pipes/images-src.pipe';
import { StringSpliterPipe } from '../../../core/pipes/string-spliter.pipe';
import { CategoriesService } from '../../../core/services/content/categories.service';
import { HomeContentService } from '../../../core/services/content/home/home-content.service';

@Component({
    selector: 'app-founding-news',
    imports: [
        NgxSkeletonLoaderModule,
        SlicePipe,
        RouterLink,
        ImagesSrcPipe,
        HijriDatePipe,
        CarouselModule,
        NgxPaginationModule,
        StringSpliterPipe,
        NgClass,
    ],
    templateUrl: './founding-news.component.html',
    styleUrl: './founding-news.component.scss'
})
export class FoundingNewsComponent {
  @Input({ required: true }) isNational: boolean = true;
  allNews!: ISpecificCategory | undefined;
  blogs!: IBlogs;
  newsTitle: string = 'الأخبار';
  currentCategoryId!: string;
  currentSlugId: string = this.isNational ? 'nation_day' : 'foundation_day';
  currentPage = 1;
  totalItems = 0;
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
    this.currentSlugId = this.isNational ? 'nation_day' : 'foundation_day';
    this.getAnotherCategories(this.currentSlugId, this.currentPage);
  }
  ngOnDestroy(): void {
    if (this.PlaceHolder)
      this.PlaceHolder.nativeElement.classList.add('d-none');
  }

  pageChanged(page: number): void {
    this.currentPage = page;
    this.getAnotherCategories(this.currentSlugId, this.currentPage);
    this.allNews = {} as ISpecificCategory;
  }

  // getRandomNews(): void {
  //   if (this.PlaceHolder)
  //     this.PlaceHolder.nativeElement.classList.remove('d-none');
  //   this._HomeContentService.getHomeRandomNews().subscribe({
  //     next: (response) => {
  //       console.log(this.allNews);
  //       this.allNews = response?.blogs?.data ;
  //       // this.currentSlugId = response.blogs.data[0].;
  //       if (this.PlaceHolder)
  //         this.PlaceHolder.nativeElement.classList.add('d-none');
  //     },
  //   });
  // }

  getAnotherCategories(categoryId: string, page: number): void {
    if (this.PlaceHolder)
      this.PlaceHolder.nativeElement.classList.remove('d-none');
    this._CategoriesService.getCurrentCategories(categoryId, page).subscribe({
      next: (response) => {
        console.log(this.totalItems);
        this.allNews = response as ISpecificCategory;
        this.totalItems = response?.blogs.total as number;
        if (this.PlaceHolder)
          this.PlaceHolder.nativeElement.classList.add('d-none');
      },
    });
  }

  imageLoaded(e: any) {
    let targetImage = e.target as HTMLElement;
    targetImage.nextElementSibling?.classList.add('d-none');
  }

  skeltonArray = [0, 1, 2, 3, 4, 5, 6, 7];

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
