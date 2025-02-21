import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { BillingOverviewComponent } from './billing-overview/billing-overview.component';

const routes: Routes = [
  {
    path: '', component: BillingComponent,
    children: [
    ]
  },
  {
    path: 'overview', component: BillingOverviewComponent,
    children: [
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
