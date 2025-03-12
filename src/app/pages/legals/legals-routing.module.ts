import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QyaComponent } from './qya/qya.component';
import { ContactComponent } from './contact/contact.component';


const routes: Routes = [
  {
    path: '', 
    pathMatch: 'full',
    redirectTo: 'qya'
  },
  { path: 'qya', 
    component: QyaComponent 
  },
  { path: 'contact', 
    component: ContactComponent 
  },
  {
    path: '**', 
    redirectTo: 'qya'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalsRoutingModule { }
