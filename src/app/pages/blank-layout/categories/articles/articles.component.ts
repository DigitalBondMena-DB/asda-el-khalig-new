import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../../core/interfaces/ISpecificCategory';
import { ImagesSrcPipe } from '../../../../core/pipes/images-src.pipe';
import { RemoveInlineStylesPipe } from '../../../../core/pipes/remove-inline-styles.pipe';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { CategoriesService } from '../../../../core/services/content/categories.service';

@Component({
    selector: 'app-articles',
    imports: [
        RouterLink,
        NgxPaginationModule,
        NgxSkeletonLoaderModule,
        ImagesSrcPipe,
        SafeHtmlPipe,
        RemoveInlineStylesPipe,
    ],
    templateUrl: './articles.component.html',
    styleUrl: './articles.component.scss'
})
export class ArticlesComponent {
  currentId!: string;
  specificCategories!: ISpecificCategory | null;
  currentPage: number = 1;
  totalItems: number = 0;
  isShowSkeleton: boolean = true;

  pageChanged(e: number) {
    this.isShowSkeleton = true;
    window.scrollTo(0, 0);
    this.currentPage = e;
    this._CategoriesService
      .getCurrentCategories(this.currentId, this.currentPage)
      .subscribe({
        next: (response) => {
          this.isShowSkeleton = false;
          this.specificCategories = response as ISpecificCategory;
          this.totalItems = response?.blogs.total as number;
        },
      });
  }

  constructor(
    private _CategoriesService: CategoriesService,
    private _ActivatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.getInitialId();
      this.updateCanonicalUrl();
      this.updateMeta();
    }
  }

  private updateCanonicalUrl(): void {
    if (window.location.href) {
      const canonicalUrl = window.location.href;

      // ✅ Remove existing canonical tag if it exists
      const existingCanonical = document.querySelectorAll('[rel="canonical"]');
      if (existingCanonical.length > 0) {
        existingCanonical.forEach((e) => e.remove());
      }

      // ✅ Add a new canonical tag
      this.metaService.addTag({ rel: 'canonical', href: canonicalUrl });
    }
  }

  private updateMeta(): void {
    const staticPart = 'المقالات | صحيفة أصداء الخليج';

    // ✅ Set Meta Title
    this.titleService.setTitle(`${staticPart} المقالات`);

    // ✅ Set Meta Description
    this.metaService.updateTag({
      name: 'description',
      content: `صحيفة أصداء الخليج صحيفة سعودية مرخصة تقدم الأخبار والتقارير الحصرية ، برئاسة رئيس التحرير سلمان بن أحمد العيد تابع أحدث المستجدات السياسية الاقتصادية والرياضية`,
    });
  }

  getInitialId(): void {
    // Extract 'id' from the current route on page load
    const id = this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        let id = params.get('id');
        if (id) {
          this.currentId = id;
          this.getCurrentCategory(this.currentId);
        }
      },
    });
  }

  getCurrentCategory(blogId: string): void {
    this.isShowSkeleton = true;
    this._CategoriesService.getCurrentCategories(blogId).subscribe({
      next: (response) => {
        this.isShowSkeleton = false;
        const newArr = (response as ISpecificCategory).blogs.data.map(
          (blog) => {
            return {
              ...blog,
              post_content: blog.post_content.replaceAll('&nbsp;', ''),
            };
          }
        );
        (response as ISpecificCategory).blogs.data = newArr;
        console.log(newArr);
        this.specificCategories = response as ISpecificCategory;
        this.totalItems = response?.blogs.total as number;
      },
    });
  }
}
