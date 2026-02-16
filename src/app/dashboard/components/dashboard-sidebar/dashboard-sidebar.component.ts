import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../auth/interfaces/ILoginResponse';
import { AppLayoutServiceService } from '../../services/app.layout.service.service';
import { MenuitemComponent } from '../menuitem/menuitem.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [MenuitemComponent, ConfirmDialogModule],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss',
  providers: [ConfirmationService],
})
export class DashboardSidebarComponent {
  model: any[] = [];
  constructor(
    public layoutService: AppLayoutServiceService,
    public el: ElementRef,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: Object,
    private _Router: Router,
    private _ConfirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    let currentRole!: User;
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      currentRole = JSON.parse(localStorage.getItem('user') || '');
    }
    if (currentRole && currentRole.role == 'admin') {
      this.isUserAdmin();
    } else {
      this.isUserWriter();
    }
  }

  isUserAdmin() {
    this.model = [
      {
        label: 'الرئيسية',
        items: [
          {
            label: 'لوحة التحكم',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/dashboard'],
          },
        ],
      },
      {
        label: 'الأخبار',
        items: [
          {
            label: 'إدارة الأخبار',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/dashboard/news-control'],
          },
          {
            label: 'إضافة خبر جديد',
            icon: 'pi pi-fw pi-plus',
            routerLink: ['/dashboard/news-add'],
          },
          {
            label: 'إدارة أخبار عاجلة',
            icon: 'pi pi-fw pi-flag',
            routerLink: ['/dashboard/fast-news'],
          },
        ],
      },
      {
        label: 'إدارة الأقسام',
        items: [
          {
            label: 'إدارة الأقسام',
            icon: 'pi pi-fw pi-folder',
            routerLink: ['/dashboard/categories'],
          },
          // {
          //   label: 'إضافة قسم جديد',
          //   icon: 'pi pi-fw pi-plus-circle',
          //   routerLink: ['/dashboard/category-add'],
          // },
        ],
      },
      {
        label: 'التعليقات',
        items: [
          {
            label: 'إدارة التعليقات',
            icon: 'pi pi-fw pi-comments',
            routerLink: ['/dashboard/comments'],
          },
        ],
      },
      {
        label: 'الكتاب',
        items: [
          {
            label: 'إدارة الكتاب',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/dashboard/users-control'],
          },
        ],
      },
      {
        label: 'الصفحات',
        items: [
          {
            label: 'الهيكل الإداري',
            icon: 'pi pi-fw pi-sitemap',
            routerLink: ['/dashboard/administrator'],
          },
          {
            label: 'حول الموقع',
            icon: 'pi pi-fw pi-info-circle',
            routerLink: ['/dashboard/about-us'],
          },
          {
            label: 'سياسة الخصوصية',
            icon: 'pi pi-fw pi-lock',
            routerLink: ['/dashboard/privacy-policy'],
          },
          {
            label: 'تواصل معنا',
            icon: 'pi pi-fw pi-envelope',
            routerLink: ['/dashboard/contact-us'],
          },
        ],
      },
      {
        label: 'روابط السوشيال ميديا',
        items: [
          {
            label: 'إدارة الروابط',
            icon: 'pi pi-fw pi-share-alt',
            routerLink: ['/dashboard/social-media-control'],
          },
        ],
      },
      {
        label: 'فيديو الرئيسية',
        items: [
          {
            label: 'إدارة فيديو الرئيسية',
            icon: 'pi pi-fw pi-youtube',
            routerLink: ['/dashboard/youtube'],
          },
        ],
      },
      {
        label: 'الإعدادات',
        items: [
          {
            label: 'إعدادات لوحة التحكم',
            icon: 'pi pi-fw pi-cog',
          },
          {
            label: 'تسجيل الخروج',
            icon: 'pi pi-fw pi-sign-out',
            command: () => this.logout(),
          },
        ],
      },
    ];
  }
  isUserWriter() {
    this.model = [
      {
        label: 'الرئيسية',
        items: [
          {
            label: 'لوحة التحكم',
            icon: 'pi pi-fw pi-home',
          },
        ],
      },
      {
        label: 'الأخبار',
        items: [
          {
            label: 'إدارة الأخبار',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/dashboard/news-control'],
          },
          {
            label: 'إضافة خبر جديد',
            icon: 'pi pi-fw pi-plus',
            routerLink: ['/dashboard/news-add'],
          },
          {
            label: 'إدارة أخبار عاجلة',
            icon: 'pi pi-fw pi-flag',
            routerLink: ['/dashboard/fast-news'],
          },
        ],
      },
      {
        label: 'التعليقات',
        items: [
          {
            label: 'إدارة التعليقات',
            icon: 'pi pi-fw pi-comments',
            routerLink: ['/dashboard/comments'],
          },
        ],
      },
      {
        label: 'الكتاب',
        items: [
          {
            label: 'إدارة الكتاب',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/dashboard/users-control'],
          },
        ],
      },
      {
        label: 'الإعدادات',
        items: [
          {
            label: 'إعدادات لوحة التحكم',
            icon: 'pi pi-fw pi-cog',
          },
          {
            label: 'تسجيل الخروج',
            icon: 'pi pi-fw pi-sign-out',
            command: () => this.logout(),
          },
        ],
      },
    ];
  }
  logout(): void {
    this._ConfirmationService.confirm({
      message: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      header: 'تأكيد تسجيل الخروج',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'لا',
      acceptLabel: 'نعم',
      closeOnEscape: true,
      acceptButtonStyleClass: 'p-button-danger mx-2',

      accept: () => {
        localStorage.removeItem('user');
        this._Router.navigate(['/login']);
      },
      reject: () => {},
    });
  }
}
