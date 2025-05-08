import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component'; 


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,NavbarComponent,SidebarComponent,RouterOutlet,RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor(private router:Router) {}
  ngOnInit():void{
    const expirationDate = new Date(localStorage.getItem('expiration'));
    const currentDate = new Date();
    if (currentDate> expirationDate) {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
        localStorage.removeItem("employeeId");
        this.router.navigate(['/shipment-search']);
    }
    if (localStorage.getItem("lng") == null) {
      localStorage.setItem("lng","tr"); 
    }
    if(localStorage.getItem("paginationLimit") == null){
      localStorage.setItem("paginationLimit","6");
    }
  }
}
