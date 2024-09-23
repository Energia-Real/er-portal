import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricingMainComponent } from './pricing-main/pricing-main.component';

const routes: Routes = [
  {
    path: '', component: PricingMainComponent,
    children: [
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }
