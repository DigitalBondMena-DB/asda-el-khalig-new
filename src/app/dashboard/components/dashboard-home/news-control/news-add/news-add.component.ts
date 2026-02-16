import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
// PrimeNG Imports
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JoditAngularModule } from 'jodit-angular';
import 'jodit/esm/plugins/add-new-line/add-new-line.js';
import 'jodit/esm/plugins/bold/bold.js';
import 'jodit/esm/plugins/clipboard/clipboard.js';
import 'jodit/esm/plugins/color/color.js';
import 'jodit/esm/plugins/copy-format/copy-format.js';
import 'jodit/esm/plugins/drag-and-drop/drag-and-drop.js';
import 'jodit/esm/plugins/file/file.js';
import 'jodit/esm/plugins/fullsize/fullsize.js';
import 'jodit/esm/plugins/iframe/iframe.js';
import 'jodit/esm/plugins/image-processor/image-processor.js';
import 'jodit/esm/plugins/image/image.js';
import 'jodit/esm/plugins/indent/indent.js';
import 'jodit/esm/plugins/justify/justify.js';
import 'jodit/esm/plugins/line-height/line-height.js';
import 'jodit/esm/plugins/preview/preview.js';
import 'jodit/esm/plugins/resizer/resizer.js';
import 'jodit/esm/plugins/search/search.js';
import 'jodit/esm/plugins/select/select.js';
import 'jodit/esm/plugins/source/source.js';
import 'jodit/esm/plugins/symbols/symbols.js';
import 'jodit/esm/plugins/video/video.js';

import { HttpClient } from '@angular/common/http';
import moment from 'moment-hijri'; // Import the Hijri moment library
import { JoditConfig, NgxJoditComponent } from 'ngx-jodit';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { IBlog } from '../../../../../core/interfaces/IBlog';
import { CategoriesService } from '../../../../services/categories.service';
import { NewsControlService } from '../../../../services/news-control.service';
import { WritersService } from '../../../../services/writers.service';
import { PrivewBlogComponent } from './privew-blog/privew-blog.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { InputSwitchModule } from 'primeng/inputswitch';
import {
  IFileBrowserAjaxOptions,
  IUploader,
  IUploaderAnswer,
  IUploaderData,
} from 'jodit/esm/types';
import { Jodit } from 'jodit';

@Component({
  selector: 'app-news-add',
  standalone: true,
  imports: [
    EditorModule,
    FileUploadModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ReactiveFormsModule,
    JoditAngularModule,
    FormsModule,
    NgxJoditComponent,
    ToastModule,
    DropdownModule,
    MultiSelectModule,
    CommonModule,
    CalendarModule,
    PrivewBlogComponent,
    DialogModule,
    NgxSpinnerModule,
    ProgressBarModule,
    TableModule,
    InputSwitchModule,
  ],
  templateUrl: './news-add.component.html',
  styleUrl: './news-add.component.scss',
  providers: [MessageService],
})
export class NewsAddComponent implements OnInit {
  articleContent: string = ''; // Used for the editor content
  currenBlogId: number = 0;
  isPreview: boolean = false; // Toggle preview mode
  hijriDate!: string;
  hijriMonthNames: string[] = [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الآخر',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوّال',
    'ذو القعدة',
    'ذو الحجة',
  ];
  hijriDayNames: string[] = [
    'الأحد',
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
  ];
  value = '';
  authors: any[] = [];
  categories: any[] = [];
  currentImageSrc: string = '';
  currentDate = '';
  approveDialogVisible = false;
  currentBlog!: IBlog;

  addArticleForm: FormGroup = new FormGroup({
    post_image: new FormControl('', [Validators.required]),
    post_title: new FormControl('', [Validators.required]),
    author_name: new FormControl('', [Validators.required]),
    post_date: new FormControl('', [Validators.required]),
    post_content: new FormControl('', [Validators.required]),
    post_subtitle: new FormControl(''),
    categories: new FormControl([], [Validators.required]),
    publish_status: new FormControl(1),
  });

  constructor(
    private _CategoriesService: CategoriesService,
    private _WritersService: WritersService,
    private _NewsControlService: NewsControlService,
    private _MessageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private _ActivatedRoute: ActivatedRoute,
    private _NgxSpinnerService: NgxSpinnerService,
    private _Router: Router
  ) {}

  async ngOnInit() {
    this.logoFile = await this.localImageToFile(
      '/assets/images/Logotop.png',
      'logo.png'
    );
    this.getAllAuthors();
    this.getAllCategories();
    this.primengConfig.setTranslation({
      accept: 'تأكيد',
      reject: 'إلغاء',
      cancel: 'إلغاء',
      dayNames: this.hijriDayNames,
      dayNamesShort: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
      dayNamesMin: this.hijriDayNames,
      monthNames: this.hijriMonthNames,
      monthNamesShort: [
        'محرم',
        'صفر',
        'ربيع الأول',
        'ربيع الآخر',
        'جمادى الأولى',
        'جمادى الآخرة',
        'رجب',
        'شعبان',
        'رمضان',
        'شوّال',
        'ذو القعدة',
        'ذو الحجة',
      ],
      today: 'اليوم',
      clear: 'مسح',
    });
    // Set the initial Hijri date
    this.hijriDate = moment().format('iYYYY-iMM-iDD'); // Current Hijri date
    this.addArticleForm.get('post_date')?.setValue(this.hijriDate);
    this.currentDate = moment(this.hijriDate, 'iYYYY-iMM-iDD').format(
      'YYYY-MM-DD'
    );
  }

  getAllAuthors(): void {
    this._WritersService.getAllWriters().subscribe({
      next: (response) => {
        this.authors = response.rows
          .filter((e) => e.writer_status === 1)
          .map((e) => {
            return {
              label: e.writer_name,
              value: e.writer_name,
            };
          });
      },
    });
  }

  getAllCategories(): void {
    this._CategoriesService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.rows.map((e) => {
          return {
            label: e.name,
            value: e.slug.toString(),
          };
        });
        this.inOpenCheckCurrentBlog();
      },
    });
  }
  isEditing: boolean = false;
  loadingBlog: boolean = true;
  inOpenCheckCurrentBlog() {
    this.loadingBlog = false;
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        let id = params.get('id');
        if (id) {
          this.isEditing = true;
          this.currenBlogId = +id;
          this._NewsControlService.getNewsById(+id).subscribe({
            next: (response) => {
              let Data = response.row;
              this.addArticleForm.get('post_title')?.setValue(Data.post_title);
              this.addArticleForm
                .get('post_subtitle')
                ?.setValue(
                  Data.post_subtitle != 'null' ? Data.post_subtitle : ''
                );
              this.addArticleForm
                .get('author_name')
                ?.setValue(Data.author_name);
              this.addArticleForm
                .get('post_date')
                ?.setValue(moment(Data.post_date).format('iYYYY-iMM-iDD'));
              this.addArticleForm
                .get('publish_status')
                ?.setValue(Data.publish_status);
              this.addArticleForm
                .get('post_content')
                ?.setValue(Data.post_content);
              this.currentImageSrc = Data.post_image;
              this.addArticleForm.get('post_image')?.setErrors(null);
              this.addArticleForm.get('categories')?.setValue(
                Data.category.concat(Data.categorynew).map((e) => {
                  const foundCategory = this.categories.find(
                    (cat) => cat.value === e.category_slug
                  );
                  return foundCategory ? foundCategory.value : '';
                })
              );
              this.loadingBlog = true;
            },
            error: (response) => {
              this.loadingBlog = true;
            },
          });
        } else {
          this.loadingBlog = true;
        }
      },
    });
  }

  onDateSelect(event: any) {
    const selectedHijriDate = moment(event).format('YYYY-MM-DD'); // Convert Gregorian to Hijri
  }

  onSubmit(): void {
    const formValues = this.addArticleForm.value;
    const formData = new FormData();
    formData.append('post_title', formValues.post_title);
    formData.append('post_content', formValues.post_content);
    formData.append('meta_title', formValues.post_title);
    formData.append('post_subtitle', formValues.post_subtitle);
    formData.append('meta_description', formValues.post_title);
    formData.append('author_name', formValues.author_name);
    formData.append('post_date', this.currentDate);
    formData.append('publish_status', formValues.publish_status);

    if (formValues.post_image) {
      formData.append(
        'post_image',
        formValues.post_image,
        formValues.post_image.name
      );
    }
    formValues.categories.forEach((element: any) => {
      formData.append('categoryIDS[]', element);
    });

    if (this.addArticleForm.valid) {
      const formValues = this.addArticleForm.value;
      const formData = new FormData();
      formData.append('post_title', formValues.post_title);
      formData.append('post_content', formValues.post_content);
      formData.append('meta_title', formValues.post_title);
      formData.append('post_subtitle', formValues.post_subtitle);
      formData.append('meta_description', formValues.post_title);
      formData.append('author_name', formValues.author_name);
      formData.append('post_date', this.currentDate);
      formData.append('publish_status', formValues.publish_status);
      if (formValues.post_image) {
        formData.append(
          'post_image',
          formValues.post_image,
          formValues.post_image.name
        );
      }
      formValues.categories.forEach((element: any) => {
        formData.append('categoryIDS[]', element);
      });

      // Fetch and append static image
      this.fetchAndAppendImage(formData).then((updatedFormData) => {
        this._NgxSpinnerService.show();
        if (!this.isEditing) {
          this._NewsControlService.addNews(formData).subscribe({
            next: (response) => {
              this._MessageService.add({
                severity: 'success',
                summary: 'تم النشر بنجاح',
                detail: 'تمت إضافة الموضوع بنجاح!',
              });
              this.addArticleForm.reset();
              this.addArticleForm.get('post_date')?.setValue(this.hijriDate);
              this.addArticleForm.get('post_content')?.setValue('');
              this.addArticleForm.get('publish_status')?.setValue(1);
              this.uploadedImages = [];
              this._NgxSpinnerService.hide();
              this.http
                .get('https://asda-alkhaleej.com/sitmaprender/ ')
                .subscribe();
            },
            error: (err) => {
              this._MessageService.add({
                severity: 'error',
                summary: 'خطأ في النشر',
                detail: 'حدث خطأ أثناء محاولة نشر الموضوع.',
              });
              this._NgxSpinnerService.hide();
            },
          });
        } else {
          formData.delete('post_date');
          this._NewsControlService
            .updateNews(this.currenBlogId, formData)
            .subscribe({
              next: (response) => {
                this._MessageService.add({
                  severity: 'success',
                  summary: 'تم النشر بنجاح',
                  detail: 'تمت إضافة الموضوع بنجاح!',
                });
                this.addArticleForm.reset();
                this.addArticleForm.get('post_date')?.setValue(this.hijriDate);
                this.addArticleForm.get('post_content')?.setValue('');
                this.addArticleForm.get('publish_status')?.setValue(1);
                this.uploadedImages = [];
                this._NgxSpinnerService.hide();
                this._Router.navigate(['/dashboard/news-control']);
                this.http
                  .get('https://asda-alkhaleej.com/sitmaprender/ ')
                  .subscribe();
              },
              error: (err) => {
                this._MessageService.add({
                  severity: 'error',
                  summary: 'خطأ في النشر',
                  detail: 'حدث خطأ أثناء محاولة نشر الموضوع.',
                });
                this._NgxSpinnerService.hide();
              },
            });
        }
      });
    }
  }

  fetchAndAppendImage(formData: FormData): Promise<FormData> {
    return fetch('/assets/images/Logotop.png')
      .then((response) => response.blob())
      .then((blob) => {
        const staticFile = new File([blob], 'layer_image.jpg', {
          type: 'image/jpeg',
        });
        formData.append('layer_image', staticFile);
        return formData;
      })
      .catch((error) => {
        console.error('Failed to fetch static image:', error);
        return formData;
      });
  }

  clearInputs(): void {
    this.addArticleForm.reset();
    this.addArticleForm.get('post_date')?.setValue(this.hijriDate);
    this.addArticleForm.get('post_content')?.setValue('');
    this.uploadedImages = [];
    this.addArticleForm.get('publish_status')?.setValue(1);
  }

  onFileSelect(event: any): void {
    const files: File[] = event.files;

    if (files && files.length > 0) {
      const file = files[0];

      // ✅ Compress the image before storing it
      this.compressImage(file).then((compressedFile) => {
        if (compressedFile) {
          this.addArticleForm.patchValue({ post_image: compressedFile });
        } else {
          console.error('❌ Image compression failed');
        }
      });
    }
  }

  approveBlog() {
    const formValues = this.addArticleForm.value;
    const imageURL = formValues.post_image
      ? URL.createObjectURL(formValues.post_image)
      : '';
    this.currentBlog = {
      status: '',
      blog: {
        post_id: 1,
        post_title: formValues.post_title,
        post_subtitle: formValues.post_subtitle,
        post_date: this.currentDate,
        post_content: formValues.post_content,
        post_image: imageURL || this.currentImageSrc,
        author_name: formValues.author_name,
        category_name: '',
        category_slug: '',
      },
      comments: [],
    };

    this.approveDialogVisible = true;
  }

  http = inject(HttpClient);
  uploadedImages: {
    original: string;
    processed: string | null;
    status: string;
    sizeValid: boolean;
    file?: File; // ✅ Make file an optional property
  }[] = [];

  canPublish: boolean = true; // ✅ Flag to control publishing
  hasInvalidImages: boolean = false;

  // async onEditorInput(): Promise<void> {
  //   const joditEditor = this.ngxJodit?.jodit;
  //   if (!joditEditor) return;

  //   const images = Array.from(joditEditor.editor.querySelectorAll('img'));
  //   const currentImageUrls = images.map((img: any) => img.src);

  //   // Clean up uploaded images array by removing ones that are no longer in use
  //   this.uploadedImages = this.uploadedImages.filter((image) => {
  //     const stillExists =
  //       currentImageUrls.includes(image.original) ||
  //       (image.processed && currentImageUrls.includes(image.processed)) ||
  //       image.status === 'removed';

  //     // Revoke object URL for Base64 images or Blob URLs
  //     if (!stillExists) {
  //       if (image.original.startsWith('blob:')) {
  //         URL.revokeObjectURL(image.original);
  //       }
  //       if (image.processed && image.processed.startsWith('blob:')) {
  //         URL.revokeObjectURL(image.processed);
  //       }
  //     }

  //     return stillExists;
  //   });

  //   for (const img of images) {
  //     if (!(img instanceof HTMLImageElement)) continue;
  //     let imgSrc = img.src;

  //     // Skip if logo is already applied or image is from a trusted source
  //     if (
  //       img.hasAttribute('data-logo-applied') ||
  //       imgSrc.includes('https://asda-alkhaleej.com/blogs/')
  //     ) {
  //       continue;
  //     }

  //     const existingImage = this.uploadedImages.find(
  //       (image) => image.original === imgSrc || image.processed === imgSrc
  //     );
  //     if (existingImage) continue;

  //     let imageFile: File | null = null;

  //     // Convert Base64 to File immediately
  //     if (imgSrc.startsWith('data:image')) {
  //       imageFile = this.base64ToFile(imgSrc, 'temp.jpg');
  //       // Revoke Base64 URL immediately after conversion
  //       URL.revokeObjectURL(imgSrc);
  //     } else {
  //       // Handle regular image URLs
  //       // imageFile = await this.urlToFile(imgSrc, 'temp.jpg');
  //     }

  //     if (imageFile) {
  //       // Compress the image
  //       const compressedFile = await this.compressImage(imageFile); // Compress image
  //       if (compressedFile) {
  //         imageFile = compressedFile;
  //         img.src = URL.createObjectURL(imageFile); // Update image source with compressed image URL
  //       }
  //     }

  //     // If the image is still too large, remove it and mark it invalid
  //     if (imageFile && imageFile.size > 1 * 1024 * 1024) {
  //       console.warn(`Image removed (too large): ${imgSrc}`);
  //       img.remove();
  //       this.uploadedImages.push({
  //         original: URL.createObjectURL(imageFile),
  //         file: imageFile,
  //         processed: null,
  //         status: 'removed',
  //         sizeValid: false,
  //       });
  //       continue;
  //     }

  //     // Mark the image as loading and add to uploaded images list
  //     this.uploadedImages.push({
  //       original: imgSrc,
  //       processed: null,
  //       status: 'loading',
  //       sizeValid: true,
  //     });

  //     const index = this.uploadedImages.length - 1;
  //     const newSrc = await this.uploadImageWithLogo(imgSrc);

  //     // Apply the logo and update the status
  //     if (newSrc) {
  //       img.src = newSrc;
  //       img.setAttribute('data-logo-applied', 'true');
  //       this.uploadedImages[index].processed = newSrc;
  //       this.uploadedImages[index].status = 'success';
  //     } else {
  //       this.uploadedImages[index].status = 'failed';
  //     }

  //     // Revoke Base64 and Blob URLs after processing
  //     if (imgSrc.startsWith('data:image')) {
  //       URL.revokeObjectURL(imgSrc); // Revoke Base64 URL
  //     }
  //     if (imgSrc.startsWith('blob:')) {
  //       URL.revokeObjectURL(imgSrc); // Revoke Blob URL
  //     }
  //   }

  //   this.checkPublishingStatus();
  //   this.addArticleForm.patchValue({
  //     post_content: joditEditor.value,
  //   });
  // }

  // async compressImage(imageFile: File): Promise<File | null> {
  //   try {
  //     let compressionQuality = 90; // Start with high quality
  //     let resizePercentage = 100; // Keep full resolution initially
  //     let compressedBlob: Blob | null = null;

  //     do {
  //       const compressedBase64 = await this.imageCompress.compressFile(
  //         URL.createObjectURL(imageFile), // Use File URL
  //         -1, // Auto-detect orientation
  //         compressionQuality,
  //         resizePercentage
  //       );

  //       compressedBlob = await this.base64ToBlob(compressedBase64); // Convert Base64 to Blob

  //       if (!compressedBlob) {
  //         console.error('Compression failed');
  //         return null;
  //       }

  //       imageFile = new File([compressedBlob], imageFile.name, {
  //         type: compressedBlob.type,
  //       });

  //       // Reduce quality & resize gradually if still too large
  //       if (imageFile.size > 1 * 1024 * 1024) {
  //         compressionQuality -= 5; // Reduce quality
  //         resizePercentage -= 5; // Shrink image slightly
  //       }
  //     } while (imageFile.size > 1 * 1024 * 1024 && compressionQuality > 10);

  //     return imageFile.size <= 1 * 1024 * 1024 ? imageFile : null;
  //   } catch (error) {
  //     console.error('Error compressing image:', error);
  //     return null;
  //   }
  // }

  // Convert Base64 to Blob
  async base64ToBlob(base64: string): Promise<Blob | null> {
    try {
      const response = await fetch(base64);
      return await response.blob();
    } catch (error) {
      console.error('Error converting Base64 to Blob:', error);
      return null;
    }
  }

  // Convert Base64 to File
  base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  checkPublishingStatus() {
    this.hasInvalidImages = this.uploadedImages.some(
      (image) => !image.sizeValid || image.status === 'failed'
    );

    this.canPublish =
      this.uploadedImages.length > 0 && // Ensure at least one valid image
      !this.hasInvalidImages && // No failed images
      this.uploadedImages.every((image) => image.status === 'success'); // All processed
  }
  isUploading: boolean = false;
  // async uploadImageWithLogo(imageSrc: string): Promise<string | null> {
  //   try {
  //     const formData = new FormData();
  //     const imageFile = await this.urlToFile(
  //       imageSrc,
  //       `image_${Date.now()}.jpg`
  //     );
  //     if (!imageFile) {
  //       console.warn('Skipping image upload: File is too large or invalid');
  //       return null; // 🚨 Prevent API call
  //     }

  //     const logoFile = await this.urlToFile(
  //       '/assets/images/Logotop.png',
  //       'logo.png'
  //     );
  //     if (!logoFile) {
  //       console.error('Logo file missing, skipping upload.');
  //       return null;
  //     }

  //     formData.append('post_image', imageFile);
  //     formData.append('layer_image', logoFile);
  //     this.isUploading = true;
  //     const response = await this.http
  //       .post<{ success: string }>(
  //         'https://www.asda-alkhaleej.com/asdaanews/api/changeimagepath',
  //         formData
  //       )
  //       .toPromise();

  //     this.isUploading = false;
  //     return response?.success || null;
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //     return null;
  //   }
  // }
  // async urlToFile(url: string, filename: string): Promise<File | null> {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.crossOrigin = 'anonymous'; // Try to bypass CORS restrictions
  //     img.src = url;

  //     img.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       canvas.width = img.width;
  //       canvas.height = img.height;

  //       const ctx = canvas.getContext('2d');
  //       if (!ctx) {
  //         console.error('Canvas not supported!');
  //         resolve(null);
  //         return;
  //       }

  //       ctx.drawImage(img, 0, 0);
  //       canvas.toBlob((blob) => {
  //         if (!blob) {
  //           console.error('Failed to convert image to Blob.');
  //           resolve(null);
  //           return;
  //         }

  //         if (blob.size > 1 * 1024 * 1024) {
  //           console.warn(`Skipping image: ${url}, File too large`);
  //           resolve(null);
  //           return;
  //         }

  //         resolve(new File([blob], filename, { type: blob.type }));
  //       }, 'image/jpeg');
  //     };

  //     img.onerror = (error) => {
  //       console.error(`Failed to load image: ${url}`, error);
  //       resolve(null);
  //     };
  //   });
  // }

  // ==============================
  // ==============================
  // ==============================
  // Method to remove HTML tags from the content
  stripHtml(value: string): string {
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.body.textContent || ''; // Return the raw text content
  }

  // ==============================
  // ==============================
  // ==============================
  // Method to check content length
  contentLengthWarning: string | null = null;
  contentArabicWarning: string | null = null;
  isContentEmpty: boolean = true; // Track if the content is empty
  checkContentLength(value: string): void {
    if (value.length < 200) {
      this.contentLengthWarning =
        'من الأفضل أن يتضمن النص ما لا يقل عن 200 حرف لزيادة جودة المقال.';
    } else {
      this.contentLengthWarning = null;
    }
  }
  // Method to check if content contains Arabic text
  checkContentArabic(value: string): void {
    const arabicWordRegex = /[\u0600-\u06FF]/;
    if (!arabicWordRegex.test(value)) {
      this.contentArabicWarning =
        'يفضل أن يحتوي النص على كلمات باللغة العربية لزيادة التفاعل.';
    } else {
      this.contentArabicWarning = null;
    }
  }
  arabicWarning: string | null = null;
  seoTitleWarning: string | null = null;
  duplicateWordWarning: string | null = null;
  checkArabicText(value: string): string | null {
    const arabicWordRegex = /[\u0600-\u06FF]/;
    if (!value?.includes('<img') && !arabicWordRegex?.test(value)) {
      return 'من الأفضل أن يتضمن النص كلمات باللغة العربية لتحسين الفهم والتفاعل.';
    }
    return null;
  }
  checkSeoTitle(value: string): string | null {
    if (value.length < 60 || value.length > 80) {
      return 'ينصح بأن يتراوح طول العنوان بين 60 و 80 حرفًا لضمان جاذبية أفضل لمحركات البحث.';
    }
    if (!/[\u0600-\u06FF]/.test(value)) {
      return 'يفضل أن يتضمن العنوان كلمات رئيسية باللغة العربية لتسهيل البحث عنها.';
    }
    return null;
  }
  checkDuplicateWords(value: string): string | null {
    const words = value.split(' ');
    const wordCount = words.reduce((acc: any, word: any) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const duplicateWords = Object.values(wordCount).filter(
      (count: any) => count > 1
    );
    if (duplicateWords.length > 0) {
      return 'ينصح بتجنب تكرار الكلمات للحصول على عنوان أكثر وضوحًا.';
    }
    return null;
  }
  minContentLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      const wordCount = value
        .split(' ')
        .filter((word: any) => word.length > 0).length;
      return wordCount >= minLength
        ? null
        : {
            minContentLength: `يجب أن يحتوي الموضوع على الأقل على ${minLength} كلمة`,
          };
    };
  }

  // ==============================
  // ==============================
  // ==============================
  // jodit configurations

  options: JoditConfig = {
    uploader: {
      url: 'about:blank',

      insertImageAsBase64URI: false,
      method: 'POST',
      format: 'json',
      imagesExtensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
      filesVariableName: () => 'post_image',
      pathVariableName: '',
      withCredentials: false,
      data: () => new FormData(), // ✅ Prevents Jodit from appending 'source'
      processFileName: function (
        key: string,
        file: File,
        name: string
      ): [string, File, string] {
        return [key, file, name.replace(/\s+/g, '_')]; // Fix filename
      },

      getDisplayName: function (baseurl: string, filename: string): string {
        return filename; // Return filename properly
      },

      prepareData: async (formData: FormData) => {
        // ✅ Get all images from FormData
        const files: File[] = [];
        formData.forEach((value, key) => {
          if (key === 'post_image' && value instanceof File) {
            files.push(value);
          }
        });

        // ✅ If no images found, return FormData unchanged
        if (!files.length) {
          console.warn('⚠️ No images found in FormData.');
          return formData;
        }

        // ✅ Process each image asynchronously
        this.showLoader(); // Show loader before upload
        for (const file of files) {
          await this.uploadImage(file);
        }
        this.hideLoader(); // Hide loader after upload

        // ✅ Return empty FormData since each image is uploaded separately
        return new FormData(); // Prevents Jodit from sending any images itself
      },

      isSuccess: (resp: IUploaderAnswer): boolean => false,

      process: (resp: any): any => '',

      defaultHandlerError: (e: Error) => {
        console.error('❌ Jodit Upload Error:', e.message);
      },

      error: (e: Error): void => {
        console.error('❌ Upload Failed:', e);
      },

      contentType: (file: File) => file.type,
      getMessage: function (this: IUploader, resp: IUploaderAnswer): string {
        throw new Error('Function not implemented.');
      },
      defaultHandlerSuccess: function (resp: IUploaderData): void {
        throw new Error('Function not implemented.');
      },
    },

    events: {
      // ✅ Handle drag & drop images
      beforeFilePaste: async (data: { files: FileList }, editor: Jodit) => {
        const files = Array.from(data.files);
        for (const file of files) {
          await this.uploadImage(file);
        }
        return false; // Prevent Jodit from handling the image
      },

      // ✅ Handle copy-paste images
      paste: async (event: ClipboardEvent, editor: any) => {
        const items = event.clipboardData?.items;
        if (!items) return;

        // event.preventDefault(); // Prevent default paste behavior
        let hasImage = false;
        this.showLoader(); // Show loader before upload

        const uploadPromises: Promise<void>[] = [];

        for (const item of Array.from(items)) {
          // Ensure iteration works
          if (item.kind === 'file' && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            console.log(file);
            hasImage = true;

            if (file) {
              uploadPromises.push(this.uploadImage(file)); // Collect upload promises
            }
          }
        }

        await Promise.all(uploadPromises); // Wait for all uploads to complete
        if (hasImage) {
          event.preventDefault(); // Only prevent pasting if an image is detected
        }
        this.hideLoader(); // Hide loader after all images finish uploading
      },

      // ✅ Handle inserting images manually
      afterInsertImage: (event: any) => {
        event.preventDefault();
      },
    },
    spellcheck: true,
    language: 'ar',
    minHeight: 600,
  };

  async compressImage(file: File): Promise<File | null> {
    console.log('compressImage');

    try {
      console.log('Compressing image:', file);

      // 🔹 Change maxWidth and maxHeight for better quality
      const compressedBlob = await this.resizeImage(file, 800, 800, file.type);

      if (!(compressedBlob instanceof Blob)) {
        console.error('Compressed result is not a valid Blob:', compressedBlob);
        return null;
      }

      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
      });

      console.log('✅ Compressed File:', compressedFile);
      return compressedFile;
    } catch (error) {
      console.error('❌ Compression error:', error);
      return null;
    }
  }

  async uploadImage(file: File, delayTime = 500) {
    // Default delay: 500ms
    console.log('📤 Uploading image:', file.name, file.size / 1024 / 1024);

    // ✅ 1️⃣ Compress the image
    const compressedFile = await this.compressImage(file);
    if (!compressedFile) {
      console.error('❌ Image compression failed:', file.name);
      return;
    }

    console.log(
      '📤 Compressed:',
      compressedFile.name,
      compressedFile.size / 1024 / 1024
    );

    // ✅ 2️⃣ Convert Logo to File
    const logoFile = await this.localImageToFile(
      '/assets/images/Logotop.png',
      'logo.png'
    );
    if (!logoFile) {
      console.error('❌ Logo conversion failed. Skipping upload.');
      return;
    }

    // ✅ 3️⃣ Generate a truly unique filename
    const uniqueFilename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}-${compressedFile.name}`;

    const formData = new FormData();
    formData.append('post_image', compressedFile, uniqueFilename);
    formData.append('layer_image', logoFile, logoFile.name);

    console.log('📤 Sending FormData:', uniqueFilename);

    // ✅ 4️⃣ Introduce a small delay before making the request
    await new Promise((resolve) => setTimeout(resolve, delayTime));

    try {
      // ✅ 5️⃣ Append a unique timestamp to prevent caching
      const apiUrl = `https://www.asda-alkhaleej.com/asdaanews/api/changeimagepath?t=${Date.now()}-${Math.random()}`;

      // ✅ 6️⃣ Send the request
      const response = await fetch(apiUrl, { method: 'POST', body: formData });
      const data = await response.json();

      console.log('✅ Upload successful:', data);

      if (data.success) {
        const imageUrl = data.success;
        console.log('🖼️ Image Uploaded:', imageUrl);

        // ✅ 7️⃣ Slightly delay image insertion to prevent race conditions
        setTimeout(() => {
          this.editor.selection.insertImage(imageUrl);
        }, 100);
      } else {
        console.error('❌ Upload response does not contain a valid image URL');
      }
    } catch (err) {
      console.error('❌ Upload failed:', err);
    }
  }

  async resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number,
    mimeType: string
  ): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context not found'));

        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const scaleFactor = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * scaleFactor);
          height = Math.round(height * scaleFactor);
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error('❌ Failed to create Blob');
              return reject(new Error('Compression failed'));
            }
            console.log('✅ Successfully created Blob:', blob);
            resolve(blob);
          },
          mimeType,
          1 // Quality
        );
      };
      img.onerror = (err) => reject(err);
    });
  }

  async localImageToFile(imagePath: string, filename: string): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imagePath; // Path to your local asset
      img.crossOrigin = 'Anonymous'; // Ensures CORS doesn't block canvas
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas not supported');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) {
            console.error('❌ Failed to create blob.');
            return reject(null);
          }
          const file = new File([blob], filename, { type: 'image/png' });
          resolve(file);
        }, 'image/png');
      };
      img.onerror = (err) => reject(err);
    });
  }
  // Show loader
  showLoader() {
    this.loading = true;
    this._NgxSpinnerService.show('loading'); // If using ngx-_NgxSpinnerService
  }
  loading = false; // Track loading state

  // Hide loader
  hideLoader() {
    this.loading = false;
    this._NgxSpinnerService.hide('loading'); // If using ngx-_NgxSpinnerService
  }
  _optionsStr = '';
  imageCompress = inject(NgxImageCompressService);
  editor!: Jodit;
  @ViewChild('ngxJodit', { static: false }) ngxJodit!: NgxJoditComponent;
  logoFile: File | null = null;

  ngAfterViewInit(): void {
    this.editor = this.ngxJodit.jodit as Jodit;

    this.addArticleForm.get('post_title')?.valueChanges.subscribe((value) => {
      this.arabicWarning = this.checkArabicText(value);
      this.seoTitleWarning = this.checkSeoTitle(value);
      this.duplicateWordWarning = this.checkDuplicateWords(value);
    });
  }
}
