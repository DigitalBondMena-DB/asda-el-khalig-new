import { isPlatformBrowser, SlicePipe } from '@angular/common';
import {
  afterNextRender,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { filter, Subject, takeUntil } from 'rxjs';
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
export class BlogsComponent implements OnInit, OnDestroy {
  currentId!: string;
  specificCategories: ISpecificCategory | null = null;
  imageLoadedFlag = false;
  currentPage = 1;
  totalItems = 0;
  isShowSkeleton = true;
  skeleton: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  private destroy$ = new Subject<void>();
  isDesktop: boolean = true; // Default check

  constructor(
    private _CategoriesService: CategoriesService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: object
  ) {
    afterNextRender(() => {
      this.isDesktop = window.innerWidth > 992;
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
    this.isDesktop = window.innerWidth > 992;
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

  private listenToRouteChanges(): void {
    this._Router.events
      .pipe(
        takeUntil(this.destroy$),
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  pageChanged(page: number): void {
    this.isShowSkeleton = true;
    window.scrollTo(0, 0);
    this.currentPage = page;
    this.loadCategoryData(this.currentId, page);
  }

  getInitialId(): void {
    this._ActivatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.currentId = id;
          this.loadCategoryData(id, this.currentPage);
        }
      });
  }

  loadCategoryData(categoryId: string, page: number): void {
    this.isShowSkeleton = false;
    this._CategoriesService
      .getCurrentCategories(categoryId, page)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.specificCategories = response as ISpecificCategory;
          this.totalItems = response?.blogs?.total || 0;
          this.isShowSkeleton = false;
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
