import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IComments } from '../../core/interfaces/IComments';
import { WEB_SITE_BASE_URL } from '../../core/constants/WEB_SITE_BASE_UTL';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private _HttpClient: HttpClient) {}

  getAllComments(): Observable<IComments> {
    return this._HttpClient.get<IComments>(`${WEB_SITE_BASE_URL}getComments`);
  }
  addComment(commentData: any): Observable<IComments> {
    return this._HttpClient.post<IComments>(
      `${WEB_SITE_BASE_URL}addcommecnt`,
      commentData
    );
  }

  updateCommentsStatus(id: number): Observable<IComments> {
    return this._HttpClient.post<IComments>(
      `${WEB_SITE_BASE_URL}updateCommentStatus/${id}`,
      {}
    );
  }
}
