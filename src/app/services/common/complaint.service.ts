import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Complaint } from '../../models/complaint/complaint';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'localhost:44363/api/Complaints';


  constructor(private http: HttpClient) {}

  getAll(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl);
  }

  getById(id: string): Observable<{ data: Complaint }> {
    return this.http.get<{ data: Complaint }>(`${this.apiUrl}/GetById?id=${id}`);
  }
  

  addComplaint(complaint: Complaint): Observable<any> {
    return this.http.post(this.apiUrl + '/Add', complaint);
  }
  
  updateComplaint(id: string, complaint: Complaint): Observable<any> {
    return this.http.post(`${this.apiUrl}/Update?id=${id}`, complaint);
  }
  getStatusById(id: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/GetStatusById?id=${id}`, { responseType: 'text' });
  }
  

  deleteComplaint(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Delete?id=${id}`);
  }

  respondToComplaint(id: string, complaint: Complaint): Observable<any> {
    return this.http.post(`${this.apiUrl}/Respond?id=${id}`, complaint);
  }

  
}
