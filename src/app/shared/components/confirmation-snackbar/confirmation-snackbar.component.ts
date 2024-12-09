import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';



@Component({
  selector: 'app-confirmation-snackbar',
  templateUrl: './confirmation-snackbar.component.html',
  styleUrl: './confirmation-snackbar.component.scss'
})
export class ConfirmationSnackbarComponent {

  constructor(
    private snackBarRef: MatSnackBarRef<ConfirmationSnackbarComponent>,

    @Inject(MAT_SNACK_BAR_DATA) public data: any) {}

    closeSnackBar(): void {
      this.snackBarRef.dismiss();
    }

}
