import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-advertising-area',
  imports: [CommonModule, RouterLink],
  templateUrl: './advertising-area.component.html',
  styleUrl: './advertising-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvertisingAreaComponent {
  positionClasses = input<string>('');
  imageWidth = input<string>('220px');
}
