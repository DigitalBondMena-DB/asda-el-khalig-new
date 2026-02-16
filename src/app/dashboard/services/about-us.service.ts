import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAboutUs } from '../../core/interfaces/IAboutUs';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../core/constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root',
})
export class AboutUsService {
  constructor(private _HttpClient: HttpClient) {}

  getAboutUs(): Observable<IAboutUs> {
    return this._HttpClient.get<IAboutUs>(`${WEB_SITE_BASE_URL}getAboutData`);
  }

  updateAboutUs(data: any): Observable<IAboutUs> {
    return this._HttpClient.post<IAboutUs>(
      `${WEB_SITE_BASE_URL}updateAboutData`,
      data
    );
  }
}
