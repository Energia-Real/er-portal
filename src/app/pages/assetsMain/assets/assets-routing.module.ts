import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';
import { LayoutComponent } from './layout/layout.component';
import { ManagementComponent } from './management/management.component';
import { DetailsContainerComponent } from './details-container/details-container.component';
import { Crete2Component } from './crete2/crete2.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'create', component: CreateComponent },
      { path: 'create2', component: Crete2Component },
      { path: 'edit/:assetId', component: EditComponent },
      { path: 'details/:assetId', component: DetailsContainerComponent },
      { path: 'management', component: ManagementComponent },
      { path: '**', redirectTo: 'management' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
