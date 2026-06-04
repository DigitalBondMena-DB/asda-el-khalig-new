import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BlankNavbarComponent } from '../../../core/components/blank-navbar/blank-navbar.component';
import { IPrivacyPolicyRow } from '../../../core/interfaces/IPrivacyPolicy';
import { SafeHtmlPipe } from '../../../core/pipes/safe-html.pipe';
import { PrivacyPolicyService } from '../../../core/services/shared/privacy-policy.service';

@Component({
  selector: 'app-privacy-policy',
  imports: [BlankNavbarComponent, SafeHtmlPipe],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicyComponent {
  private _PrivacyPolicyService = inject(PrivacyPolicyService)
  privacy_policy = signal<IPrivacyPolicyRow | null>(null);

  constructor() { }

  ngOnInit(): void {
    this._PrivacyPolicyService.getPrivacyPolicy().subscribe({
      next: (response) => {
        this.privacy_policy.set(response.row);
      },
    });
  }
}
