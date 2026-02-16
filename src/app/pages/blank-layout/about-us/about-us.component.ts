import { Component } from '@angular/core';
import { BlankNavbarComponent } from '../../../core/components/blank-navbar/blank-navbar.component';
import { IAboutUsRow } from '../../../core/interfaces/IAboutUs';
import { SafeHtmlPipe } from '../../../core/pipes/safe-html.pipe';
import { MetaTagsHandleService } from '../../../core/services/content/meta-tags-handle.service';
import { AboutUsService } from '../../../dashboard/services/about-us.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [BlankNavbarComponent, SafeHtmlPipe],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  aboutUsContent!: IAboutUsRow;
  constructor(
    private _AboutUsService: AboutUsService,
    private _MetaTagsHandleService: MetaTagsHandleService
  ) {}

  ngOnInit(): void {
    this._MetaTagsHandleService.handleMeta();
    this._AboutUsService.getAboutUs().subscribe({
      next: (response) => {
        this.aboutUsContent = response.row;
      },
    });
  }
}
