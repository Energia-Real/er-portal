import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { EnergyProductionComponent } from './energy-production/energy-production.component';


const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: EnergyProductionComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnergyProductionRoutingModule
 { }
