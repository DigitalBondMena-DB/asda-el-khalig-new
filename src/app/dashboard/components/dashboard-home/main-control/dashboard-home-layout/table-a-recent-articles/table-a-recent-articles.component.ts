import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { HijriDatePipe } from '../../../../../../core/pipes/date-hijri.pipe';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { LatestBlog } from '../../../../../../core/interfaces/IStatics';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-table-a-recent-articles',
  standalone: true,
  imports: [
    TableModule,
    CardModule,
    HijriDatePipe,
    ButtonModule,
    TooltipModule,
    RouterLink,
  ],
  templateUrl: './table-a-recent-articles.component.html',
  styleUrl: './table-a-recent-articles.component.scss',
})
export class TableARecentArticlesComponent {
  @Input() latestBlogs!: LatestBlog[];
}
