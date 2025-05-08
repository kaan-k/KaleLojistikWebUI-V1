
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sender } from '../../models/sender/sender';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SenderService {
  private apiUrl = 'localhost:44363/api/Sender';

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ data: Sender[] }> {
    return this.http.get<{ data: Sender[] }>(`${this.apiUrl}/GetAll`);
  }

  getById(id: string): Observable<{ data: Sender }> {
    return this.http.get<{ data: Sender }>(`${this.apiUrl}/GetById?id=${id}`);
  }

  add(sender: Sender): Observable<any> {
    return this.http.post(`${this.apiUrl}/Add`, sender);
  }

  update(id: string, sender: Sender): Observable<any> {
    return this.http.post(`${this.apiUrl}/Update?id=${id}`, sender);
  }

  delete(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Delete?id=${id}`);
  }
}
