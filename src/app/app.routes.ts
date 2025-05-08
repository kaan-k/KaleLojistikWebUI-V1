import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';  


import { ShipmentComponent } from './components/shipment/shipment.component';
import { ComplaintComponent } from './components/complaint/complaint/complaint.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { AmeleComponent } from './components/amele/amele.component';
import { SenderComponent } from './components/sender/sender.component';
import { BusinessUserLoginComponent } from './components/user/user.component';
import { ShipmentSearchComponent } from './components/shipment-search/shipment-search.component';

 
 

const authRoutes = [
    { path: "user-login", component: BusinessUserLoginComponent },
    { path: "shipment-search", component: ShipmentSearchComponent },
];
const dutyStationRoutes = [
    { path: 'shipments', component: ShipmentComponent,   data: { breadcrumb: 'Kargolar' } },
    { 
        path: 'complaints', 
        component: ComplaintComponent,  
        data: { breadcrumb: 'Şikayetler' } 
      },
      { 
        path: 'warehouses', 
        component: WarehouseComponent,  
        data: { breadcrumb: 'Depolar' } 
      },
      {
        path: 'ameles',
        component: AmeleComponent, 
        data: { breadcrumb: 'Ameleler' }
      },
      {
        path: 'senders',
        component: SenderComponent, 
        data: { breadcrumb: 'Gönderenler' }
      }, 
      
      
      
];



const humanRoutes =[
    // { path: "user", component: UserComponent, canActivate: [loginGuard] ,data:{breadcrumb:lang.user}},
]



 
const redirectToNotFound = { path: '**', redirectTo: '/404' };

export const routes: Routes = [
    ...authRoutes,
    {
        path: "",
        component: LayoutComponent,
        children: [
            ...dutyStationRoutes,
            ...humanRoutes,
        ],
    }, 
    redirectToNotFound,
];