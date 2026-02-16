import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ISocialMedia,
  IUpdateSocialLinks,
  IUpdateSocialLinksResponse,
} from '../../core/interfaces/ISocialMedia';
import { WEB_SITE_BASE_URL } from '../../core/constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root',
})
export class SocialMediaLinksService {
  constructor(private _HttpClient: HttpClient) {}

  getSocialMediaLinks(): Observable<ISocialMedia | null> {
    return this._HttpClient.get<ISocialMedia>(
      `${WEB_SITE_BASE_URL}getSocialMedia`
    );
  }

  updateSocialMediaLinks(
    socialMedia: IUpdateSocialLinks
  ): Observable<IUpdateSocialLinksResponse> {
    return this._HttpClient.post<IUpdateSocialLinksResponse>(
      `${WEB_SITE_BASE_URL}updateSocialMedia`,
      socialMedia
    );
  }
}
