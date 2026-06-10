import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BlankNavbarComponent } from '../../../core/components/blank-navbar/blank-navbar.component';
import { CategoriesService } from '../../../core/services/content/categories.service';
import { AdvertisingAreaComponent } from '../../../shared/components/advertising-area/advertising-area.component';
import { RelatedContentComponent } from './related-content/related-content.component';

@Component({
  selector: 'app-categories',
  imports: [
    BlankNavbarComponent,
    AdvertisingAreaComponent,
    RelatedContentComponent,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  masterBlog = signal<any>(null);
  private _CategoriesService = inject(CategoriesService)
  ngOnInit(): void {
    this.onClickGetLastEditorNewsId();
  }

  onClickGetLastEditorNewsId(): void {
    this._CategoriesService.getEditorBlog().subscribe({
      next: (response) => {
        this.masterBlog.set(response);
      },
    });
  }
}
