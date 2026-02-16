import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../core/constants/WEB_SITE_BASE_UTL';
import { ICategoriesControl } from '../../core/interfaces/ICategoriesControl';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private _HttpClient: HttpClient) {}

  getAllCategories(): Observable<ICategoriesControl> {
    return this._HttpClient.get<ICategoriesControl>(
      `${WEB_SITE_BASE_URL}getCategory`
    );
  }
}
