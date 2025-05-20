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
import { MonthAbbreviationPipe } from '../pipes/month-abbreviation.pipe';
import { TabulatorTableComponent } from './tabulator-table/tabulator-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component';
import { D3graphComponent } from './d3graph/d3graph.component';

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
    MonthAbbreviationPipe,
    TabulatorTableComponent,
    D3graphComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    LanguageSwitcherComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MapaComponent,
    TooltipComponent,
    NotificationComponent,
    TimeAgoPipe,
    MonthAbbreviationPipe,
    TabulatorTableComponent,
    TranslateModule,
    D3graphComponent
  ]
})
export class SharedComponensModule { }
