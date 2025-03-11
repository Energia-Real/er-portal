import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, first } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, this.passwordValidator]]
  });

  showPassword: boolean = false;
  buttonDisabled: boolean = false;
  loading: boolean = false;
  showRegisterButton: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AuthService,
  ) {}

  onSubmit() {
    this.loading = true;
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
          this.loading = false;
          Swal.fire('Error', err.error.errors[0].descripcion, 'error');
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
