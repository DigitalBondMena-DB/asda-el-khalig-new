import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  CountryISO,
  NgxIntlTelInputModule,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { ContactUsService } from '../../../../core/services/content/contact-us.service';

@Component({
  selector: 'app-contact-us-form',
  standalone: true,
  imports: [NgxIntlTelInputModule, ReactiveFormsModule, CommonModule],
  templateUrl: './contact-us-form.component.html',
  styleUrl: './contact-us-form.component.scss',
})
export class ContactUsFormComponent {
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  startValidation: boolean = false;
  PhoneNumberFormat = PhoneNumberFormat;
  isLoading: boolean = false;
  constructor(
    private _Router: Router,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: object,
    private _ContactUsService: ContactUsService,
    private _ToastrService: ToastrService
  ) {}

  messagesForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/), // Allows only Arabic letters and spaces
      Validators.minLength(3),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/),
    ]),
    phone: new FormControl('', [Validators.required]),
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
  });

  onSubmit(): void {
    this.startValidation = true;
    let USER_DATA = {
      name: this.messagesForm.get('name')?.value,
      email: this.messagesForm.get('email')?.value,
      phone: this.messagesForm.get('phone')?.value.e164Number,
      message: this.messagesForm.get('message')?.value,
    };
    if (this.messagesForm.valid) {
      this.isLoading = true;

      this._ContactUsService.submitUserForm(USER_DATA).subscribe({
        next: (response) => {
          this.isLoading = false;
          this._ToastrService.success('تم ارسال الرسالة بنجاح');
          this.messagesForm.reset();
          this.startValidation = false;
        },
      });
    } else {
    }
  }
}
