import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  actionComplete: boolean = false;

  email = new FormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]);

  constructor(
    private dialog: MatDialog,
    private notificationService: OpenModalsService,
    private router: Router
  ) { }

  actionSave() {
    this.actionComplete = true;
  }

  completionMessage(edit = false) {
    this.notificationService
      .notificacion(
        `¡Restablecimiento de contraseña enviado!`,
        'save',
      )
      .afterClosed()
      
      .subscribe((_) => this.toBack());
  }

  deleteData() {
    this.notificationService
      .notificacion(
        '¿Estás seguro de eliminar el registro?',
        'question',
      )
      .afterClosed()
      .subscribe((_) => {
        this.notificationService
          .notificacion(
            'Record deleted.',
            'delete',
          )
          .afterClosed()
          .subscribe((_) => {

          });
      });
  }

  toBack() {
    this.router.navigateByUrl(`/`)
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
