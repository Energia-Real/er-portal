import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeBackOfficeComponent } from './home-back-office/home-back-office.component';


const routes: Routes = [
  {
    path: '', component: HomeBackOfficeComponent,
    children: [
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeBackOfficeRoutingModule { } 
