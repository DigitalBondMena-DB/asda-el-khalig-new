import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ContactUsFormComponent } from './contact-us-form/contact-us-form.component';
import { BlankNavbarComponent } from '../../../core/components/blank-navbar/blank-navbar.component';
import { SocialMediaService } from '../../../core/services/content/social-media.service';
import { ISocialMedia } from '../../../core/interfaces/ISocialMedia';
import { MetaTagsHandleService } from '../../../core/services/content/meta-tags-handle.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-contact-us',
  imports: [ContactUsFormComponent, BlankNavbarComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactUsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _SocialMediaService = inject(SocialMediaService);
  private readonly _MetaTagsHandleService = inject(MetaTagsHandleService);
  socialMediaLinks = signal<ISocialMedia | null>(null);


  ngOnInit(): void {
    this._MetaTagsHandleService.handleMeta();
    this.getSocialMediaLinks();
  }

  getSocialMediaLinks(): void {
    this._SocialMediaService.getSocialMediaLinks().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.socialMediaLinks.set(response);
        },
      });
  }
}
