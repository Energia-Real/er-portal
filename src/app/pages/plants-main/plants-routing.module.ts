import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantsDetailComponent } from './plant-detail-home/plant-details/plant-details.component';
import { PlantsComponent } from './plants/plants.component';
import { NewPlantComponent } from './plants/new-plant/new-plant.component';


const routes: Routes = [
  { path: '', component: PlantsComponent },
  { path: 'create', component: NewPlantComponent },
  { path: 'edit/:id', component: NewPlantComponent },
  { path: 'details/:id', component: PlantsDetailComponent },
  { path: '**', redirectTo: 'management' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantsRoutingModule { }
