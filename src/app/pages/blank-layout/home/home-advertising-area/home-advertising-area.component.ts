import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isFoundingDay } from '../../../../core/constants/WEB_SITE_BASE_UTL';

@Component({
    selector: 'app-home-advertising-area',
    imports: [RouterLink],
    templateUrl: './home-advertising-area.component.html',
    styleUrl: './home-advertising-area.component.scss'
})
export class HomeAdvertisingAreaComponent {
  isFoundingDay = isFoundingDay;
}
