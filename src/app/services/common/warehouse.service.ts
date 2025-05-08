import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Warehouse } from '../../models/warehouse/warehouse';
import { ShipmentWithStatus } from '../../models/shipment/shipmentWithStatus';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl = 'localhost:44363/api/Warehouses';

  constructor(private http: HttpClient) {}

  addWarehouse(warehouse: Warehouse): Observable<any> {
    return this.http.post(`${this.apiUrl}/Add`, warehouse);
  }

  updateWarehouse(id: string, warehouse: Warehouse): Observable<any> {
    return this.http.post(`${this.apiUrl}/Update?id=${id}`, warehouse);
  }

  deleteWarehouse(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Delete?id=${id}`);
  }

  getById(id: string): Observable<{ data: Warehouse }> {
    return this.http.get<{ data: Warehouse }>(`${this.apiUrl}/GetById?id=${id}`);
  }

  getAll(): Observable<{ data: Warehouse[] }> {
    return this.http.get<{ data: Warehouse[] }>(`${this.apiUrl}/GetAll`);
  }

  getShipmentsByWarehouseId(id: string): Observable<{ data: ShipmentWithStatus[] }> {
    return this.http.get<{ data: ShipmentWithStatus[] }>(`${this.apiUrl}/GetAllByWarehouseId?id=${id}`);
  }
}
