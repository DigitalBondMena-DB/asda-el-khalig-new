import { Component } from '@angular/core';
import { AdvertisingAreaComponent } from './../../../../shared/components/advertising-area/advertising-area.component';

@Component({
  selector: 'app-home-second-advertising-banner',
  standalone: true,
  imports: [AdvertisingAreaComponent],
  templateUrl: './home-second-advertising-banner.component.html',
  styleUrl: './home-second-advertising-banner.component.scss',
})
export class HomeSecondAdvertisingBannerComponent {}
