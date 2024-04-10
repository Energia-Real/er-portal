import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnBarComponent } from './return-bar.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    ReturnBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule
  ],
  exports: [
    ReturnBarComponent
  ]
})
export class ReturnBarModule { }
