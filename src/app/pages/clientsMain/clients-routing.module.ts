import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ClientsComponent } from './clients/clients.component';


const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: ClientsComponent },
      // { path: 'edit/:id', component: NewPlantComponent },
      // { path: 'details/:assetId', component: DetailsContainerComponent },
      // { path: 'management', component: ManagementComponent },
      { path: '**', redirectTo: 'management' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
