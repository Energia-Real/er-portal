import { NgClass, NgIf } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '@app/shared/material/material.module';
import { ConfirmationConfig } from '@app/shared/models/general-models';

@Component({
    selector: 'app-modal-confirmation',
    templateUrl: './modal-confirmation.component.html',
    styleUrl: './modal-confirmation.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NgIf, MaterialModule, NgClass],
    standalone: true
})
export class ModalConfirmationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationConfig) {
  }
}
