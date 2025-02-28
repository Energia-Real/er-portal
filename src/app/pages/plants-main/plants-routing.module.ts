import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantsComponent } from './plants/plants.component';
import { NewPlantComponent } from './plants/new-plant/new-plant.component';
import { FilterGuard } from '@app/shared/guards/filter.guard';
import { PlantsDetailComponent } from './plant-details/plant-details.component';


const routes: Routes = [
  { 
    path: '', 
    component: PlantsComponent,
    canActivate: [FilterGuard]
   },
  { path: 'create', component: NewPlantComponent },
  { path: 'edit/:id', component: NewPlantComponent },
  {
    path: 'details/:id',
    component: PlantsDetailComponent,
    canActivate: [FilterGuard],
  },
  { path: '**', redirectTo: 'management' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantsRoutingModule { }
