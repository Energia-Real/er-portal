import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, first } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  loginForm!: FormGroup;
  showPassword: boolean = false;
  buttonDisabled: boolean = false;
  loading: boolean = false;
  showRegisterButton: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]]
    });
  }

  ngOnInit(): void { }

  // onSubmit() {
  //   this.loading = true;
  //   this.accountService.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
  //     .pipe(first())
  //     .subscribe({
  //       next: (response: any) => {
  //         const returnUrl = this.route.snapshot.queryParams['returnUrl'] || `${response.accessTo == 'BackOffice' ? '/er' : '/er'}`;
  //         this.router.navigateByUrl(returnUrl);
  //       },
  //       error: (err) => {
  //         this.loading = false;
  //         Swal.fire('Error', err.error.errors[0].descripcion, 'error');
  //       }
  //     });
  // }

  // http://localhost:9000/er/admin-home?startday=2025-06-01&endday=2025-10-01

  onSubmit() {
    this.loading = true;
    
    // Obtener parametros de la url
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      // Decodificar la url
      const decodedUrl = decodeURIComponent(returnUrl);
      console.log('Decoded Return URL:', decodedUrl);
      
      // Crear un objeto URL para poder extraer los parámetros
      const url = new URL(decodedUrl, window.location.origin);
      const params = new URLSearchParams(url.search);
      
      const startday = params.get('startday');
      const endday = params.get('endday');
      console.log('Startday:', startday);
      console.log('Endday:', endday);
  
      // Guardar en localStorage
      if (startday || endday) {
        localStorage.setItem('lastUrlParams', JSON.stringify({ startday, endday }));
      }
    }
  
    // Continuar con el proceso de login
    this.accountService.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/er';
          this.router.navigateByUrl(returnUrl);
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
    this.onDestroy$.unsubscribe();
  }
}
