import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../../core/interfaces/ISpecificCategory';
import { ImagesSrcPipe } from '../../../../core/pipes/images-src.pipe';
import { RemoveInlineStylesPipe } from '../../../../core/pipes/remove-inline-styles.pipe';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { HomeContentService } from '../../../../core/services/content/home/home-content.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-articles',
  imports: [
    SlicePipe,
    RouterLink,
    NgxSkeletonLoaderModule,
    ImagesSrcPipe,
    SafeHtmlPipe,
    RemoveInlineStylesPipe,
  ],
  templateUrl: './home-articles.component.html',
  styleUrl: './home-articles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeArticlesComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _HomeContentService = inject(HomeContentService);
  specificCategory = signal<ISpecificCategory | null>(null);

  article: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles() {
    this._HomeContentService.getHomeArticles().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.specificCategory.set(response);
      },
    });
  }
}
