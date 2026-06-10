import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, signal, inject, OnInit } from '@angular/core';
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
export class ArticlesComponent implements OnInit {
  currentId = signal<string>('');
  specificCategories = signal<ISpecificCategory | null>(null);
  currentPage = signal<number>(1);
  totalItems = signal<number>(0);
  isShowSkeleton = signal<boolean>(true);

  private _CategoriesService = inject(CategoriesService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private _PLATFORM_ID = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.getInitialId();
      this.updateCanonicalUrl();
      this.updateMeta();
    }
  }

  pageChanged(e: number) {
    this.isShowSkeleton.set(true);
    window.scrollTo(0, 0);
    this.currentPage.set(e);
    this._CategoriesService
      .getCurrentCategories(this.currentId(), this.currentPage())
      .subscribe({
        next: (response) => {
          this.isShowSkeleton.set(false);
          this.specificCategories.set(response as ISpecificCategory);
          this.totalItems.set((response as ISpecificCategory)?.blogs?.total || 0);
        },
      });
  }

  private updateCanonicalUrl(): void {
    if (window.location.href) {
      const canonicalUrl = window.location.href;
      const existingCanonical = document.querySelectorAll('[rel="canonical"]');
      if (existingCanonical.length > 0) {
        existingCanonical.forEach((e) => e.remove());
      }
      this.metaService.addTag({ rel: 'canonical', href: canonicalUrl });
    }
  }

  private updateMeta(): void {
    const staticPart = 'المقالات | صحيفة أصداء الخليج';
    this.titleService.setTitle(`${staticPart} المقالات`);
    this.metaService.updateTag({
      name: 'description',
      content: `صحيفة أصداء الخليج صحيفة سعودية مرخصة تقدم الأخبار والتقارير الحصرية ، برئاسة رئيس التحرير سلمان بن أحمد العيد تابع أحدث المستجدات السياسية الاقتصادية والرياضية`,
    });
  }

  getInitialId(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        let id = params.get('id');
        if (id) {
          this.currentId.set(id);
          this.getCurrentCategory(id);
        }
      },
    });
  }

  getCurrentCategory(blogId: string): void {
    this.isShowSkeleton.set(true);
    this._CategoriesService.getCurrentCategories(blogId).subscribe({
      next: (response) => {
        this.isShowSkeleton.set(false);
        const newArr = (response as ISpecificCategory).blogs.data.map(
          (blog) => {
            return {
              ...blog,
              post_content: blog.post_content.replaceAll('&nbsp;', ''),
            };
          }
        );
        (response as ISpecificCategory).blogs.data = newArr;
        this.specificCategories.set(response as ISpecificCategory);
        this.totalItems.set((response as ISpecificCategory)?.blogs?.total || 0);
      },
    });
  }
}
