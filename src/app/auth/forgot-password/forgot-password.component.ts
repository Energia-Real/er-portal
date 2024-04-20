import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalConfirmationComponent } from '@app/shared/components/modal-confirmation/modal-confirmation.component';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Subject } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  actionComplete : boolean = false;

  public email = new FormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]);

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private notificationService: OpenModalsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  
  actionSave() {
    this.actionComplete = true;
    
    this.authService.forgotPassword(this.email?.value!).subscribe({
      next: () => {
        this.completionMessage()
      },
      error: (error) => {
        this.actionComplete = false;
        this.notificationService.notificacion(`Ha ocurrido un error, por favor intenta más tarde.`, 'alert')
        console.error(error)
      }
    })
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
