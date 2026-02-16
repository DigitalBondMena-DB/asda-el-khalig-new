import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ISpecificCategory } from '../../../interfaces/ISpecificCategory';
import { WEB_SITE_BASE_URL } from '../../../constants/WEB_SITE_BASE_UTL';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SearchBlogsService {
  constructor(
    private _HttpClient: HttpClient,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: object
  ) {}

  getSearchResults(
    searchResults: string,
    page?: number
  ): Observable<ISpecificCategory | null> {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      let fd = new FormData();
      fd.append('searchtext', searchResults);
      if (!page) {
        return <Observable<ISpecificCategory>>(
          this._HttpClient.post(`${WEB_SITE_BASE_URL}search-blogs`, fd)
        );
      } else {
        return <Observable<ISpecificCategory>>(
          this._HttpClient.post(
            `${WEB_SITE_BASE_URL}search-blogs?page=${page}`,
            fd
          )
        );
      }
    } else return of(null);
  }
}
