import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-a-total-views',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './a-total-views.component.html',
  styleUrl: './a-total-views.component.scss',
})
export class ATotalViewsComponent {
  @Input() totalViews: number = 0;
  @Input() message: string = '';
}
