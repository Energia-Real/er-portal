import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinantialModelLayoutComponent } from './finantial-model-layout/finantial-model-layout.component';

const routes: Routes = [
  {
    path: '',
    component: FinantialModelLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinantialModelRoutingModule { }
