import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeBackOfficeComponent } from './home-back-office/home-back-office.component';
import { HomeBackOfficeRoutingModule } from './home-back-office-routing.module';



@NgModule({
  declarations: [
    HomeBackOfficeComponent,
  ],
  imports: [
    CommonModule,
    HomeBackOfficeRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class HomeBackOfficeModule { }
