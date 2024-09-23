import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingMainComponent } from './billing-main/billing-main.component';

const routes: Routes = [
  {
    path: '', component: BillingMainComponent,
    children: [
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
