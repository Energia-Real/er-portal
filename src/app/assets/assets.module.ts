import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssetsRoutingModule } from './assets-routing.module';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ManagementComponent } from './management/management.component';
import { DetailsComponent } from './details/details.component';
import { LayoutModule } from '@app/_shared/components/layout/layout.module';
import { LayoutComponent } from './layout/layout.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

const angularMaterial = [
  MatMenuModule,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatSelectModule
];

@NgModule({
  declarations: [
    CreateComponent,
    EditComponent,
    ManagementComponent,
    DetailsComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    ...angularMaterial
  ]
})
export class AssetsModule { }
