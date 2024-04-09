import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssetsRoutingModule } from './assets-routing.module';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ManagementComponent } from './management/management.component';
import { DetailsComponent } from './details/details.component';
import { LayoutComponent } from './layout/layout.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DetailsContainerComponent } from './details-container/details-container.component';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutModule } from '@app/shared/components/layout/layout.module';
import { ReturnBarModule } from '@app/shared/components/return-bar/return-bar.module';

const angularMaterial = [
  MatMenuModule,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatSelectModule,
  MatTabsModule
];

@NgModule({
  declarations: [
    CreateComponent,
    EditComponent,
    ManagementComponent,
    DetailsComponent,
    LayoutComponent,
    DetailsContainerComponent,
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    ReturnBarModule,
    ...angularMaterial
  ]
})
export class AssetsModule { }
