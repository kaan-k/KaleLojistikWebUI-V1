import { CommonModule } from '@angular/common';
import { Component, HostListener, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterModule } from '@angular/router';  
import { UserDetailsDto } from '../../models/user/userDetailsDto';  
import { LanguageComponentService } from '../../services/component/language-component.service'; 





@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: []
})
export class NavbarComponent { 
   
  breadCrum:any
  isSidebarOpen: boolean = true;

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.routerState.snapshot.root;
        this.breadCrum = this.getBreadcrumb(currentRoute);
      }
    });
  }

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private languageComponentService: LanguageComponentService,
  ) { }

  

  Logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("expiration")
    localStorage.removeItem("userId");
    localStorage.removeItem("employeeId");
    this.router.navigate(["/user-login"]);
  }

  SidebarShow() {
    const sidebarElement = document.querySelector('.hk-nav');
    const wrapperElement = document.querySelector('.main-element');

    if (sidebarElement && wrapperElement) {
      if (this.isSidebarOpen) {
        this.renderer.setStyle(sidebarElement, 'width', '0%');
        this.renderer.setStyle(sidebarElement, 'padding', '0');
        this.renderer.setStyle(wrapperElement, 'width', '100%');
      } else {
        this.renderer.setStyle(sidebarElement, 'width', '15%');
        this.renderer.setStyle(sidebarElement, 'padding', '80px 20px');
        this.renderer.setStyle(wrapperElement, 'width', '85%');
      }
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }      
  changeLanguage(language: string) {
    localStorage.setItem("lng", language)
    this.languageComponentService.setLanguage(language)
    window.location.reload()
  }
  private getBreadcrumb(route: ActivatedRouteSnapshot): string {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.data["breadcrumb"];  
  }


}
