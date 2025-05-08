import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WarehouseService } from '../../services/common/warehouse.service';
import { Warehouse } from '../../models/warehouse/warehouse';
import { ShipmentWithStatus } from '../../models/shipment/shipmentWithStatus';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  warehouseForm!: FormGroup;
  warehouses: Warehouse[] = [];
  selectedWarehouse?: Warehouse;
  warehouseIdForShipments: string = '';
  relatedShipments: ShipmentWithStatus[] = [];

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllWarehouses();
  }

  initForm(): void {
    this.warehouseForm = this.fb.group({
      name: ['', Validators.required],
      capacity: [0, Validators.required],
      address: ['', Validators.required]
    });
  }

  getAllWarehouses(): void {
    this.warehouseService.getAll().subscribe({
      next: res => this.warehouses = res.data,
      error: err => console.error("Depolar alınamadı:", err)
    });
  }

  addWarehouse(): void {
    if (this.warehouseForm.invalid) return;

    const newWarehouse: Warehouse = {
      ...this.warehouseForm.value,
      id: '',
      shipmentIds: []
    };

    this.warehouseService.addWarehouse(newWarehouse).subscribe({
      next: () => {
        alert("Depo eklendi!");
        this.warehouseForm.reset();
        this.getAllWarehouses();
      },
      error: err => console.error("Depo eklenemedi:", err)
    });
  }

  deleteWarehouse(id: string): void {
    this.warehouseService.deleteWarehouse(id).subscribe({
      next: () => {
        alert("Depo silindi!");
        this.getAllWarehouses();
      },
      error: err => console.error("Depo silinemedi:", err)
    });
  }

  selectWarehouse(warehouse: Warehouse): void {
    this.selectedWarehouse = { ...warehouse };
  }

  updateWarehouse(): void {
    if (!this.selectedWarehouse) return;

    this.warehouseService.updateWarehouse(this.selectedWarehouse.id, this.selectedWarehouse).subscribe({
      next: () => {
        alert("Depo güncellendi!");
        this.selectedWarehouse = undefined;
        this.getAllWarehouses();
      },
      error: err => console.error("Güncelleme hatası:", err)
    });
  }

  getShipmentsForWarehouse(): void {
    if (!this.warehouseIdForShipments.trim()) return;

    this.warehouseService.getShipmentsByWarehouseId(this.warehouseIdForShipments).subscribe({
      next: res => this.relatedShipments = res.data,
      error: err => console.error("Kargolar getirilemedi:", err)
    });
  }
}
