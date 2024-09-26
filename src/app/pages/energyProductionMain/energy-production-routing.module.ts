import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnergyProductionComponent } from './energy-production/energy-production.component';


const routes: Routes = [

  { path: '', component: EnergyProductionComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnergyProductionRoutingModule
 { }
