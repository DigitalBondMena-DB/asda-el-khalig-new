import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';
import { ISpecificCategory } from '../../interfaces/ISpecificCategory';

@Injectable({
  providedIn: 'root',
})
export class StaticCategoriesService {
  constructor(private _HttpClient: HttpClient) {}

  getLocalNews(): Observable<ISpecificCategory> {
    return <Observable<ISpecificCategory>>(
      this._HttpClient.get(`${WEB_SITE_BASE_URL}blogs/01`)
    );
  }
  getArticles(): Observable<ISpecificCategory> {
    return <Observable<ISpecificCategory>>(
      this._HttpClient.get(`${WEB_SITE_BASE_URL}blogs/08`)
    );
  }
  getInvestigations(): Observable<ISpecificCategory> {
    return <Observable<ISpecificCategory>>(
      this._HttpClient.get(`${WEB_SITE_BASE_URL}blogs/i`)
    );
  }

  increaseView(): Observable<any> {
    return <Observable<any>>(
      this._HttpClient.post(`${WEB_SITE_BASE_URL}storeVisitCounter`, {})
    );
  }
  getViewsData(): Observable<any> {
    return <Observable<any>>(
      this._HttpClient.get(`${WEB_SITE_BASE_URL}gethomecounter`)
    );
  }
}
