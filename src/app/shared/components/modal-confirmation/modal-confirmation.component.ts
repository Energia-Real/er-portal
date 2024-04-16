import { NgClass, NgIf } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '@app/shared/material/material.module';
export interface FuseConfirmationConfig
{
    title?: string;
    message?: string;
    icon?: {
        show?: boolean;
        name?: string;
        color?: 'primary' | 'accent' | 'warn' | 'basic' | 'info' | 'success' | 'warning' | 'error';
    };
    actions?: {
        confirm?: {
            show?: boolean;
            label?: string;
            color?: 'primary' | 'accent' | 'warn';
        };
        cancel?: {
            show?: boolean;
            label?: string;
        };
    };
    dismissible?: boolean;
}

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrl: './modal-confirmation.component.scss',
  standalone   : true,
  encapsulation: ViewEncapsulation.None,
  imports      : [NgIf, MaterialModule, NgClass],


})
export class ModalConfirmationComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: FuseConfirmationConfig)
  {
  }
}