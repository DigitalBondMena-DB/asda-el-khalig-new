import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-c-total-articles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './c-total-articles.component.html',
  styleUrl: './c-total-articles.component.scss',
})
export class CTotalArticlesComponent {
  @Input() totalArticles: number = 0;
  @Input() message: string = '';
}
