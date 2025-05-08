import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShipmentWithStatus } from '../../models/shipment/shipmentWithStatus';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private apiUrl = 'localhost:44363/api/shipment';

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ data: ShipmentWithStatus[] }> {
    return this.http.get<{ data: ShipmentWithStatus[] }>(`${this.apiUrl}/GetAll`);
  }
  

  getById(id: string): Observable<{ data: ShipmentWithStatus }> {
    return this.http.get<{ data: ShipmentWithStatus }>(`${this.apiUrl}/GetById?id=${id}`);
  }

  getByTrackingNumber(trk: string): Observable<{ data: ShipmentWithStatus }> {
    return this.http.get<{ data: ShipmentWithStatus }>(`${this.apiUrl}/GetByTrackingId?id=${trk}`);
  }
  
  // addShipment(shipment: ShipmentWithStatus): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/Add`, shipment);
  // }
  addShipment(data: any): Observable<any> {
    return this.http.post('localhost:44363/api/Shipment/AddWithOptionalSender', data);
  }
  
  updateShipment(id: string, shipment: ShipmentWithStatus): Observable<any> {
    return this.http.post(`${this.apiUrl}/Update?id=${id}`, shipment);
  }  

  deleteShipment(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Delete?id=${id}`);
  }
  deleteByTrackingNumber(trackingNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/DeleteWithTrackingNumber?id=${trackingNumber}`);
  }
  
  confirmDelivery(trackingNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/ConfirmDelivery?trackingNumber=${trackingNumber}`, {});
  }

  updateStatus(id: string, newStatus: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/UpdateStatus?id=${id}&newStatus=${newStatus}`, {});
  }
  getAssignedEmployee(shipmentId: string): Observable<{ data: any }> {
    return this.http.get<{ data: any }>(`${this.apiUrl}/GetEmployeeByShipmentId?id=${shipmentId}`);
  }
  calculatePrice(weight: number, shipmentType: string): Observable<{ price: number }> {
    return this.http.get<{ price: number }>(
      `${this.apiUrl}/CalculatePrice?weight=${weight}&shipmentType=${shipmentType}`
    );
  }
  

  addWithOptionalSender(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddWithOptionalSender`, data);
  }
  
  getAllSenders(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`localhost:44363/api/Sender/GetAll`);
  }
  getDeliveredShipments(): Observable<{ data: ShipmentWithStatus[] }> {
    return this.http.get<{ data: ShipmentWithStatus[] }>('localhost:44363/api/Shipment/GetAllDeliveredShipments');
  }
  
}
