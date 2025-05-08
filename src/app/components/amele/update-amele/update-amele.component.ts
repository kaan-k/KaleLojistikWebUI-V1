import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmeleService } from '../../../services/common/amele.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Amele } from '../../../models/amele/amele';
import { WarehouseService } from '../../../services/common/warehouse.service';
import { Warehouse } from '../../../models/warehouse/warehouse';

@Component({
  selector: 'app-update-amele',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule ],
  templateUrl: './update-amele.component.html',
  styleUrl: './update-amele.component.css',
})
export class UpdateAmeleComponent {
  ameles: Amele;
  ameleForm: FormGroup;
  id:string
  wareHouses:Warehouse[]
  @Input() set ameleValue(value: any) { 
    if (!value) return;
    this.id=value 
    this.getAllWareHouse();
    this.GetAmele(value);
    this.initForm();
  }
  initForm() {
    this.ameleForm = this.fb.group({ 
      id: [""],
      name: ["", Validators.required],
      surname: ["", Validators.required],
      warehouseId: ["", Validators.required],
      role: ["", Validators.required],
    });
  }
  constructor(private ameleService: AmeleService, private fb: FormBuilder,private warehouseService:WarehouseService) {}

   async GetAmele(value: any) {
    await this.ameleService.getById(value).subscribe((res) => {
      this.ameles = res.data; 
      
    });
  }
  updateAmele(): void {
    if (this.ameleForm.invalid) return;
    this.ameleService.update(this.id,this.ameleForm.value).subscribe({
      next: () => {
        alert('Amele eklendi!');
        this.ameleForm.reset(); 
      },
      error: err => console.error('Amele eklenemedi:', err)
    });
  }
  getAllWareHouse(){
    this.warehouseService.getAll().subscribe(res=>{
      this.wareHouses=res.data
    })
  }
}
