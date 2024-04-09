import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  
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

  ngOnInit(): void {
    console.log('gdf');
    console.log(this.accountService?.getDecryptedUser());
    
  }
  
  onSubmit() {
    this.loading = true;
    this.accountService.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
      .pipe(first())
      .subscribe({
        next: (response:any) => {
          console.log(response.accessTo == 'backoffice');
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || `${response.accessTo == 'backoffice' ? '/assets' : '/home'}`;
          // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || `/assets`;
          console.log(returnUrl);
          
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
}
