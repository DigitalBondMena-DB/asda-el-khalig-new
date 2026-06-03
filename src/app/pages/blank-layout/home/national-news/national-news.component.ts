import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../../core/interfaces/ISpecificCategory';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { StringSlicePipe } from '../../../../core/pipes/string-slice.pipe';
import { HomeContentService } from '../../../../core/services/content/home/home-content.service';
import { AdvertisingAreaComponent } from '../../../../shared/components/advertising-area/advertising-area.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-national-news',
  imports: [
    AdvertisingAreaComponent,
    StringSlicePipe,
    RouterLink,
    NgxSkeletonLoaderModule,
    SafeHtmlPipe,
  ],
  templateUrl: './national-news.component.html',
  styleUrl: './national-news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NationalNewsComponent implements OnInit {
  private _HomeContentService = inject(HomeContentService);
  private destroyRef = inject(DestroyRef);
  nationalNews = signal<ISpecificCategory | null>(null);
  isDesktop = input();
  skeleton: number[] = [0, 1, 2, 3, 4, 5, 6];

  ngOnInit(): void {
    this.getNationalNews();
  }

  getNationalNews() {
    this._HomeContentService.getHomeNationalsNews().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.nationalNews.set(response);
      },
    });
  }
}
