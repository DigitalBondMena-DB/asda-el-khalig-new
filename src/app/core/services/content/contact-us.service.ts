import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IContactData,
  IContactUs,
  IGetAllContactUsMessages,
} from '../../interfaces/IContactUs';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  constructor(private _HttpClient: HttpClient) {}

  submitUserForm(userFormData: IContactData): Observable<IContactUs> {
    return this._HttpClient.post<IContactUs>(
      `${WEB_SITE_BASE_URL}submitContactForm`,
      userFormData
    );
  }

  getContactUs(): Observable<IGetAllContactUsMessages> {
    return this._HttpClient.get<IGetAllContactUsMessages>(
      `${WEB_SITE_BASE_URL}getContacts`
    );
  }
}
