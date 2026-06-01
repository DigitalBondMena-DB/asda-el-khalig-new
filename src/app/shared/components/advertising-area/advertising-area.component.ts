import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlueLineComponent } from '../blue-line/blue-line.component';

@Component({
    selector: 'app-advertising-area',
    imports: [CommonModule, RouterLink, BlueLineComponent],
    templateUrl: './advertising-area.component.html',
    styleUrl: './advertising-area.component.scss'
})
export class AdvertisingAreaComponent {
  @Input() positionClasses: string = '';
  @Input() imageWidth: string = '220px';
}
