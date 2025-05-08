import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ComplaintService } from '../../../services/common/complaint.service';
import { Complaint } from '../../../models/complaint/complaint';


@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})

export class ComplaintComponent implements OnInit {
  complaintForm!: FormGroup;
  complaints: Complaint[] = [];
  selectedComplaint : Complaint;

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllComplaints();
  }

  
  initForm() {
    this.complaintForm = this.fb.group({
      type: ['', Validators.required],
      shipmentId: ['', Validators.required],
      complaintMessageContent: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.complaintForm.valid) {
      const data = this.complaintForm.value;
      this.complaintService.addComplaint(data).subscribe({
        next: () => {
          this.getAllComplaints();
          this.complaintForm.reset();
        },
        error: (err) => console.error('Şikayet eklenemedi:', err)
      });
    }
  }
  

  getAllComplaints() {
    this.complaintService.getAll().subscribe({
      next: (data) => {
        console.log('Şikayet listesi:', data); 
        this.complaints = data;
      },
      error: (err) => console.error('Şikayetler alınamadı:', err)
    });
  }
  
  getComplaintById(id: string): void {
    this.complaintService.getById(id).subscribe({
      next: (response) => {
        console.log('Gelen veri:', response);
        this.selectedComplaint = response.data; 
      },
      error: (err) => {
        console.error('Hata:', err);
      }
    });
  }
  responseText: string = '';

sendResponse(): void {
  if (!this.selectedComplaint) return;

  const updatedComplaint: Complaint = {
    ...this.selectedComplaint,
    response: this.responseText
  };

  this.complaintService.respondToComplaint(this.selectedComplaint.id, updatedComplaint)
    .subscribe({
      next: () => {
        alert('Yanıt başarıyla gönderildi!');
        this.selectedComplaint.response = this.responseText;
        this.responseText = '';
        this.getAllComplaints(); // liste güncellensin
      },
      error: (err) => console.error('Yanıt gönderilemedi:', err)
    });
}
  deleteComplaint(id: string): void {
  if (!confirm('Bu şikayeti silmek istediğine emin misin?')) return;

  this.complaintService.deleteComplaint(id).subscribe({
    next: () => {
      alert('Şikayet silindi.');
      this.getAllComplaints(); 
    },
    error: (err) => console.error('Silme hatası:', err)
  });
}
updateSelectedComplaint(): void {
  if (!this.selectedComplaint) return;

  this.complaintService
    .updateComplaint(this.selectedComplaint.id, this.selectedComplaint)
    .subscribe({
      next: () => {
        alert('Şikayet güncellendi!');
        this.getAllComplaints(); 
      },
      error: (err) => console.error('Güncelleme hatası:', err)
    });
}
getStatusOnly(id: string): void {
  this.complaintService.getStatusById(id).subscribe({
    next: (status) => {
      alert(`Şikayetin durumu: ${status}`);
    },
    error: (err) => console.error('Durum alınamadı:', err)
  });
}

  
}

