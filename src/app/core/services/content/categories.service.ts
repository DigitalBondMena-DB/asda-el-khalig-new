import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../constants/WEB_SITE_BASE_UTL';
import { IBlog } from '../../interfaces/IBlog';
import { ISpecificCategory } from '../../interfaces/ISpecificCategory';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(
    private _HttpClient: HttpClient,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: object
  ) { }

  getCurrentCategories(
    blogId: string,
    page?: number
  ): Observable<ISpecificCategory | null> {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      let slug = {
        category_slug: blogId,
      };
      let params = new HttpParams({ fromObject: slug });

      if (!page) {
        return <Observable<ISpecificCategory>>(
          this._HttpClient.get(`${WEB_SITE_BASE_URL}blogstest`, { params })
        );
      } else {
        return <Observable<ISpecificCategory>>this._HttpClient.get(
          `${WEB_SITE_BASE_URL}blogstest?page=${page}`,
          {
            params,
          }
        );
      }
    } else return of(null);
  }

  getBlogById(blogId: string): Observable<IBlog | null> {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      return <Observable<IBlog>>(
        this._HttpClient.get(`${WEB_SITE_BASE_URL}blog-detail/${blogId}`)
      );
    } else return of(null);
  }
  getEditorBlog(): Observable<any> {
    return this._HttpClient.get(`${WEB_SITE_BASE_URL}main-blogs`);
  }

  getNavBarCategories(): Observable<ISpecificCategory> {
    return <Observable<ISpecificCategory>>(
      this._HttpClient.get(`${WEB_SITE_BASE_URL}categories`)
    );
  }
}
