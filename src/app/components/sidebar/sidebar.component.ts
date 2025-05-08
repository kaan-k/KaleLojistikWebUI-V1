import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { LanguageComponentService } from '../../services/component/language-component.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isBranchRole: boolean;
  isBlockRole: boolean
  isFloorRole: boolean
  role: any = {};
  constructor(private languageComponentService: LanguageComponentService,) { }

  ngOnInit(): void {
     
  }


  changeLanguage(language: string) {
    localStorage.setItem("lng", language)
    this.languageComponentService.setLanguage(language)
    window.location.reload()
  }
}
