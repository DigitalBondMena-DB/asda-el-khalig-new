import { Component } from '@angular/core';
import { BlankNavbarComponent } from '../../../core/components/blank-navbar/blank-navbar.component';
import { IPrivacyPolicyRow } from '../../../core/interfaces/IPrivacyPolicy';
import { SafeHtmlPipe } from '../../../core/pipes/safe-html.pipe';
import { PrivacyPolicyService } from '../../../dashboard/services/privacy-policy.service';
import { MetaTagsHandleService } from '../../../core/services/content/meta-tags-handle.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [BlankNavbarComponent, SafeHtmlPipe],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {
  privacy_policy!: IPrivacyPolicyRow;

  constructor(private _PrivacyPolicyService: PrivacyPolicyService) {}

  ngOnInit(): void {
    this._PrivacyPolicyService.getPrivacyPolicy().subscribe({
      next: (response) => {
        this.privacy_policy = response.row;
      },
    });
  }
}
