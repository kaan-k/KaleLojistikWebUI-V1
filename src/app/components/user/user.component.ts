import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BusinessUserService } from '../../services/common/user.service';

@Component({
  selector: 'app-business-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class BusinessUserLoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: BusinessUserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  login() {
    //if (this.loginForm.valid) {
      let model = Object.assign({}, this.loginForm.value);
      this.userService.login(model).subscribe((res) => {
        if (res && res.data && res.data.token) {
          console.log("Token geldi:", res.data.token);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userId', res.data.userId);
          localStorage.setItem("expiration", res.data.expiration)
          alert('Giriş başarılı!');
          this.router.navigate(['/shipments']);
        } else {
          console.error("Response geçersiz:", res);
        }
      }, (error) => {
        console.error('Login hatası:', error);
        alert('Giriş başarısız!');
    
      });

    //}

  }
  
}
