import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';
import {
  IGetAllNews,
  IGetOneBlogResponse,
  INewsAddResponse,
} from '../../interfaces/INewsControl';
import { IAllBreakingNews } from '../../interfaces/slider/IBreakingNews';

@Injectable({
  providedIn: 'root',
})
export class NewsControlService {
  _PLATFORM_ID = inject(PLATFORM_ID);

  constructor(private _HttpClient: HttpClient) { }

  getAllNews(): Observable<IGetAllNews> {
    return <Observable<IGetAllNews>>(
      this._HttpClient.get(`${WEB_SITE_BASE_URL}blog_index`)
    );
  }
  getNewsBySearch(title: string): Observable<IGetAllNews> {
    return <Observable<IGetAllNews>>(
      this._HttpClient.get(`${WEB_SITE_BASE_URL}blog_index`, {
        params: {
          search: title
        }
      })
    );
  }

  addNews(data: FormData): Observable<INewsAddResponse> {
    return <Observable<INewsAddResponse>>(
      this._HttpClient.post(`${WEB_SITE_BASE_URL}blog_store`, data)
    );
  }

  updateNews(id: number, data: FormData): Observable<INewsAddResponse> {
    return <Observable<INewsAddResponse>>(
      this._HttpClient.post(`${WEB_SITE_BASE_URL}blog_update/${id}`, data)
    );
  }

  newsEnable(id: number): Observable<INewsAddResponse> {
    return <Observable<INewsAddResponse>>(
      this._HttpClient.post(`${WEB_SITE_BASE_URL}blog_enable/${id}`, {})
    );
  }

  newsDisable(id: number): Observable<INewsAddResponse> {
    return <Observable<INewsAddResponse>>(
      this._HttpClient.post(`${WEB_SITE_BASE_URL}blog_destroy/${id}`, {})
    );
  }
  breakingNewsEnable(id: number): Observable<INewsAddResponse> {
    return <Observable<INewsAddResponse>>this._HttpClient.post(
      `${WEB_SITE_BASE_URL}activeBreakingNews`,
      {
        blog_ids: id,
      }
    );
  }

  breakingNewsDisable(id: number): Observable<INewsAddResponse> {
    return <Observable<INewsAddResponse>>this._HttpClient.post(
      `${WEB_SITE_BASE_URL}notActiveBreakingNews`,
      {
        blog_ids: id,
      }
    );
  }
  getBreakingNews(): Observable<IAllBreakingNews> {

    return <Observable<IAllBreakingNews>>(
      this._HttpClient.get(`${WEB_SITE_BASE_URL}CheckActivity`)
    );

  }

  getNewsById(id: number): Observable<IGetOneBlogResponse> {
    return <Observable<IGetOneBlogResponse>>(
      this._HttpClient.get(`${WEB_SITE_BASE_URL}blog_update_data/${id}`)
    );
  }
}
