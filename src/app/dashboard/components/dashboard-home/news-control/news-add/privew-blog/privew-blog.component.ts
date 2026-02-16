import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlankNavbarComponent } from '../../../../../../core/components/blank-navbar/blank-navbar.component';
import { IBlog } from '../../../../../../core/interfaces/IBlog';
import { IGetOneBlogResponse } from '../../../../../../core/interfaces/INewsControl';
import { HijriDatePipe } from '../../../../../../core/pipes/date-hijri.pipe';
import { ImagesSrcPipe } from '../../../../../../core/pipes/images-src.pipe';
import { SafeHtmlPipe } from '../../../../../../core/pipes/safe-html.pipe';
import { AdvertisingAreaComponent } from '../../../../../../shared/components/advertising-area/advertising-area.component';
import { ShareButtons } from 'ngx-sharebuttons/buttons';

@Component({
  selector: 'app-privew-blog',
  standalone: true,
  imports: [
    AdvertisingAreaComponent,
    BlankNavbarComponent,
    HijriDatePipe,
    SafeHtmlPipe,
    ImagesSrcPipe,
    RouterLink,
    ShareButtons,
  ],
  templateUrl: './privew-blog.component.html',
  styleUrl: './privew-blog.component.scss',
})
export class PrivewBlogComponent {
  @Input() IBlogs!: IBlog;
  masterBlog!: any;
  currentUrl: string = '';

  reviewImage(image: any) {}
  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
