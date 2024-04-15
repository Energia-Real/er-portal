import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalConfirmationComponent } from '@app/shared/components/modal-confirmation/modal-confirmation.component';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  public actionComplete : boolean = false;

  public formData = this.formBuilder.group({
    email: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
  });

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ModalConfirmationComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  constructor(
    public dialog: MatDialog,
    private notificationService: OpenModalsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  
  actionSave() {
    this.actionComplete = true;
    this.completionMessage()
  }

  completionMessage(edit = false) {
    this.notificationService
      .notificacion(
        'Éxito',
        `¡Restablecimiento de contraseña enviado!`,
        'save',
      )
      .afterClosed()
      .subscribe((_) => this.toBack());
  }

  deleteData() {
    this.notificationService
      .notificacion(
        'Pregunta',
        '¿Estás seguro de eliminar el registro?',
        'question',
      )
      .afterClosed()
      .subscribe((_) => {
        this.notificationService
          .notificacion(
            'Éxito',
            'Registro eliminado.',
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
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
