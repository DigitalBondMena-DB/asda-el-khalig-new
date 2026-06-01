import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../../core/interfaces/ISpecificCategory';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { StringSlicePipe } from '../../../../core/pipes/string-slice.pipe';
import { HomeContentService } from '../../../../core/services/content/home/home-content.service';
import { AdvertisingAreaComponent } from '../../../../shared/components/advertising-area/advertising-area.component';

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
    styleUrl: './national-news.component.scss'
})
export class NationalNewsComponent {
  nationalNews!: ISpecificCategory;
  isDesktop = input();
  skeleton: number[] = [0, 1, 2, 3, 4, 5, 6];
  constructor(private _HomeContentService: HomeContentService) {}

  ngOnInit(): void {
    this.getNationalNews();
  }

  getNationalNews() {
    this._HomeContentService.getHomeNationalsNews().subscribe({
      next: (response) => {
        this.nationalNews = response;
        console.log(response);
      },
    });
  }
}
