import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ISpecificCategory } from '../../../../core/interfaces/ISpecificCategory';
import { HomeContentService } from '../../../../core/services/content/home/home-content.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-home-investigations',
  standalone: true,
  imports: [RouterLink, NgxSkeletonLoaderModule, SlicePipe],
  templateUrl: './home-investigations.component.html',
  styleUrl: './home-investigations.component.scss',
})
export class HomeInvestigationsComponent {
  investigations!: ISpecificCategory;
  isDesktop = input();
  skeleton: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  constructor(private _HomeContentService: HomeContentService) {}

  ngOnInit(): void {
    this.getLocalNews();
  }

  getLocalNews() {
    this._HomeContentService.getHomeInvestigations().subscribe({
      next: (response) => {
        this.investigations = response;
        console.log(response);
      },
    });
  }
}
