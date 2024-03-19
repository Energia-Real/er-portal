import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './_helpers/auth.guard';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const assetsModule = () => import('./assets/assets.module').then(x => x.AssetsModule);
const homeComponent = () => import('./home/home.component').then(x => x.HomeComponent);
const overviewComponent = () => import('./overview/overview.component').then(x => x.OverviewComponent);

const routes: Routes = [
  { path: '', loadComponent: homeComponent, canActivate: [authGuard] },
  { path: 'assets', loadChildren: assetsModule, canActivate: [authGuard] },
  { path: 'overview', loadComponent: overviewComponent, canActivate: [authGuard] },
  { path: 'account', loadChildren: accountModule },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
