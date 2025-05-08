import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShipmentService } from '../../services/common/shipment.service';
import { ShipmentWithStatus } from '../../models/shipment/shipmentWithStatus';
import { WarehouseService } from '../../services/common/warehouse.service'; 
import { GridOptions, ColDef, ColGroupDef, CellClickedEvent, SideBarDef, GridReadyEvent } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { NavbarShipmentComponent } from './navbar-shipment/navbar-shipment.component';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ApproveShipmentComponent } from './approve-shipment/approve-shipment.component';


@Component({
  selector: 'app-shipment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,AgGridModule,NavbarShipmentComponent,AddShipmentComponent,ApproveShipmentComponent],
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.css']
})
export class ShipmentComponent implements OnInit {
  shipmentForm!: FormGroup;
  
  shipments: ShipmentWithStatus[] = [];
  selectedShipment?: ShipmentWithStatus;
  statusInput: string = '';
  trackingNumberToDelete: string = '';
  shipmentIdForshipment: string = '';
  assignedshipment: any;
  hesaplamaAgirlik = 0;
  hesaplamaTip = '';
  hesaplananUcret: number | null = null;
  warehouseList: any[] = [];

  yeniGondericiEkle: boolean = false;
  gondericiForm!: FormGroup;
  shipmentDeleteId = false;
  gondericiler: any[] = []; 
  selectedSenderId: string = ''; 
  shipmentNumber:string;

  createdTrackingNumber: string = '';


  deliveredShipments: ShipmentWithStatus[] = [];
  constructor(private fb: FormBuilder, private shipmentService: ShipmentService,   private warehouseService: WarehouseService ,private dialog:MatDialog) {}
  protected gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  public columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'trackingNumber', headerName: "trackingNumber", unSortIcon: true,},
    { field: 'senderId', headerName: "senderId", unSortIcon: true, },
    { field: 'receiverName', headerName: "receiverName", unSortIcon: true, },
    { field: 'receiverPhone', headerName: "receiverPhone", unSortIcon: true, },
    { field: 'receiverEmail', headerName: "receiverEmail", unSortIcon: true, }, 
    { field: 'weight', headerName: "weight", unSortIcon: true, },
    { field: 'shipmentType', headerName: "shipmentType", unSortIcon: true, },
    { field: 'deliveryAddress', headerName: "deliveryAddress", unSortIcon: true, },
    { field: 'statusRecordIds', headerName: "statusRecordIds", unSortIcon: true, }, 
    { field: 'warehouseId', headerName: "warehouseId", unSortIcon: true, }, 
    {
      field: 'Delete', headerName: "Sil", filter: false, valueGetter: (params) => {
        return 'Delete';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-trash-can"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.onDeleteshipmentId(event.data.id),
    },
    {
      field: 'Durum Güncelle', headerName: "Durum Güncelle", filter: false, valueGetter: (params) => {
        return 'Durum Güncelle';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-pen"style="cursor:pointer;opacity:0.7; font-size:20px;" data-bs-toggle="modal" data-bs-target="#selectedShipmentModal"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.getShipmentByTrackingNumber(event.data.trackingNumber),
    },
    {
      field: 'Teslimat Onay', headerName: "Teslimat Onay", filter: false, valueGetter: (params) => {
        return 'Teslimat Onay';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-thumbs-up"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.confirmSelectedShipmentDelivery(event.data.trackingNumber),
    },
  ];
  public rowSelection = 'multiple';
  public defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    sortable: true,
    resizable: true,
    floatingFilter: true,
    minWidth: 130,
  };
  public rowBuffer = 0;
  public rowModelType: 'clientSide' | 'infinite' | 'viewport' | 'serverSide' =
    'infinite';
  public cacheBlockSize = 300;
  public cacheOverflowSize = 2;
  public maxConcurrentDatasourceRequests = 1;
  public infiniteInitialRowCount = 1000;
  public maxBlocksInCache = 10;
  public noRowsTemplate: any
  public rowData!: any[];
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: ['columns', 'filters'],
    defaultToolPanel: '',
  };

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.getAllShipments()
  }

  ngOnInit(): void { 
    this.getAllShipments(); 
    this.getAllGondericiler();
  }

  

  // addShipment(): void {
  //   if (this.shipmentForm.invalid) return;

  //   const newShipment = this.shipmentForm.value;
  //   this.shipmentService.addShipment(newShipment).subscribe({
  //     next: () => {
  //       alert("Kargo eklendi!");
  //       this.shipmentForm.reset();
  //       this.getAllShipments();
  //     },
  //     error: (err) => console.error('Kargo eklenemedi:', err)
  //   });
  // }
  
 
  

  getAllShipments(): void {
    this.shipmentService.getAll().subscribe({
      next: res => this.rowData = res.data,
      error: err => console.error("Kargolar alınamadı:", err)
    });
  }
  

  getShipmentByTrackingNumber(trackingNumber: string) {
    this.shipmentNumber=trackingNumber;
    return this.shipmentNumber;
  }

  confirmSelectedShipmentDelivery(value:string): void {
    debugger
    if (!value) return;
    this.shipments.find
    this.shipmentService
      .confirmDelivery(value)
      .subscribe({
        next: () => {
          alert('Kargo teslim edildi olarak işaretlendi!');
          this.getAllShipments();
        },
        error: (err) => console.error('Teslimat onaylanamadı:', err)
      });
  }

  updateShipmentStatus(): void {
    if (!this.selectedShipment || !this.statusInput.trim()) return;
  
    this.shipmentService.updateStatus(this.selectedShipment.id, this.statusInput).subscribe({
      next: () => {
        alert("Durum güncellendi!");
        this.statusInput = '';
        this.getShipmentByTrackingNumber(this.selectedShipment.trackingNumber);
      },
      error: (err) => console.error('Durum güncellenemedi:', err)
    });
  }
  deleteSelectedShipment(id:string): void {  
  
    this.shipmentService.deleteShipment(id).subscribe({
      next: () => {
        alert('Kargo silindi.');
        this.selectedShipment = undefined;
        this.getAllShipments();
      },
      error: (err) => console.error('Kargo silinemedi:', err)
    });
  }
  
  deleteByTrackingNumber(): void {
    if (!this.trackingNumberToDelete?.trim()) return;
  
    const confirmDelete = confirm(`Kargoyu silmek istediğine emin misin? Takip No: ${this.trackingNumberToDelete}`);
    if (!confirmDelete) return;
  
    this.shipmentService.deleteByTrackingNumber(this.trackingNumberToDelete).subscribe({
      next: () => {
        alert('Kargo silindi!');
        this.trackingNumberToDelete = '';
        this.getAllShipments(); 
      },
      error: (err) => console.error('Silme başarısız:', err)
    });
  }


// getAssignedshipmentByInput(): void {
//   if (!this.shipmentIdForshipment.trim()) return;

//   this.shipmentService.getAssignedshipment(this.shipmentIdForshipment).subscribe({
//     next: (res) => this.assignedshipment = res.data,
//     error: (err) => console.error('Çalışan bilgisi alınamadı:', err)
//   });
// }


updateShipment(): void {
  if (!this.selectedShipment) return;

  this.shipmentService.updateShipment(this.selectedShipment.id, this.selectedShipment).subscribe({
    next: () => {
      alert('Kargo başarıyla güncellendi!');
      this.getAllShipments();
    },
    error: (err) => console.error('Güncelleme başarısız:', err)
  });
}


kargoUcretiHesapla(): void {
  this.shipmentService.calculatePrice(this.hesaplamaAgirlik, this.hesaplamaTip).subscribe({
    next: res => this.hesaplananUcret = res.price,
    error: err => console.error("Ücret hesaplanamadı:", err)
  });
}

getAllGondericiler(): void {
  this.shipmentService.getAllSenders().subscribe({
    next: res => this.gondericiler = res.data,
    error: err => console.error('Göndericiler alınamadı:', err)
  });
}

getDeliveredShipments(): void {
  this.shipmentService.getDeliveredShipments().subscribe({
    next: (res) => this.deliveredShipments = res.data,
    error: (err) => console.error("Teslim edilmiş kargolar alınamadı:", err)
  });
}

onDeleteshipmentId(id: string) { 
  console.log(id);
  
  this.shipmentDeleteId = true;
  this.deleteshipment(id)
}
deleteshipment(id: string) {
  if (this.shipmentDeleteId) {
    this.openDialog().afterClosed().subscribe(async result => {
      if (!result) {
        return
      }
      this.shipmentService.deleteShipment(id).subscribe(res=>{
        this.getAllShipments();
      })
    })
  }
}
openDialog() {
  return this.dialog.open(shipmentDeleteTemplate, {
    width: '550px',
    panelClass: 'matdialog-delete',
  });
}

  
}
@Component({
  selector: 'shipment-delete-template',
  template: `
  <h5 mat-dialog-title>
    "Silmek istediğine emin misin"</h5>
   <div mat-dialog-content>
   </div>
   <div mat-dialog-actions class="mat-mdc-dialog-actions">
    <button class="button-4" mat-button [mat-dialog-close]=false><i class="fa-solid fa-circle-xmark"></i> iptal</button>
    <button class="button-24" mat-button [mat-dialog-close]=true cdkFocusInitial  ><i class="fa-solid fa-trash-can"></i> Sil</button>
   </div>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],

})
export class shipmentDeleteTemplate {  
  constructor(public dialogRef: MatDialogRef<shipmentDeleteTemplate>) {
  }
}