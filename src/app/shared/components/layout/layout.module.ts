import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/shared/material/material.module';
import { FooterComponent } from '../footer/footer.component';

@NgModule({
  declarations: [
    LayoutComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    LayoutComponent,
    FooterComponent
  ]
})
export class LayoutModule { }
