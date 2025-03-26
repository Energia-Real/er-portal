import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, first } from 'rxjs';
import { AuthService } from '../auth.service';
import { notificationData } from '@app/shared/models/general-models';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  loginForm = this.fb.group({
    email: ['', { validators: [Validators.required, Validators.email] }],
    password: ['', { validators: [Validators.required, this.passwordValidator] }]
  });

  showPassword: boolean = false;
  loading: boolean = false;
  showRegisterButton: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog,

    private router: Router,
    private accountService: AuthService,
    private notificationDataService: NotificationDataService
  ) { }

  onSubmit() {
    this.loading = true;
    this.loginForm.disable();
    this.accountService.login(this.loginForm.get('email')?.value!, this.loginForm.get('password')?.value!)
      .pipe(first())
      .subscribe({
        next: ({ response }: any) => {
          const accessRoutes: { [key: string]: string } = {
            'BackOffice': '/er',
            'Clients': '/er/client-home',
            'Billing': '/er/rates',
            'Admin': '/er/admin-home',
          };

          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || accessRoutes[response.accessTo] || '/er';
          const startday = this.route.snapshot.queryParams['startday'];
          const endday = this.route.snapshot.queryParams['endday'];

          const queryParams = startday && endday ? { startday, endday } : null;
          this.router.navigate([returnUrl], { queryParams });
        },
        error: (err) => {
          this.alertInformationModal();
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  passwordValidator(control: any) {
    const password = control.value;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[^a-zA-Z0-9]/.test(password);
    const isLengthValid = password.length >= 8;

    const isValid =
      hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter && isLengthValid;

    return isValid ? null : { invalidPassword: true };
  }


  alertInformationModal() {
    this.loading = false;
    const dataNotificationModal: notificationData = this.notificationDataService.showNoLoginCredentialsAlert();

    this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    });
  }


  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
