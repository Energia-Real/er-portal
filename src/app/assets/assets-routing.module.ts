import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';
import { DetailsComponent } from './details/details.component';
import { LayoutComponent } from './layout/layout.component';
import { ManagementComponent } from './management/management.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'create', component: CreateComponent },
      { path: 'edit/:assetId', component: EditComponent },
      { path: 'details/:assetId', component: DetailsComponent },
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
