import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/shared/material/material.module';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapaComponent } from './mapa/mapa.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { NotificationComponent } from './notification/notification.component';
import { ConfirmationSnackbarComponent } from './confirmation-snackbar/confirmation-snackbar.component';
import { NotificationCardCenterComponent } from './notification-card-center/notification-card-center.component';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { TabulatorTableComponent } from './tabulator-table/tabulator-table.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MapaComponent,
    TooltipComponent,
    NotificationComponent,
    ConfirmationSnackbarComponent,
    NotificationCardCenterComponent,
    TimeAgoPipe,
    TabulatorTableComponent
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
    TooltipComponent,
    NotificationComponent,
    TimeAgoPipe,
    TabulatorTableComponent
  ]
})
export class SharedComponensModule { }
