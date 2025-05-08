import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Amele } from '../../models/amele/amele';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AmeleService {
  private apiUrl = 'localhost:44363/api/Employee';

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ data: Amele[] }> {
    return this.http.get<{ data: Amele[] }>(`${this.apiUrl}/GetAll`);
  }

  getById(id: string): Observable<{ data: Amele }> {
    return this.http.get<{ data: Amele }>(`${this.apiUrl}/GetById?id=${id}`);
  }

  add(amele: Amele): Observable<any> {
    return this.http.post(`${this.apiUrl}/Add`, amele);
  }

  update(id: string, amele: Amele): Observable<any> {
    return this.http.post(`${this.apiUrl}/Update?id=${id}`, amele);
  }
  
  delete(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Delete?id=${id}`);
  }

  getWarehouseByEmployeeId(id: string): Observable<{ data: any }> {
    return this.http.get<{ data: any }>(`${this.apiUrl}/GetWarehouse?id=${id}`);
  }
  getWarehouse(id: string): Observable<{ data: any }> {
    return this.http.get<{ data: any }>(`localhost:44363/api/Employee/GetWarehouse?id=${id}`);
  }
  
}
