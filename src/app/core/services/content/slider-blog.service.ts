import { HttpClient } from '@angular/common/http';
import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';
import { ISliderHome } from '../../interfaces/slider/ISliderHome';

const SLIDER_KEY = makeStateKey<ISliderHome>('slider-home');

@Injectable({
  providedIn: 'root',
})
export class SliderBlogService {
  constructor(
    private _HttpClient: HttpClient,
    private transferState: TransferState
  ) { }

  getSliderData(): Observable<ISliderHome> {
    const cachedData = this.transferState.get(SLIDER_KEY, null as any);

    if (cachedData) {
      return of(cachedData);
    }

    return this._HttpClient
      .get<ISliderHome>(`${WEB_SITE_BASE_URL}slider-blogs`)
      .pipe(
        tap((data) => {
          this.transferState.set(SLIDER_KEY, data);
        })
      );
  }
}