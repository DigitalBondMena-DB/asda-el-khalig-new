import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-founding-about',
    imports: [],
    templateUrl: './founding-about.component.html',
    styleUrl: './founding-about.component.scss'
})
export class FoundingAboutComponent {
  @Input({ required: true }) isNational: boolean = true;
}
