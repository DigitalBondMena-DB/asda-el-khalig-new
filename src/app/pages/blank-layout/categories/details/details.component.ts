import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  Component,
  DestroyRef,
  ElementRef,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  signal,
  ViewChild,
  DOCUMENT
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ToastrService } from 'ngx-toastr';
import { BlankNavbarComponent } from '../../../../core/components/blank-navbar/blank-navbar.component';
import { IBlog } from '../../../../core/interfaces/IBlog';
import { HijriDatePipe } from '../../../../core/pipes/date-hijri.pipe';
import { ImagesSrcPipe } from '../../../../core/pipes/images-src.pipe';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { CategoriesService } from '../../../../core/services/content/categories.service';
import { AdvertisingAreaComponent } from '../../../../shared/components/advertising-area/advertising-area.component';
import { RelatedContentComponent } from '../related-content/related-content.component';
import { CommentsService } from '../../../../core/services/shared/comments.service';
import { RemoveInlineStylesPipe } from '../../../../core/pipes/remove-inline-styles.pipe';

@Component({
  selector: 'app-details',
  imports: [
    NgxSkeletonLoaderModule,
    AdvertisingAreaComponent,
    RelatedContentComponent,
    ReactiveFormsModule,
    BlankNavbarComponent,
    CommonModule,
    HijriDatePipe,
    SafeHtmlPipe,
    ImagesSrcPipe,
    RouterLink,
    RemoveInlineStylesPipe,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, AfterContentInit, OnDestroy {
  currentId = signal<string>('');
  IBlogs = signal<IBlog | null>(null);
  userComments = signal<string>('');
  isStoreData = signal<boolean>(false);
  isShowSkeleton = signal<boolean>(true);
  masterBlog = signal<any>(null);
  currentUrl = signal<string>('');
  isLoading = signal<boolean>(false);
  @ViewChild('isStoreDataInput') isStoreDataInput!: ElementRef;
  @ViewChild('stickySection') stickySection!: ElementRef;
  private destroyRef = inject(DestroyRef);

  constructor(
    private _CategoriesService: CategoriesService,
    private _ActivatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: object,
    private _ToastrService: ToastrService,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private renderer: Renderer2,
    private _CommentsService: CommentsService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  encodeURIComponent(value: string): string {
    return encodeURIComponent(value);
  }

  copyLink(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      navigator.clipboard.writeText(this.currentUrl()).then(() => {
        this._ToastrService.success('تم نسخ الرابط بنجاح');
      }).catch(err => {
        this._ToastrService.error('فشل في نسخ الرابط');
      });
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (window.location.href) {
        const canonicalUrl = window.location.href;

        // ✅ Find and remove existing canonical tag
        const existingCanonical = document.querySelector(
          'link[rel="canonical"]'
        );
        if (existingCanonical) {
          existingCanonical.remove();
        }

        // ✅ Add the new canonical tag
        this.metaService.addTag({ rel: 'canonical', href: canonicalUrl });
      }
    }

    this.getInitialId();
    this.onClickGetLastEditorNewsId();
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

  ngAfterContentInit(): void {
    this.checkForUserDataInLocalStorage();
  }

  getInitialId(): void {
    this._ActivatedRoute.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (params) => {
        let id = params.get('id');
        if (id) {
          this.currentId.set(id);
          this.getCurrentBlog(this.currentId());
          if (isPlatformBrowser(this._PLATFORM_ID)) {
            this.currentUrl.set(window.location.href); // Get the current URL
            // this.currentUrl.set(`https://www.asda-alkhaleej.com/archives/${id}`); // Get the current URL
          }
        }
      },
    });
  }

  getCurrentBlog(blogId: string): void {
    // this.IBlogs.set(this._ActivatedRoute.snapshot.data['article']);
    // if(typeof window != "undefined") {
    //   setTimeout(() => {
    //     document.querySelector('.lightBox-details')?.classList.add('d-none');
    //   }, 500);
    // }
    // this.changeMeta();
    this.isShowSkeleton.set(true);
    this._CategoriesService.getBlogById(blogId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.IBlogs.set(response as IBlog);
        // Update meta tags after the blog data is loaded
        this.changeMeta();
        this.isShowSkeleton.set(false);
        this.handleImages();
        this.updateCanonicalUrl(this.router.url);
        // this.removeStyles();
      },
    });
  }

  onClickGetLastEditorNewsId(): void {
    this._CategoriesService.getEditorBlog().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.masterBlog.set(response);
      },
    });
  }

  userDataForm: FormGroup = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userComment: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(150),
    ]),
  });

  saveData(event: Event): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      let inputSaveData = event.target as HTMLInputElement;
      if (inputSaveData.checked) {
        this.isStoreData.set(true);
      } else {
        this.isStoreData.set(false);
        localStorage.removeItem('userData');
      }
    }
  }

  storeData() {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userName: this.userNameForm?.value,
          userEmail: this.userEmailForm?.value,
        })
      );
    }
  }

  onSubmitComment(): void {
    if (this.userDataForm.valid) {
      this.isLoading.set(true);

      let commentData = {
        ...this.userDataForm.value,
        blog_id: this.currentId(),
      };

      this._CommentsService.addComment(commentData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (response) => {
          if (this.isStoreData()) {
            this.storeData();
          }
          this.isLoading.set(false);
          this._ToastrService.success('تم ارسال التعليق بنجاح');
          this.userDataForm.reset();
        },
      });
    } else {
      this.userDataForm.markAllAsTouched();
      this._ToastrService.error('تحقق من البيانات المدخلة');
    }
  }

  checkForUserDataInLocalStorage(): boolean {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      let userData = localStorage.getItem('userData');
      if (userData) {
        if (this.isStoreDataInput)
          this.isStoreDataInput.nativeElement.checked = true;
        this.isStoreData.set(true);
        let currentData = JSON.parse(userData);
        Object.keys(currentData).forEach((key) => {
          this.userDataForm.get(key)?.setValue(currentData[key]);
        });
      }
      return true;
    }
    if (this.isStoreDataInput)
      this.isStoreDataInput.nativeElement.checked = false;
    return false;
  }

  get userNameForm() {
    return this.userDataForm.get('userName');
  }
  get userEmailForm() {
    return this.userDataForm.get('userEmail');
  }
  get userCommentForm() {
    return this.userDataForm.get('userComment');
  }
  private defaultTitle =
    'صحيفة أصداء الخليج | صحيفة سعودية مرخصة | رئيس التحرير سلمان بن أحمد العيد';
  private defaultDescription =
    'صحيفة أصداء الخليج صحيفة سعودية مرخصة تقدم الأخبار والتقارير الحصرية ، برئاسة رئيس التحرير سلمان بن أحمد العيد تابع أحدث المستجدات السياسية الاقتصادية والرياضية';
  private defaultImage = '/assets/favicon_io/apple-touch-icon.png';
  private defaultUrl = '/';

  changeMeta(): void {
    if (this.IBlogs()?.blog) {
      const post = this.IBlogs()!.blog;
      const postTitle = post.post_title;
      const metaDescription = this.decodeHtml(
        post.post_content.replace(/<[^>]+>/g, '').slice(0, 150)
      );

      // Ensure the post image is an absolute URL
      const postImage = post.post_image.startsWith('http')
        ? post.post_image
        : `https://www.asda-alkhaleej.com/${post.post_image}`;

      const postUrl = `https://www.asda-alkhaleej.com/articles/${post.post_id}`;

      // ✅ Update Page Title
      this.titleService.setTitle(postTitle);

      // ✅ Update Meta Tags
      this.metaService.updateTag({
        name: 'description',
        content: metaDescription,
      });

      // ✅ Open Graph Meta Tags (Facebook, LinkedIn, WhatsApp)
      this.metaService.updateTag({ property: 'og:title', content: postTitle });
      this.metaService.updateTag({
        property: 'og:description',
        content: metaDescription,
      });
      this.metaService.updateTag({ property: 'og:image', content: postImage });
      this.metaService.updateTag({
        property: 'og:url',
        content: postUrl,
      });

      // ✅ Twitter Meta Tags
      this.metaService.updateTag({
        name: 'twitter:card',
        content: 'summary_large_image',
      });
      this.metaService.updateTag({ name: 'twitter:title', content: postTitle });
      this.metaService.updateTag({
        name: 'twitter:description',
        content: metaDescription,
      });
      this.metaService.updateTag({ name: 'twitter:image', content: postImage });
      this.metaService.updateTag({
        name: 'twitter:url',
        content: postUrl,
      });

      // ✅ Update Favicon to Post Image
      this.updateFavicon(postImage);
    }
  }

  // Function to Dynamically Update Favicon
  updateFavicon(imageUrl: string) {
    let favicon = this.document.querySelector("link[rel='icon']") || null;

    if (favicon) {
      this.renderer.setAttribute(favicon, 'href', imageUrl);
    } else {
      // If no favicon exists, create a new one
      favicon = this.renderer.createElement('link');
      this.renderer.setAttribute(favicon, 'rel', 'icon');
      this.renderer.setAttribute(favicon, 'type', 'image/png');
      this.renderer.setAttribute(favicon, 'href', imageUrl);
      this.renderer.appendChild(this.document.head, favicon);
    }

    // ✅ Also update Apple Touch Icon
    let appleTouchIcon =
      this.document.querySelector("link[rel='apple-touch-icon']") || null;
    if (appleTouchIcon) {
      this.renderer.setAttribute(appleTouchIcon, 'href', imageUrl);
    } else {
      appleTouchIcon = this.renderer.createElement('link');
      this.renderer.setAttribute(appleTouchIcon, 'rel', 'apple-touch-icon');
      this.renderer.setAttribute(appleTouchIcon, 'href', imageUrl);
      this.renderer.appendChild(this.document.head, appleTouchIcon);
    }
  }

  decodeHtml(html: string): string {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      let decoded = txt.value;

      // Remove all HTML tags
      decoded = decoded
        .replace(/<[^>]*>/g, ' ') // Replace HTML tags with spaces
        .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
        .replace(/&nbsp;/g, ' ') // Replace encoded &nbsp;
        .replace(/\s+/g, ' '); // Normalize multiple spaces

      return decoded.trim(); // Trim extra spaces from start and end
    } else {
      return '';
    }
  }

  private updateCanonicalUrl(url: string): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const existingCanonical2 = document.querySelectorAll('[rel="canonical"]');
      if (existingCanonical2.length > 0) {
        existingCanonical2.forEach((e) => e.remove());
      }
      const canonicalSelector = 'link[rel="canonical"]';
      let existingCanonical = document.querySelector(
        canonicalSelector
      ) as HTMLLinkElement;

      if (existingCanonical) {
        existingCanonical.href = url;
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = `https://www.asda-alkhaleej.com${url}`;
        document.head.appendChild(link);
      }
    }
  }
  ngOnDestroy(): void {
    // Ensure meta tags are reset to default values
    this.titleService.setTitle(this.defaultTitle);

    this.metaService.updateTag({
      name: 'description',
      content: this.defaultDescription,
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: this.defaultTitle,
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: this.defaultDescription,
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: this.defaultUrl,
    });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({
      name: 'twitter:title',
      content: this.defaultTitle,
    });
    this.metaService.updateTag({
      name: 'twitter:description',
      content: this.defaultDescription,
    });
    this.metaService.updateTag({
      name: 'twitter:url',
      content: this.defaultUrl,
    });

    // Reset image meta tags only if IBlogs is available
    if (this.IBlogs()?.blog) {
      this.metaService.updateTag({
        property: 'og:image',
        content: this.IBlogs()!.blog.post_image || this.defaultImage,
      });
      this.metaService.updateTag({
        name: 'twitter:image',
        content: this.IBlogs()!.blog.post_image || this.defaultImage,
      });
    } else {
      console.warn(
        '⚠️ IBlogs data is not available during destruction. Using default image.'
      );
      this.metaService.updateTag({
        property: 'og:image',
        content: this.defaultImage,
      });
      this.metaService.updateTag({
        name: 'twitter:image',
        content: this.defaultImage,
      });
    }
  }
}
