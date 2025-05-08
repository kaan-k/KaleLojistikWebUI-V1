import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipmentService } from '../../services/common/shipment.service';
import { Shipment } from '../../models/shipment/shipment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shipment-search',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterLink],
  templateUrl: './shipment-search.component.html',
  styleUrl: './shipment-search.component.css'
})
export class ShipmentSearchComponent {
  shipmentNumber:string
  shipment:Shipment
  constructor(private shipmentService:ShipmentService){}

  getShipment(){
    this.shipmentService.getByTrackingNumber(this.shipmentNumber).subscribe(res=>{
      this.shipment=res.data
    })
  }

}
