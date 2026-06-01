import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-founding-banner',
    imports: [],
    templateUrl: './founding-banner.component.html',
    styleUrl: './founding-banner.component.scss'
})
export class FoundingBannerComponent {
  @Input({ required: true }) isNational: boolean = true;
}
