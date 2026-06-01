import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../core/components/footer/footer.component';

@Component({
    selector: 'app-blank-layout',
    imports: [FooterComponent, RouterOutlet],
    templateUrl: './blank-layout.component.html',
    styleUrl: './blank-layout.component.scss'
})
export class BlankLayoutComponent { }
