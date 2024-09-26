import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { HomeBackOfficeModule } from './pages/home-back-office/home-back-office.module';

const authModule = () => import('./auth/auth.module').then(x => x.AuthModule);
const plantsModule = () => import('./pages/assetsMain/assets/assets.module').then(x => x.PlantsModule);
const homeComponent = () => import('./pages/homeMain/home/home.component').then(x => x.HomeComponent);
const overviewComponent = () => import('./pages/overviewMain/overview/overview.component').then(x => x.OverviewComponent);
const paymentsModule = () => import('./pages/paymets-main/payments-main.module').then(x => x.PaymetsMainModule);
const clientModule = () => import('./pages/clientsMain/clients-main.module').then(x => x.ClientsMainModule);
const energyProductionModule = () => import('./pages/energyProductionMain/energy-production-main.module').then(x => x.EnergyProductionMainModule);
const LayoutModule = () => import('./layout/layout.module').then(x => x.LayoutModule);


const routes: Routes = [
 
  { path: 'er', loadChildren: LayoutModule, canActivate: [authGuard] },
  { path: '', loadChildren: authModule },
  { path: '**', redirectTo: '/er' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
