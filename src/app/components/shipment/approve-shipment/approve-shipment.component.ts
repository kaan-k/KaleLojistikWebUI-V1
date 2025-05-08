import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShipmentService } from '../../../services/common/shipment.service';
import { ShipmentWithStatus } from '../../../models/shipment/shipmentWithStatus';


@Component({
  selector: 'app-approve-shipment',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './approve-shipment.component.html',
  styleUrl: './approve-shipment.component.css'
})
export class ApproveShipmentComponent {
  constructor(private shipmentService:ShipmentService){}
  selectedShipment?: ShipmentWithStatus;
  statusInput: string = '';
  @Input() set shipmentValue(value:any){
    if(!value) return
    this.getShipmentByTrackingNumber(value)


  }
  getShipmentByTrackingNumber(trackingNumber: string): void {
    this.shipmentService.getByTrackingNumber(trackingNumber).subscribe({
      next: (res) => this.selectedShipment = res.data,
      error: (err) => console.error('Kargo alınamadı:', err)
    });
  }
  updateShipmentStatus( ): void {
    if (!this.selectedShipment  || !this.statusInput.trim()) return;
  
    this.shipmentService.updateStatus(this.selectedShipment .id, this.statusInput).subscribe({
      next: () => {
        alert("Durum güncellendi!");
        this.statusInput = ''; 
      },
      error: (err) => console.error('Durum güncellenemedi:', err)
    });
  }
}


