import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-b-total-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './b-total-comments.component.html',
  styleUrl: './b-total-comments.component.scss',
})
export class BTotalCommentsComponent {
  @Input() totalComments: number = 0;
  @Input() message: string = '';
}
