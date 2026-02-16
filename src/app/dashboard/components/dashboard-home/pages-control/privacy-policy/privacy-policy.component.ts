import { Component, ViewChild } from '@angular/core';
import { IPrivacyPolicyRow } from '../../../../../core/interfaces/IPrivacyPolicy';
import { PrivacyPolicyService } from '../../../../services/privacy-policy.service';
import { HijriDatePipe } from '../../../../../core/pipes/date-hijri.pipe';
import { SafeHtmlPipe } from '../../../../../core/pipes/safe-html.pipe';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { JoditAngularModule } from 'jodit-angular';
import { JoditConfig, NgxJoditComponent } from 'ngx-jodit';
import 'jodit/esm/plugins/add-new-line/add-new-line.js';
import 'jodit/esm/plugins/bold/bold.js';
import 'jodit/esm/plugins/fullsize/fullsize.js';
import 'jodit/esm/plugins/indent/indent.js';
import 'jodit/esm/plugins/resizer/resizer.js';
import 'jodit/esm/plugins/color/color.js';
import 'jodit/esm/plugins/iframe/iframe.js';
import 'jodit/esm/plugins/justify/justify.js';
import 'jodit/esm/plugins/source/source.js';
import 'jodit/esm/plugins/drag-and-drop/drag-and-drop.js';
import 'jodit/esm/plugins/search/search.js';
import 'jodit/esm/plugins/line-height/line-height.js';
import 'jodit/esm/plugins/video/video.js';
import 'jodit/esm/plugins/file/file.js';
import 'jodit/esm/plugins/copy-format/copy-format.js';
import 'jodit/esm/plugins/select/select.js';
import 'jodit/esm/plugins/symbols/symbols.js';
import 'jodit/esm/plugins/preview/preview.js';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    HijriDatePipe,
    SafeHtmlPipe,
    MessagesModule,
    ToastModule,
    ButtonModule,
    EditorModule,
    FormsModule,
    CommonModule,
    JoditAngularModule,
    NgxJoditComponent,
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  providers: [MessageService],
})
export class PrivacyPolicyComponent {
  privacy_policy!: IPrivacyPolicyRow;
  isEditing: boolean = false;

  // Jodit Editor Configuration
  options: JoditConfig = {
    uploader: {
      insertImageAsBase64URI: true,
    } as any,
    spellcheck: true,
    language: 'ar',
    minHeight: 600,
  };

  constructor(
    private _PrivacyPolicyService: PrivacyPolicyService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._PrivacyPolicyService.getPrivacyPolicy().subscribe({
      next: (response) => {
        this.privacy_policy = response.row;
      },
    });
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
    this.options = {
      uploader: {
        insertImageAsBase64URI: true,
      } as any,
      spellcheck: true,
      language: 'ar',
      minHeight: 600,
    };
  }

  saveChanges() {
    // Call your service to save the updated data
    this._PrivacyPolicyService
      .updatePrivacyPolicy(this.privacy_policy)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم حفظ التغييرات بنجاح',
          });
          this.isEditing = false;
        },
        error: (err) => {
          // Handle error
        },
      });
  }
}
