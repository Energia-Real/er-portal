import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalConfirmationComponent } from '@app/shared/components/modal-confirmation/modal-confirmation.component';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  actionComplete : boolean = false;

  formData = this.formBuilder.group({
    password: [{ value: '', disabled: false }, Validators.required],
    confirmPassword: [{ value: '', disabled: false }, Validators.required],
  });

  email:string = ''
  code:string = ''
  
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private notificationService: OpenModalsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.onDestroy$)).subscribe((params: any) => {
      this.email = params['email'];
      this.code = params['code'];
    });
  }

  actionSave() {
    this.actionComplete = true;
    let objData :any = {
      ...this.formData.value,
      code : this.code,
      email: this.email
    }

    this.authService.resetyPassword(objData).subscribe({
      next: () => {
        this.completionMessage()
      },
      error: (error) => {
        this.actionComplete = false;
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    })
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

  get canSave() {
    const password = this.formData.get('password')?.value;
    const confirmPassword = this.formData.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword;
  }
  
  toBack() {
    this.router.navigateByUrl(`/`)
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
