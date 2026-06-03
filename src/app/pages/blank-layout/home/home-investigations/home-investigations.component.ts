import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../../core/interfaces/ISpecificCategory';
import { HomeContentService } from '../../../../core/services/content/home/home-content.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-home-investigations',
  imports: [RouterLink, NgxSkeletonLoaderModule, SlicePipe],
  templateUrl: './home-investigations.component.html',
  styleUrl: './home-investigations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeInvestigationsComponent {
  investigations = signal<ISpecificCategory | null>(null);
  isDesktop = input();
  skeleton: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  constructor(private _HomeContentService: HomeContentService) { }

  ngOnInit(): void {
    this.getLocalNews();
  }

  getLocalNews() {
    this._HomeContentService.getHomeInvestigations().subscribe({
      next: (response) => {
        this.investigations.set(response);
      },
    });
  }
}
