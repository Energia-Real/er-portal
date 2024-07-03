import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { SelectPayComponent } from './select-pay/select-pay.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      // { path: 'edit/:id', component: NewPlantComponent },
      // { path: 'details/:assetId', component: DetailsContainerComponent },
      { path: 'selectPay', component: SelectPayComponent },
      { path: '**', redirectTo: 'selectPay' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
