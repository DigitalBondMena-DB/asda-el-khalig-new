import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShareButtons } from 'ngx-sharebuttons/buttons';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlankNavbarComponent } from '../../../../../core/components/blank-navbar/blank-navbar.component';
import { IGetOneBlogResponse } from '../../../../../core/interfaces/INewsControl';
import { ImagesSrcPipe } from '../../../../../core/pipes/images-src.pipe';
import { SafeHtmlPipe } from '../../../../../core/pipes/safe-html.pipe';
import { AdvertisingAreaComponent } from '../../../../../shared/components/advertising-area/advertising-area.component';
import { NewsControlService } from '../../../../services/news-control.service';

@Component({
  selector: 'app-preview-section-comments',
  standalone: true,
  imports: [
    AdvertisingAreaComponent,
    RouterLink,
    SafeHtmlPipe,
    BlankNavbarComponent,
    ImagesSrcPipe,
    ShareButtons,
  ],
  templateUrl: './preview-section-comments.component.html',
  styleUrl: './preview-section-comments.component.scss',
})
export class PreviewSectionCommentsComponent {
  @Input() currentId!: number;
  currentUrl: string = '';
  masterBlog!: any;

  currentBlogFromComments!: IGetOneBlogResponse;

  constructor(
    private newsControlService: NewsControlService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  ngOnInit(): void {
    if (this.currentId) {
      this.ngxSpinnerService.show();
      this.newsControlService.getNewsById(this.currentId).subscribe({
        next: (response) => {
          this.currentBlogFromComments = response;
          this.ngxSpinnerService.hide();
        },
      });
    }
  }
}
