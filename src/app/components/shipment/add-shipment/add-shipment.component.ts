import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipmentService } from '../../../services/common/shipment.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseService } from '../../../services/common/warehouse.service';

@Component({
  selector: 'app-add-shipment',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-shipment.component.html',
  styleUrl: './add-shipment.component.css'
})
export class AddShipmentComponent {
  @Output() shipEvent = new EventEmitter<any>()
    shipmentForm!: FormGroup;  
    yeniGondericiEkle: boolean = false;
    gondericiForm!: FormGroup;
    gondericiler: any[] = []; 
    selectedSenderId: string = ''; 
    warehouseList: any[] = [];
    createdTrackingNumber: string = '';
  
   
  constructor(private shipmentService:ShipmentService,private toastrService:ToastrService,private fb:FormBuilder,private warehouseService: WarehouseService){}
  ngOnInit(){
    this.getAllGondericiler();
    this.initForm()
    this.getWarehouses()
    this.initSenderForm()
  }

  initForm(): void {
    this.shipmentForm = this.fb.group({
      senderId: ['', Validators.required],
      receiverName: ['', Validators.required],
      receiverPhone: ['', Validators.required],
      receiverEmail: ['', Validators.required],
      weight: [0, Validators.required],
      shipmentType: ['', Validators.required],
      deliveryAddress: ['', Validators.required],
      warehouseId: ['', Validators.required]
    });
    this.gondericiForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    
  }
  initSenderForm(): void {
    this.gondericiForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  getAllGondericiler(): void {
    this.shipmentService.getAllSenders().subscribe({
      next: res => this.gondericiler = res.data,
      error: err => console.error('Göndericiler alınamadı:', err)
    });
  }
  addShipment(): void {

    //if (this.shipmentForm.invalid) return;
  
    const shipment = this.shipmentForm.value;
  
    if (!this.yeniGondericiEkle) {

      shipment.senderId = this.selectedSenderId;
    }
  
    const dto = {
      shipment: shipment,
      sender: this.yeniGondericiEkle ? {
        ...this.gondericiForm.value,
        id: ""
      } : null
    };
    console.log("DTO:", dto);

    this.shipmentService.addShipment(dto).subscribe({
      next: () => {
        alert("Kargo oluşturuldu!");
        this.shipmentForm.reset(); 
        this.shipEvent.emit()
      },
      error: err => console.error("Kargo oluşturulamadı:", err)
    });
  }

  getWarehouses() {
    this.warehouseService.getAll().subscribe({
      next: res => this.warehouseList = res.data,
      error: err => console.error("Depolar alınamadı:", err)
    });
  }
  

}
