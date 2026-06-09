import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isFoundingDay } from './core/constants/WEB_SITE_BASE_UTL';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isFoundingDay = isFoundingDay;
}

