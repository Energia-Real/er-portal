import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
  registerForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  successfulCreate: boolean = false;
  errorCreate: boolean = false;
  buttonDisabled: boolean = false;
  loading: boolean = false;
  messageError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$/)]],
      passwordConfirm: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$/), this.passwordMatchValidator]]
    });
  }

  onSubmit() {
    this.messageError = '';
    this.errorCreate = false;
    let userData = {
      email: this.registerForm.get("email")?.value,
      password: this.registerForm.get("password")?.value,
      nombres: this.registerForm.get("name")?.value,
      apellidos: this.registerForm.get("lastname")?.value,
      clientId: [0]
    }
    this.loading = true;
    this.accountService.register(userData).subscribe({
      next: resp => {
        this.errorCreate = false;
        this.successfulCreate = true;
        this.loading = false;
        this.router.navigate(['']);
      },
      error: err => {
        console.log(err.error.errors);
        Swal.fire('Error', err.error.errors[0].descripcion, 'error');
        this.errorCreate = true;
        this.successfulCreate = false;
        this.loading = false;
        this.messageError = err.error.errors[0].descripcion;
      }
    });
  }

  passwordValidator(control: any) {
    const password = control.value;

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
    const isLengthValid = password.length >= 8;

    const isValid =
      hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter && isLengthValid;

    return isValid ? null : { invalidPassword: true };
  }

  togglePasswordVisibility(fieldNumber: number): void {
    if (fieldNumber === 1) {
      this.showPassword = !this.showPassword;
    } else if (fieldNumber === 2) {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  private passwordMatchValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = this.registerForm?.get('password')?.value;
    const confirmPassword = control.value;

    if (password === confirmPassword) {
      return null;
    } else {
      return { 'noCoincide': true };
    }
  }
}
