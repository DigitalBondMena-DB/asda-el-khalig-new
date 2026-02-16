import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IAddWriterBody,
  IAddWriterResponse,
  IWriters,
} from '../../core/interfaces/IWriters';
import { WEB_SITE_BASE_URL } from '../../core/constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root',
})
export class WritersService {
  constructor(private _HttpClient: HttpClient) {}

  getAllWriters(): Observable<IWriters> {
    return this._HttpClient.get<IWriters>(`${WEB_SITE_BASE_URL}Writer_index`);
  }

  addWriter(writer: IAddWriterBody): Observable<IAddWriterResponse> {
    return this._HttpClient.post<IAddWriterResponse>(
      `${WEB_SITE_BASE_URL}Writer_store`,
      writer
    );
  }

  updateWriter(
    id: number,
    data: IAddWriterBody
  ): Observable<IAddWriterResponse> {
    return this._HttpClient.post<IAddWriterResponse>(
      `${WEB_SITE_BASE_URL}Writer_update/${id}`,
      data
    );
  }

  disableWriter(id: number): Observable<IAddWriterResponse> {
    return this._HttpClient.post<IAddWriterResponse>(
      `${WEB_SITE_BASE_URL}Writer_destroy/${id}`,
      {}
    );
  }

  enableWriter(id: number): Observable<IAddWriterResponse> {
    return this._HttpClient.post<IAddWriterResponse>(
      `${WEB_SITE_BASE_URL}Writer_enable/${id}`,
      {}
    );
  }
}
