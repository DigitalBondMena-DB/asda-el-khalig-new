import { Component, Input } from '@angular/core';
import { AppLayoutServiceService } from '../../services/app.layout.service.service';
import { AppMenuServiceService } from '../../services/app.menu.service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule,CommonModule,SidebarModule,        RadioButtonModule,
    ButtonModule,
    InputSwitchModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent {
  @Input() minimal: boolean = false;

  scales: number[] = [12, 13, 14, 15, 16];

  constructor(
      public layoutService: AppLayoutServiceService,
      public menuService: AppMenuServiceService
  ) {}

  get visible(): boolean {
      return this.layoutService.state.configSidebarVisible;
  }
  set visible(_val: boolean) {
      this.layoutService.state.configSidebarVisible = _val;
  }

  get scale(): number {
      return this.layoutService.config().scale;
  }
  set scale(_val: number) {
      this.layoutService.config.update((config) => ({
          ...config,
          scale: _val,
      }));
  }

  get menuMode(): string {
      return this.layoutService.config().menuMode;
  }
  set menuMode(_val: string) {
      this.layoutService.config.update((config) => ({
          ...config,
          menuMode: _val,
      }));
  }

  get inputStyle(): string {
      return this.layoutService.config().inputStyle;
  }
  set inputStyle(_val: string) {
      this.layoutService.config().inputStyle = _val;
  }

  get ripple(): boolean {
      return this.layoutService.config().ripple;
  }
  set ripple(_val: boolean) {
      this.layoutService.config.update((config) => ({
          ...config,
          ripple: _val,
      }));
  }

  set theme(val: string) {
      this.layoutService.config.update((config) => ({
          ...config,
          theme: val,
      }));
  }
  get theme(): string {
      return this.layoutService.config().theme;
  }

  set colorScheme(val: string) {
      this.layoutService.config.update((config) => ({
          ...config,
          colorScheme: val,
      }));
  }
  get colorScheme(): string {
      return this.layoutService.config().colorScheme;
  }

  onConfigButtonClick() {
      this.layoutService.showConfigSidebar();
  }

  changeTheme(theme: string, colorScheme: string) {
      this.theme = theme;
      this.colorScheme = colorScheme;
  }

  decrementScale() {
      this.scale--;
  }

  incrementScale() {
      this.scale++;
  }
}
