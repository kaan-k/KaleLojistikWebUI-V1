import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SenderService } from '../../services/common/sender.service';
import { Sender } from '../../models/sender/sender';

@Component({
  selector: 'app-sender',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.css']
})
export class SenderComponent implements OnInit {
  senderForm!: FormGroup;
  senders: Sender[] = [];
  selectedSender?: Sender;

  constructor(private fb: FormBuilder, private senderService: SenderService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSenders();
  }

  initForm(): void {
    this.senderForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      phoneNumber: [''],
      address: ['']
    });
  }

  loadSenders(): void {
    this.senderService.getAll().subscribe({
      next: res => this.senders = res.data,
      error: err => console.error("Sender alınamadı:", err)
    });
  }

  addSender(): void {
    if (this.senderForm.invalid) return;

    const newSender: Sender = {
      ...this.senderForm.value,
      id: ''
    };

    this.senderService.add(newSender).subscribe({
      next: () => {
        alert('Gönderen eklendi!');
        this.senderForm.reset();
        this.loadSenders();
      },
      error: err => console.error('Eklenemedi:', err)
    });
  }

  deleteSender(id: string): void {
    this.senderService.delete(id).subscribe({
      next: () => {
        alert('Gönderen silindi!');
        this.loadSenders();
      },
      error: err => console.error('Silinemedi:', err)
    });
  }

  selectSender(sender: Sender): void {
    this.selectedSender = { ...sender };
    this.senderForm.patchValue(sender);
  }

  updateSender(): void {
    if (!this.selectedSender) return;

    const updated: Sender = {
      ...this.senderForm.value,
      id: this.selectedSender.id
    };

    this.senderService.update(updated.id!, updated).subscribe({
      next: () => {
        alert('Gönderen güncellendi!');
        this.selectedSender = undefined;
        this.senderForm.reset();
        this.loadSenders();
      },
      error: err => console.error('Güncellenemedi:', err)
    });
  }

  cancelEdit(): void {
    this.senderForm.reset();
    this.selectedSender = undefined;
  }
}
