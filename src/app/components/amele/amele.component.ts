import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmeleService } from '../../services/common/amele.service';
import { Amele } from '../../models/amele/amele';
import { CellClickedEvent, ColDef, ColGroupDef, GridOptions, GridReadyEvent, SideBarDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { NavbarAmeleComponent } from './navbar-amele/navbar-amele.component';
import { AddAmeleComponent } from './add-amele/add-amele.component';
import { UpdateAmeleComponent } from './update-amele/update-amele.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-amele',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,AgGridModule,NavbarAmeleComponent,AddAmeleComponent,UpdateAmeleComponent],
  templateUrl: './amele.component.html',
  styleUrls: ['./amele.component.css']
})
export class AmeleComponent implements OnInit {
  ameleForm!: FormGroup;
  ameleler: Amele[] = [];
  selectedAmele?: Amele;
  warehouseName: string = '';
  ameleIdForWarehouse: string = '';
  ameleDepoAdlari: { [key: string]: string } = {};
  ameleDeleteId:boolean=false

  constructor(private fb: FormBuilder, private ameleService: AmeleService,private dialog:MatDialog) {}
  protected gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 50,
  };

  public columnDefs: (ColDef | ColGroupDef)[] = [
    { field: 'name', headerName: "firstName", unSortIcon: true, },
    { field: 'surname', headerName: "lastName", unSortIcon: true, },
    { field: 'warehouseId', headerName: "warehouseId", unSortIcon: true },
    { field: 'role', headerName: "role", unSortIcon: true, },
    {
      field: 'Update', headerName: "update", filter: false, valueGetter: (params) => {
        return 'Update';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-pen"style="cursor:pointer;opacity:0.7; font-size:20px;" data-bs-toggle="modal" data-bs-target="#ameleUpdateModal"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) => {
        this.getByAmeleId(event.data.id)
      }
    },
    {
      field: 'Delete', headerName: "Sil", filter: false, valueGetter: (params) => {
        return 'Delete';
      },
      cellRenderer: () => {
        return `<i class="fa-solid fa-trash-can"style="cursor:pointer;opacity:0.7; font-size:20px;"></i>`;
      },
      onCellClicked: (event: CellClickedEvent) =>
        this.onDeleteameleId(event.data.id),
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
  ameleId:string
  public rowData!: any[];
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: ['columns', 'filters'],
    defaultToolPanel: '',
  };

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.getAllAmele()
  }

  ngOnInit(): void {
    this.initForm();
    this.getAllAmele();
  }
  getByAmeleId(value:any){
    this.ameleId=value;
  }

  initForm(): void {
    this.ameleForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      warehouseId: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  getAllAmele() {
    this.ameleService.getAll().subscribe({
      next: res => {
        this.rowData = res.data;
  
        for (let amele of this.rowData) {
          this.ameleService.getWarehouse(amele.id).subscribe({
            next: w => this.ameleDepoAdlari[amele.id] = w.data.name,
            error: err => console.error("Depo alınamadı:", err)
          });
          
          
        }
      },
      error: err => console.error("Amele alınamadı", err)
    });
  }

  addAmele(): void {
    if (this.ameleForm.invalid) return;

    const newAmele: Amele = {
      ...this.ameleForm.value,
      id: ''
    };

    this.ameleService.add(newAmele).subscribe({
      next: () => {
        alert('Amele eklendi!');
        this.ameleForm.reset();
        this.getAllAmele();
      },
      error: err => console.error('Amele eklenemedi:', err)
    });
  }

  deleteAmele(id: string): void {
    this.ameleService.delete(id).subscribe({
      next: () => {
        alert('Amele silindi!');
        this.getAllAmele();
      },
      error: err => console.error('Silinemedi:', err)
    });
  }

  selectAmele(amele: Amele): void {
    this.selectedAmele = { ...amele };
  }

  updateAmele(): void {
    if (!this.selectedAmele) return;
  
    this.ameleService.update(this.selectedAmele.id, this.selectedAmele).subscribe({
      next: () => {
        alert('Amele güncellendi!');
        this.selectedAmele = undefined;
        this.getAllAmele();
      },
      error: err => console.error('Güncellenemedi:', err)
    });
  }
  

  getWarehouseName(): void {
    if (!this.ameleIdForWarehouse.trim()) return;

    this.ameleService.getWarehouseByEmployeeId(this.ameleIdForWarehouse).subscribe({
      next: res => this.warehouseName = res.data.name,
      error: err => console.error('Depo alınamadı:', err)
    });
  }
  onDeleteameleId(id: string) { 
    console.log(id);
    
    this.ameleDeleteId = true;
    this.deleteamele(id)
  }
  deleteamele(id: string) {
    if (this.ameleDeleteId) {
      this.openDialog().afterClosed().subscribe(async result => {
        if (!result) {
          return
        }
        this.ameleService.delete(id).subscribe(res=>{
          this.getAllAmele();
        })
      })
    }
  }
  openDialog() {
    return this.dialog.open(ameleDeleteTemplate, {
      width: '550px',
      panelClass: 'matdialog-delete',
    });
  }
}
@Component({
  selector: 'amele-delete-template',
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
export class ameleDeleteTemplate {  
  constructor(public dialogRef: MatDialogRef<ameleDeleteTemplate>) {
  }
}
