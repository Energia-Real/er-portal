import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { redirectGuard } from '@app/shared/guards/redirect.guard';
import { HomeComponent } from '@app/pages/homeMain/home/home.component';
import { FilterGuard } from '@app/shared/guards/filter.guard';

const HomeBackOfficeModule = () => import('../pages/home-back-office/home-back-office.module').then(x => x.HomeBackOfficeModule);
const HomeAdminModule= () => import('../pages/home-admin/home-admin.module').then(x => x.HomeAdminModule);
const plantsModule = () => import('../pages/plants-main/plants-main.module').then(x => x.PlantsMainModule);
const clientModule = () => import('../pages/clientsMain/clients-main.module').then(x => x.ClientsMainModule);
const energyProductionModule = () => import('../pages/energyProductionMain/energy-production-main.module').then(x => x.EnergyProductionMainModule);
const billingModule = () => import('../pages/billing-main/billing-main.module').then(x => x.BillingMainModule);
const ratesModule = () => import('../pages/rates-main/rates-main.module').then(x => x.RatesMainModule);


const routes: Routes = [
  {
    path: '', 
    component: LayoutComponent,
    children:[
      {
        path: 'backoffice-home', 
        loadChildren: HomeBackOfficeModule, 
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: ['BackOffice']} 
      },
      {
        path: 'admin-home', 
        loadChildren: HomeAdminModule, 
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: ['Admin']}  
      },
      {
        path: 'client-home', 
        component: HomeComponent,  
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: ['Clients'] }
      },
     
      {
        path: 'plants',
        loadChildren:plantsModule ,
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: ['BackOffice', 'Admin', 'Clients']} 
      },
      {
        path: 'clients',
        loadChildren: clientModule,
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: ['BackOffice', 'Admin']}
      },
      {
        path: 'energy',
        loadChildren: energyProductionModule,
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: ['BackOffice', 'Admin']}
      },
      {
        path: 'billing',
        loadChildren: billingModule,
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: ['Billing', 'Admin', 'Clients']}
      },
      {
        path: 'rates',
        loadChildren: ratesModule,
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: ['Billing', 'Admin']}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
