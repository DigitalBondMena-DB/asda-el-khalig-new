import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment-hijri'; // Import the Hijri moment library
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitch, InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Category, IBlog } from '../../../../../core/interfaces/INewsControl';
import { CategoriesService } from '../../../../services/categories.service';
import { NewsControlService } from '../../../../services/news-control.service';

interface categories {
  label: string;
  value: string;
}

@Component({
  selector: 'app-fast-news',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    InputTextModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    RatingModule,
    FormsModule,
    TooltipModule,
    InputSwitchModule,
  ],
  templateUrl: './fast-news.component.html',
  styleUrl: './fast-news.component.scss',
  providers: [MessageService], // Provide MessageService here
})
export class FastNewsComponent {
  blogs!: IBlog[];

  selectedBlogs: IBlog[] = [];

  blog: IBlog = {} as IBlog;

  blogDialog: boolean = false;

  submitted: boolean = false;

  statuses: any[] = [];

  cols!: any[];

  messages: Message[] | undefined;

  categories: categories[] = [];

  selectedStatus: string = '';

  getPagesArray() {
    return [100, 500, 1000, this.blogs.length].sort(
      (a: number, b: number) => a - b
    );
  }

  onFilterChange(value: string): void {
    if (value) {
      // Filter the blogs based on the selected category
      this.selectedBlogs = this.blogs.filter((blog) =>
        blog.category
          .concat(blog.categorynew)
          .some((cat) => cat.category_name.includes(value))
      );
    } else {
      // Reset to original data if no category is selected
      this.selectedBlogs = [...this.blogs];
    }
  }

  constructor(
    private _NewsControlService: NewsControlService,
    private messageService: MessageService,
    private _CategoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: 'post_id', header: 'رقم المدونة' },
      { field: 'post_title', header: 'عنوان المدونة' },
      { field: 'post_date', header: 'تاريخ النشر' },
    ];
    this.getNewsData();
    this.getAllCategories();
  }

  formatToolTip(categoryArr: Category[], categoryArr02: Category[]): string {
    return categoryArr
      .concat(categoryArr02)
      .map((e) => e.category_name)
      .join(' - ');
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
      },
    });
  }
  getNewsData(): void {
    this._NewsControlService.getAllNews().subscribe({
      next: (response) => {
        let newData = (response.rows = response.rows.map((e) => {
          // Modify the post_date and return the updated object
          e.post_date = moment(e.post_date).format('iD iMMMM iYYYY | hh:mm A');
          e.post_date = e.post_date.replace('AM', 'ص').replace('PM', 'م');
          return e; // Return the updated object
        }));
        this.blogs = newData;
        this.selectedBlogs = newData;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'حدث خطأ أثناء جلب البيانات',
        });
      },
    });
  }

  editBlog(blog: IBlog): void {
    this.blog = { ...blog };
    this.blogDialog = true;
  }

  saveBlog(): void {
    this.submitted = true;
    if (this.blog.post_title && this.blog.post_content) {
      if (this.blog.id) {
        // Update existing blog
        this.messages = [
          {
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم تحديث المدونة',
            life: 3000,
          },
        ];
        // Call blogService.updateBlog(this.blog)
      } else {
        // Create new blog
        this.messages = [
          {
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم إنشاء المدونة',
            life: 3000,
          },
        ];
        // Call blogService.createBlog(this.blog)
      }
      this.blogDialog = false;
      this.blog = {} as IBlog;
    }
  }

  hideDialog(): void {
    this.blogDialog = false;
    this.submitted = false;
  }

  onGlobalFilter(dt: any, event: any): void {
    dt.filterGlobal(event.target.value, 'contains');
  }

  toggleBlogStatus(blog: IBlog): void {
    if (blog.breaking_news_status == 0) {
      this._NewsControlService.breakingNewsDisable(blog.id).subscribe({
        next: (response) => {
          // this.handleLoadingSpinner(spinner, btn_container, btn);

          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم تحديث المدونة',
          });
        },
      });
    } else {
      this._NewsControlService.breakingNewsEnable(blog.id).subscribe({
        next: (response) => {
          // this.handleLoadingSpinner(spinner, btn_container, btn);
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم تحديث المدونة',
          });
        },
      });
    }
  }
  handleLoadingSpinner(
    spinner: HTMLElement,
    btn_container: HTMLElement,
    btn: InputSwitch
  ) {
    btn.readonly = !btn.readonly;
    btn_container.classList.toggle('opacity-25');
    spinner.classList.toggle('opacity-0');
  }
}
