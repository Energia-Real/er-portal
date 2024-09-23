import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { redirectGuard } from '@app/shared/guards/redirect.guard';
import { HomeComponent } from '@app/pages/homeMain/home/home.component';

const HomeBackOfficeModule = () => import('../pages/home-back-office/home-back-office.module').then(x => x.HomeBackOfficeModule);
const HomeAdminModule= () => import('../pages/home-admin/home-admin.module').then(x => x.HomeAdminModule);
const plantsModule = () => import('../pages/assetsMain/assets/assets.module').then(x => x.PlantsModule);
const clientModule = () => import('../pages/clientsMain/clients-main.module').then(x => x.ClientsMainModule);
const energyProductionModule = () => import('../pages/energyProductionMain/energy-production-main.module').then(x => x.EnergyProductionMainModule);
const billingModule = () => import('../pages/billing/billing.module').then(x => x.BillingModule);
const pricingModule = () => import('../pages/pricing/pricing.module').then(x => x.PricingModule);


const routes: Routes = [
  {
    path: '', 
    component: LayoutComponent,
    children:[
      {
        path: 'backoffice-home', 
        loadChildren: HomeBackOfficeModule, 
        canActivate: [redirectGuard],
        data: { roles: ['BackOffice']} 
      },
      {
        path: 'admin-home', 
        loadChildren: HomeAdminModule, 
        canActivate: [redirectGuard],
        data: { roles: ['Administrator']}  
      },
      {
        path: 'client-home', 
        component: HomeComponent,  
        canActivate: [redirectGuard],
        data: { roles: ['Clients'] }
      },
     
      {
        path: 'plants',
        loadChildren:plantsModule ,
        canActivate: [redirectGuard],
        data: { roles: ['BackOffice', 'Administrator']} 
      },
      {
        path: 'clients',
        loadChildren: clientModule,
        canActivate: [redirectGuard],
        data: { roles: ['BackOffice', 'Administrator']}
      },
      {
        path: 'energyProduction',
        loadChildren: energyProductionModule,
        canActivate: [redirectGuard],
        data: { roles: ['BackOffice', 'Administrator']}
      },
      {
        path: 'billing',
        loadChildren: billingModule,
        canActivate: [redirectGuard],
        data: { roles: ['Billing', 'Administrator']}
      },
      {
        path: 'pricing',
        loadChildren: pricingModule,
        canActivate: [redirectGuard],
        data: { roles: ['Billing', 'Administrator']}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
