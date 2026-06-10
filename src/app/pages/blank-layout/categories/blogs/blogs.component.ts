import { isPlatformBrowser, SlicePipe } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { filter } from 'rxjs';
import { ISpecificCategory } from '../../../../core/interfaces/ISpecificCategory';
import { HijriDatePipe } from '../../../../core/pipes/date-hijri.pipe';
import { ImagesSrcPipe } from '../../../../core/pipes/images-src.pipe';
import { RemoveInlineStylesPipe } from '../../../../core/pipes/remove-inline-styles.pipe';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { StringSlicePipe } from '../../../../core/pipes/string-slice.pipe';
import { StringSpliterPipe } from '../../../../core/pipes/string-spliter.pipe';
import { CategoriesService } from '../../../../core/services/content/categories.service';

@Component({
  selector: 'app-blogs',
  imports: [
    HijriDatePipe,
    StringSlicePipe,
    RouterLink,
    NgxPaginationModule,
    ImagesSrcPipe,
    NgxSkeletonLoaderModule,
    SafeHtmlPipe,
    RemoveInlineStylesPipe,
    StringSpliterPipe,
    SlicePipe,
  ],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  private _CategoriesService = inject(CategoriesService);
  private _Router = inject(Router);
  private _ActivatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private _PLATFORM_ID = inject(PLATFORM_ID);
  currentId = signal<string>('');
  specificCategories = signal<ISpecificCategory | null>(null);
  imageLoadedFlag = signal(false);
  currentPage = signal(1);
  totalItems = signal(0);
  isShowSkeleton = signal(true);
  skeleton = signal<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  isDesktop = signal<boolean>(true); // Default check
  private destroyRef = inject(DestroyRef);

  constructor(
  ) {
    afterNextRender(() => {
      this.isDesktop.set(window.innerWidth > 992);
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.listenToRouteChanges();
      this.getInitialId();
    }
  }
  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.isDesktop.set(window.innerWidth > 992);
    }
  }
  private updateCanonicalUrl(): void {
    if (!isPlatformBrowser(this._PLATFORM_ID)) return
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

  private listenToRouteChanges(): void {
    this._Router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updateMeta();
        this.updateCanonicalUrl();
      });
  }

  private updateMeta(): void {
    // Extract the last segment of the route
    const lastSegment = this._ActivatedRoute.snapshot.paramMap.get('id');

    const categoryTitles: { [key: string]: string } = {
      '01': 'أخبار محلية',
      '02': 'أخبار العالم',
      '03': 'الرياضة',
      f: 'ثقافة وفن',
      '04': 'الاقتصاد',
      '05': 'التعليم',
      '08': 'المقالات',
      i: 'تحقيقات',
      '09': 'أخبار المجتمع',
      '07': 'دراسات وأبحاث',
      '11': 'كاريكاتير',
      g: 'الصحة والحياة',
      '06': 'علوم وتكنولوجيا',
      h: 'وقائع أمنية',
      y: 'منوعات',
      '10': 'زاوية رئيس التحرير',
    };

    const staticPart = 'المقالات | صحيفة أصداء الخليج';
    const pageTitle =
      lastSegment && categoryTitles[lastSegment]
        ? `${staticPart} ${categoryTitles[lastSegment]}`
        : staticPart;

    // ✅ Set Meta Title
    this.titleService.setTitle(pageTitle);

    // ✅ Set Meta Description
    this.metaService.updateTag({
      name: 'description',
      content: `صحيفة أصداء الخليج صحيفة سعودية مرخصة تقدم الأخبار والتقارير الحصرية ، برئاسة رئيس التحرير سلمان بن أحمد العيد تابع أحدث المستجدات السياسية الاقتصادية والرياضية`,
    });
  }

  handleImages(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      setTimeout(() => {
        const images = document.querySelectorAll('img');
        images.forEach((img) => {
          let src = img.getAttribute('src') as string;
          let newSrc = src.includes('watanye')
            ? src.replace(/watanye/g, 'asda-alkhaleej')
            : src;
          if (src.includes('watanye')) {
            img.setAttribute('src', newSrc);
          }
        });
      }, 0);
    }
  }

  pageChanged(page: number): void {
    this.isShowSkeleton.set(true);
    window.scrollTo(0, 0);
    this.currentPage.set(page);
    this.loadCategoryData(this.currentId(), page);
  }

  getInitialId(): void {
    this._ActivatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.currentId.set(id);
          this.loadCategoryData(id, this.currentPage());
        }
      });
  }

  loadCategoryData(categoryId: string, page: number): void {
    this.isShowSkeleton.set(false);
    this._CategoriesService
      .getCurrentCategories(categoryId, page)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.specificCategories.set(response as ISpecificCategory);
          this.totalItems.set(response?.blogs?.total || 0);
          this.isShowSkeleton.set(false);
          this.updateMeta();
          this.handleImages();
        },
      });
  }

  imageLoaded(event: Event): void {
    const targetImage = event.target as HTMLElement;
    targetImage.nextElementSibling?.classList.add('d-none');
  }
}
