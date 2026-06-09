import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class HomeContentService {
  constructor(
    private _HttpClient: HttpClient,
    @Inject(PLATFORM_ID) private PLATFORM_ID: object
  ) { }
  getHomeLocalNews(): Observable<any> {
    let category_slug = {
      category_slug: '01',
    };
    let params = new HttpParams({ fromObject: category_slug });
    return this._HttpClient.get(`${WEB_SITE_BASE_URL}blogstest`, { params }).pipe(catchError(() => of(null)));
  }
  getHomeArticles(): Observable<any> {
    let category_slug = {
      category_slug: '08',
    };
    let params = new HttpParams({ fromObject: category_slug });
    return this._HttpClient.get(`${WEB_SITE_BASE_URL}blogstest`, { params }).pipe(catchError(() => of(null)));
  }
  getHomeInvestigations(): Observable<any> {
    let category_slug = {
      category_slug: 'i',
    };
    let params = new HttpParams({ fromObject: category_slug });
    return this._HttpClient.get(`${WEB_SITE_BASE_URL}blogstest`, { params }).pipe(catchError(() => of(null)));
  }
  getHomeYouTube(): Observable<any> {
    return this._HttpClient.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=6&playlistId=UUbMlkk6BDMhbFQKJQpjmj8g&key=AIzaSyAHFJPu7SzSC7XzbBHoNbcQrphjWJLYyIQ`
    ).pipe(catchError(() => of(null)));
  }
  getHomeNationalsNews(): Observable<any> {
    let category_slug = {
      category_slug: '6',
    };
    let params = new HttpParams({ fromObject: category_slug });
    return this._HttpClient.get(`${WEB_SITE_BASE_URL}blogstest`, { params }).pipe(catchError(() => of(null)));
  }
  getHomeRandomNews(): Observable<any> {
    return this._HttpClient.get(`${WEB_SITE_BASE_URL}getRandomBlogs`).pipe(catchError(() => of(null)));
  }

  checkPlatForm(): boolean {
    if (isPlatformBrowser(this.PLATFORM_ID)) {
      return true;
    }
    return false;
  }
}
