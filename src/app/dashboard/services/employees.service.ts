import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IEmployee,
  IEmployeeAddBody,
  IEmployeeAddResponse,
  IEmployeeUpdateBody,
} from '../../core/interfaces/IEmployess';
import { WEB_SITE_BASE_URL } from '../../core/constants/WEB_SITE_BASE_UTL';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  constructor(private _HttpClient: HttpClient) {}

  getAllEmployees(): Observable<IEmployee> {
    return this._HttpClient.get<IEmployee>(
      `${WEB_SITE_BASE_URL}administrator_index`
    );
  }

  addEmployee(EmployeeData: FormData): Observable<IEmployeeAddResponse> {
    return this._HttpClient.post<IEmployeeAddResponse>(
      `${WEB_SITE_BASE_URL}administrator_store`,
      EmployeeData
    );
  }

  updatEmployee(id: number, data: any): Observable<IEmployeeAddResponse> {
    return this._HttpClient.post<IEmployeeAddResponse>(
      `${WEB_SITE_BASE_URL}administrator_update/${id}`,
      data
    );
  }

  disableEmployee(id: number): Observable<IEmployeeAddResponse> {
    return this._HttpClient.post<IEmployeeAddResponse>(
      `${WEB_SITE_BASE_URL}administrator_destroy/${id}`,
      {}
    );
  }

  enableEmployee(id: number): Observable<IEmployeeAddResponse> {
    return this._HttpClient.post<IEmployeeAddResponse>(
      `${WEB_SITE_BASE_URL}administrator_enable/${id}`,
      {}
    );
  }
}
