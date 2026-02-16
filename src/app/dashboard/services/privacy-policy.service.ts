import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_SITE_BASE_URL } from '../../core/constants/WEB_SITE_BASE_UTL';
import {
  IPrivacyPolicy,
  IPrivacyPolicyUpdateBody,
  IPrivacyPolicyUpdateBodyResponse,
} from '../../core/interfaces/IPrivacyPolicy';

@Injectable({
  providedIn: 'root',
})
export class PrivacyPolicyService {
  constructor(private _HttpClient: HttpClient) {}

  getPrivacyPolicy(): Observable<IPrivacyPolicy> {
    return this._HttpClient.get<IPrivacyPolicy>(
      `${WEB_SITE_BASE_URL}getPrivacyData`
    );
  }

  updatePrivacyPolicy(
    data: IPrivacyPolicyUpdateBody
  ): Observable<IPrivacyPolicyUpdateBodyResponse> {
    return this._HttpClient.post<IPrivacyPolicyUpdateBodyResponse>(
      `${WEB_SITE_BASE_URL}updatePrivacyData`,
      data
    );
  }
}
