import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeAdminRoutingModule } from './home-admin-routing.module';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';
import { MaterialModule } from '@app/shared/material/material.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeAdminComponent
  ],
  imports: [
    CommonModule,
    HomeAdminRoutingModule,
    MessageNoDataComponent,
    MaterialModule,
    CarouselModule,
    ReactiveFormsModule
  ]
})
export class HomeAdminModule { }
