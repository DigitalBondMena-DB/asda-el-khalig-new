import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { filter, Subscription } from 'rxjs';
import { AppLayoutServiceService } from '../../services/app.layout.service.service';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { ChatComponent } from '../chat/chat.component';
import { ConfigComponent } from '../config/config.component';
import { DashboardSidebarComponent } from '../dashboard-sidebar/dashboard-sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    DashboardSidebarComponent,
    ConfigComponent,
    TopBarComponent,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    CommonModule,
    RouterOutlet,
    ChatComponent,
    AlertMessageComponent,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent {
  overlayMenuOpenSubscription!: Subscription;

  menuOutsideClickListener: any;

  profileMenuOutsideClickListener: any;

  @ViewChild(DashboardSidebarComponent) appSidebar!: DashboardSidebarComponent;

  @ViewChild(TopBarComponent) appTopbar!: TopBarComponent;

  constructor(
    public layoutService: AppLayoutServiceService,
    public renderer: Renderer2,
    public router: Router,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: Object
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.overlayMenuOpenSubscription =
        this.layoutService.overlayOpen$.subscribe(() => {
          if (!this.menuOutsideClickListener) {
            this.menuOutsideClickListener = this.renderer.listen(
              'document',
              'click',
              (event) => {
                const isOutsideClicked = !(
                  this.appSidebar.el.nativeElement.isSameNode(event.target) ||
                  this.appSidebar.el.nativeElement.contains(event.target) ||
                  this.appTopbar.menuButton.nativeElement.isSameNode(
                    event.target
                  ) ||
                  this.appTopbar.menuButton.nativeElement.contains(event.target)
                );

                if (isOutsideClicked) {
                  this.hideMenu();
                }
              }
            );
          }

          if (!this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener = this.renderer.listen(
              'document',
              'click',
              (event) => {
                const isOutsideClicked = !(
                  this.appTopbar.menu.nativeElement.isSameNode(event.target) ||
                  this.appTopbar.menu.nativeElement.contains(event.target) ||
                  this.appTopbar.topbarMenuButton.nativeElement.isSameNode(
                    event.target
                  ) ||
                  this.appTopbar.topbarMenuButton.nativeElement.contains(
                    event.target
                  )
                );

                if (isOutsideClicked) {
                  this.hideProfileMenu();
                }
              }
            );
          }

          if (this.layoutService.state.staticMenuMobileActive) {
            this.blockBodyScroll();
          }
        });

      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.hideMenu();
          this.hideProfileMenu();
        });
    }
  }
  hideMenu() {
    this.layoutService.state.overlayMenuActive = false;
    this.layoutService.state.staticMenuMobileActive = false;
    this.layoutService.state.menuHoverActive = false;
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }

  hideProfileMenu() {
    this.layoutService.state.profileSidebarVisible = false;
    if (this.profileMenuOutsideClickListener) {
      this.profileMenuOutsideClickListener();
      this.profileMenuOutsideClickListener = null;
    }
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) return;
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(
        new RegExp(
          '(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)',
          'gi'
        ),
        ' '
      );
    }
  }

  get containerClass() {
    return {
      'layout-theme-light': this.layoutService.config().colorScheme === 'light',
      'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
      'layout-overlay': this.layoutService.config().menuMode === 'overlay',
      'layout-static': this.layoutService.config().menuMode === 'static',
      'layout-static-inactive':
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config().menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
      'p-input-filled': this.layoutService.config().inputStyle === 'filled',
      'p-ripple-disabled': !this.layoutService.config().ripple,
    };
  }

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      // localStorage.removeItem('user');
    }
  }
}
