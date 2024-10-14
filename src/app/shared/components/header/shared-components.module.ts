import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/shared/material/material.module';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapaComponent } from '../mapa/mapa.component';
import { TooltipComponent } from '../tooltip/tooltip.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MapaComponent,
    TooltipComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MapaComponent,
    TooltipComponent
  ]
})
export class SharedComponensModule { }
