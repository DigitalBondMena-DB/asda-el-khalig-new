import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { BlankNavbarComponent } from '../../../core/components/blank-navbar/blank-navbar.component';
import { IAboutUsRow } from '../../../core/interfaces/IAboutUs';
import { SafeHtmlPipe } from '../../../core/pipes/safe-html.pipe';
import { MetaTagsHandleService } from '../../../core/services/content/meta-tags-handle.service';
import { AboutUsService } from '../../../core/services/shared/about-us.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-about-us',
  imports: [BlankNavbarComponent, SafeHtmlPipe],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutUsComponent {
  private readonly destroyRef = inject(DestroyRef);

  private readonly _AboutUsService = inject(AboutUsService);
  private readonly _MetaTagsHandleService = inject(MetaTagsHandleService);

  aboutUsContent = signal<IAboutUsRow | null>(null);


  ngOnInit(): void {
    this._MetaTagsHandleService.handleMeta();
    this._AboutUsService.getAboutUs().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.aboutUsContent.set(response.row);
      },
    });
  }
}
