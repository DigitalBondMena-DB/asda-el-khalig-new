import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ISocialMedia } from '../../interfaces/ISocialMedia';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {

  constructor(private _HttpClient:HttpClient,@Inject(PLATFORM_ID) private _PLATFORM_ID: object) { }


  getSocialMediaLinks():Observable<ISocialMedia | null> {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      return this._HttpClient.get<ISocialMedia>(`${WEB_SITE_BASE_URL}getSocialMedia`);
    }
    else return of(null);
  }

}
