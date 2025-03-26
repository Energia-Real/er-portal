import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QyaComponent } from './qya/qya.component';
import { ContactComponent } from './contact/contact.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsServiceComponent } from './terms-service/terms-service.component';
import { AdminQyaComponent } from './admin-qya/admin-qya.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'qya'
  },
  {
    path: 'qya',
    component: QyaComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-serivce',
    component: TermsServiceComponent
  },
  {
    path: 'qya-admin',
    component: AdminQyaComponent
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
