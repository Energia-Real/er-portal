import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QyaComponent } from './qya/qya.component';
import { ContactComponent } from './contact/contact.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';


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
  { path: 'privacy-policy', 
    component: PrivacyPolicyComponent 
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
