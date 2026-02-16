import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IAboutUsRow } from '../../../../../core/interfaces/IAboutUs';
import { AboutUsService } from '../../../../services/about-us.service';
import { HijriDatePipe } from '../../../../../core/pipes/date-hijri.pipe';
import { SafeHtmlPipe } from '../../../../../core/pipes/safe-html.pipe';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { NgxJoditComponent } from 'ngx-jodit';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { ToastModule } from 'primeng/toast';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SafeHtmlPipe,
    HijriDatePipe,
    ToastModule,
    ButtonModule,
    MessagesModule,
    EditorModule,
    NgxJoditComponent,
  ],
  templateUrl: './about-us-control.component.html',
  styleUrls: ['./about-us-control.component.scss'],
  providers: [MessageService],
})
export class AboutUsControlComponent {
  isEditing: boolean = false; // Track whether we're in edit mode or not
  aboutUsContent!: IAboutUsRow;

  // Jodit Editor Configuration
  editorConfig = {
    uploader: {
      insertImageAsBase64URI: true,
    },
    spellcheck: true,
    language: 'ar',
    minHeight: 600,
  };

  constructor(
    private _AboutUsService: AboutUsService,
    private messageService: MessageService,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this._AboutUsService.getAboutUs().subscribe({
      next: (response) => {
        this.aboutUsContent = response.row;
      },
    });
    this.updateCanonicalUrl();
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
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

  saveChanges() {
    // Call your service to save the updated data
    this._AboutUsService.updateAboutUs(this.aboutUsContent).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'نجاح',
          detail: 'تم حفظ التغييرات بنجاح',
        });
        this.isEditing = false;
      },
      error: (err) => {},
    });
  }
}
