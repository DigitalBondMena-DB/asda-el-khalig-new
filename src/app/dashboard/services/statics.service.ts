import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { IStatics } from '../../core/interfaces/IStatics';
import { WEB_SITE_BASE_URL } from '../../core/constants/WEB_SITE_BASE_UTL';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StaticsService {
  constructor(
    private _HttpClient: HttpClient,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: object
  ) {}

  getStatics(): Observable<IStatics> {
    return this._HttpClient.get<IStatics>(`${WEB_SITE_BASE_URL}statindex`);
  }
  // Store visit date and counters in localStorage
  setLastVisitData(data: any): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const visitData = {
        lastVisit: new Date().toISOString(),
        counters: data.counters,
        comments: data.comments,
        totalBlogs: data.totalblogs,
      };
      localStorage.setItem('lastVisitData', JSON.stringify(visitData));
    }
  }

  // Get the stored visit data from localStorage
  getLastVisitData(): any {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const data = localStorage.getItem('lastVisitData');
      return data ? JSON.parse(data) : new Date();
    }
  }
}
