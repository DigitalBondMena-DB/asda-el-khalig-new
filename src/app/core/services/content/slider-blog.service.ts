import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';
import { Observable, of } from 'rxjs';
import { ISliderHome } from '../../interfaces/slider/ISliderHome';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SliderBlogService {
  constructor(
    private _HttpClient: HttpClient,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: object
  ) {}

  getSliderData(): Observable<ISliderHome> {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      return <Observable<ISliderHome>>(
        this._HttpClient.get(`${WEB_SITE_BASE_URL}slider-blogs`)
      );
    } else return new Observable<ISliderHome>();
  }
}
