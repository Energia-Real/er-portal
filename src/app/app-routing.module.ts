import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guard/auth.guard';

const authModule = () => import('./auth/auth.module').then(x => x.AuthModule);
const assetsModule = () => import('./pages/assetsMain/assets/assets.module').then(x => x.AssetsModule);
const homeComponent = () => import('./pages/homeMain/home/home.component').then(x => x.HomeComponent);
const overviewComponent = () => import('./pages/overviewMain/overview/overview.component').then(x => x.OverviewComponent);
const paymentsModule = () => import('./pages/paymets-main/payments-main.module').then(x => x.PaymetsMainModule);

const routes: Routes = [
  { path: 'home', loadComponent: homeComponent, canActivate: [authGuard] },
  { path: 'assets', loadChildren: assetsModule, canActivate: [authGuard] },
  { path: 'overview', loadComponent: overviewComponent, canActivate: [authGuard] },
  { path: 'payments', loadChildren: paymentsModule, canActivate: [authGuard] },
  { path: '', loadChildren: authModule },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
