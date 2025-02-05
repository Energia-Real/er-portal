import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeAdminRoutingModule } from './home-admin-routing.module';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';
import { MaterialModule } from '@app/shared/material/material.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponensModule } from '@app/shared/components/shared-components.module';
import { PlantsMainModule } from '../plants-main/plants-main.module';


@NgModule({
  declarations: [
    HomeAdminComponent,
  
  ],
  imports: [
    CommonModule,
    HomeAdminRoutingModule,
    MessageNoDataComponent,
    MaterialModule,
    CarouselModule,
    ReactiveFormsModule,
    SharedComponensModule,
    PlantsMainModule 
  ]
})
export class HomeAdminModule { }
