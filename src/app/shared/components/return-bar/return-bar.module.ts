import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnBarComponent } from './return-bar.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/shared/material/material.module';

@NgModule({
  declarations: [
    ReturnBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    ReturnBarComponent
  ]
})
export class ReturnBarModule { }
