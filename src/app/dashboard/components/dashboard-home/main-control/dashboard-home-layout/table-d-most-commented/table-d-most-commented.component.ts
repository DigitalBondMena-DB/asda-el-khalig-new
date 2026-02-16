import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { HijriDatePipe } from '../../../../../../core/pipes/date-hijri.pipe';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-table-d-most-commented',
  standalone: true,
  imports: [
    TableModule,
    CardModule,
    HijriDatePipe,
    ButtonModule,
    TooltipModule,
    RouterLink,
  ],
  templateUrl: './table-d-most-commented.component.html',
  styleUrl: './table-d-most-commented.component.scss',
})
export class TableDMostCommentedComponent {
  // @Output() blogId: EventEmitter = new EventEmitter()
  @Input() mostCommentedBlogs: any[] = [];
  openPreview(id: number) {}
}
