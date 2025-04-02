import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { redirectGuard } from '@app/shared/guards/redirect.guard';
import { HomeComponent } from '@app/pages/homeMain/home/home.component';
import { FilterGuard } from '@app/shared/guards/filter.guard';
import { QyaComponent } from '@app/pages/legals/qya/qya.component';
import { LegalsModule } from '@app/pages/legals/legals.module';

const HomeBackOfficeModule = () => import('../pages/home-back-office/home-back-office.module').then(x => x.HomeBackOfficeModule);
const HomeAdminModule= () => import('../pages/home-admin/home-admin.module').then(x => x.HomeAdminModule);
const plantsModule = () => import('../pages/plants-main/plants-main.module').then(x => x.PlantsMainModule);
const clientModule = () => import('../pages/clientsMain/clients-main.module').then(x => x.ClientsMainModule);
const energyProductionModule = () => import('../pages/energyProductionMain/energy-production-main.module').then(x => x.EnergyProductionMainModule);
const billingModule = () => import('../pages/billing-main/billing-main.module').then(x => x.BillingMainModule);
const ratesModule = () => import('../pages/rates-main/rates-main.module').then(x => x.RatesMainModule);
const legalsModule = () => import('../pages/legals/legals.module').then(x => x.LegalsModule);
const finantialModel = () => import('../pages/finantial-model/finantial-model.module').then(x => x.FinantialModelModule);


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
        path: 'legals', 
        loadChildren: legalsModule,  
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: ['Clients','BackOffice','Admin','Plants','Billing'] }
      },
     
      {
        path: 'plants',
        loadChildren:plantsModule ,
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: ['Plants']} 
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
        path: 'invoice',
        loadChildren: billingModule,
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: ['Billing', 'Admin', 'Clients']}
      },
      {
        path: 'rates',
        loadChildren: ratesModule,
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: ['Billing', 'Admin']}
      },
      {
        path: 'finantial-model',
        loadChildren: finantialModel,
        canActivate: [redirectGuard, FilterGuard],
        data: { roles: [ 'Admin']}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
