import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalConfirmationComponent } from '@app/shared/components/modal-confirmation/modal-confirmation.component';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();
  actionComplete : boolean = false;

  formData = this.formBuilder.group({
    password: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
    confirmPassword: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
  });

  
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
        `¡Contraseña actualizada!`,
        'save',
      )
      .afterClosed()
      .subscribe((_) => this.toBack());
  }

  // get canSave() {
  //   return this.formData.get('password')?.value != this.formData.get('confirmPassword')?.value;
  // }

  get canSave() {
    const password = this.formData.get('password')?.value;
    const confirmPassword = this.formData.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword;
  }
  
  
  
  toBack() {
    this.router.navigateByUrl(`/`)
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
