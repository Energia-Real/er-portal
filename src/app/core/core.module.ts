import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MaterialModule } from '@app/shared/material/material.module';



@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    SpinnerComponent
  ]
})
export class CoreModule { }
