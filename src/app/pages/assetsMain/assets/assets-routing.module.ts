import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { ManagementComponent } from './management/management.component';
import { DetailsContainerComponent } from './details-container/details-container.component';
import { NewPlantComponent } from './new-plant/new-plant.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: ManagementComponent },
      { path: 'create', component: NewPlantComponent },
      { path: 'edit/:id', component: NewPlantComponent },
      { path: 'details/:assetId', component: DetailsContainerComponent },
      { path: '**', redirectTo: 'management' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
