import { Component, Inject, OnDestroy} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-export-data',
  templateUrl: './modal-export-data.component.html',
  styleUrl: './modal-export-data.component.scss'
})
export class ModalExportDataComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
  ) { }


  closeModal() {
    this.dialogRef.close({
      close: true
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
