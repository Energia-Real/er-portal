import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

const authModule = () => import('./auth/auth.module').then(x => x.AuthModule);
const LayoutModule = () => import('./layout/layout.module').then(x => x.LayoutModule);

const routes: Routes = [
  { path: 'er', loadChildren: LayoutModule },
  // { path: 'er', loadChildren: LayoutModule, canActivate: [authGuard] },
  { path: '', loadChildren: authModule },
  { path: '**', redirectTo: '/er' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
