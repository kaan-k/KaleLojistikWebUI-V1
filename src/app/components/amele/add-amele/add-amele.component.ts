import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AmeleService } from '../../../services/common/amele.service';
import { WarehouseService } from '../../../services/common/warehouse.service';
import { Amele } from '../../../models/amele/amele';
import { Warehouse } from '../../../models/warehouse/warehouse';

@Component({
  selector: 'app-add-amele',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-amele.component.html',
  styleUrl: './add-amele.component.css'
})
export class AddAmeleComponent {

  ameleForm!: FormGroup;
  warehouseName: string = '';
  warehouses:Warehouse[]
  ameleIdForWarehouse: string = '';
  constructor(private ameleService:AmeleService,private warehouseService:WarehouseService,private fb:FormBuilder){}
  ngOnInit(){
    this.initForm()
    this.getAllWarehouse()
  }

  initForm(): void {
      this.ameleForm = this.fb.group({
        name: ['', Validators.required],
        surname: ['', Validators.required],
        warehouseId: ['', Validators.required],
        role: ['', Validators.required]
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
        },
        error: err => console.error('Amele eklenemedi:', err)
      });
    }
    getAllWarehouse() { 
      this.warehouseService.getAll().subscribe({
        next: res => this.warehouses = res.data,
        error: err => console.error('Depo alınamadı:', err)
      });
    }
}
