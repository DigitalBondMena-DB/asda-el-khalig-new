import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { BlankNavbarComponent } from '../../../core/components/blank-navbar/blank-navbar.component';
import { FooterComponent } from '../../../core/components/footer/footer.component';
import { AppLayoutServiceService } from '../../../dashboard/services/app.layout.service.service';

import { ButtonModule } from 'primeng/button';

import { PasswordModule } from 'primeng/password';

import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../services/login.service';
import { IUserData } from '../../interfaces/ILoginResponse';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FooterComponent,
    BlankNavbarComponent,
    CommonModule,
    NgxSpinnerModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  userData: FormGroup;

  isErrorMessage: boolean = false;

  isLoading: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private _PLATFORM_ID: Object,
    private _LoginService: LoginService,
    private _Router: Router,
    private _ToastrService: ToastrService
  ) {
    this.userData = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
      ]),
      rememberMe: new FormControl(false),
    });
  }

  ngOnInit() {
    // if (isPlatformBrowser(this._PLATFORM_ID)) {
    //   let userToken = localStorage.getItem('user');
    //   if (userToken) {
    //     this._Router.navigate(['/dashboard']);
    //   }
    // }
    // Check if email is stored in localStorage
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const savedEmail = localStorage.getItem('savedEmail');
      if (savedEmail) {
        this.userData.controls['email'].setValue(savedEmail);
        this.userData.controls['rememberMe'].setValue(true);
      }
    }
  }

  onSignInFormSubmitClick() {
    this.isErrorMessage = false;
    this.isLoading = true;
    if (this.userData.valid) {
      const { email, password, rememberMe } = this.userData.value;

      if (isPlatformBrowser(this._PLATFORM_ID)) {
        // Handle "Remember Me" functionality
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }
      }
      let userData: IUserData = {
        email: `${email}@gmail.com`,
        password: password,
      };
      // Print form values
      this._LoginService.login(userData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.error) {
            this.isErrorMessage = true;
          }
          if (response.user) {
            this._ToastrService.success('تم تسجيل الدخول بنجاح');
            if (isPlatformBrowser(this._PLATFORM_ID)) {
              localStorage.setItem('user', JSON.stringify(response.user));
            }
            this._Router.navigate(['/dashboard']);
          }
        },
      });
    }
  }
}
