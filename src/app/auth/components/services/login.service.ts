import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ILogInError,
  ILoginResponse,
  IUserData,
} from '../../interfaces/ILoginResponse';
import { WEB_SITE_BASE_URL } from '../../../core/constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private _HttpClient: HttpClient) {}

  login(userData: IUserData): Observable<ILoginResponse | ILogInError> {
    return <Observable<ILoginResponse | ILogInError>>(
      this._HttpClient.post(`${WEB_SITE_BASE_URL}signin`, userData)
    );
  }
}
