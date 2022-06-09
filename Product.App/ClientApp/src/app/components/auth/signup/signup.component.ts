import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  formGroup: FormGroup;

  matcher = new MyErrorStateMatcher();
  isPasswordHide = true;
  isConfirmPasswordHide = true;
  minPw = 8;
  isEmailAvailable: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      emailFormControl: ['', [
        Validators.required,
        Validators.email,
      ]],
      usernameFormControl: ['', [
        Validators.required
      ]],
      password: ['', [Validators.required, Validators.minLength(this.minPw)]],
      password2: ['', [Validators.required]]
    }, {validator: this.passwordMatchValidator});
  }
  get emailFormControl() {
    return this.formGroup.get('emailFormControl');
  }
  get usernameFormControl() {
    return this.formGroup.get('usernameFormControl');
  }
  get password() { return this.formGroup.get('password'); }
  get password2() { return this.formGroup.get('password2'); }

  onPasswordInput() {
    if (this.formGroup.hasError('passwordMismatch'))
      this.password2.setErrors([{'passwordMismatch': true}]);
    else
      this.password2.setErrors(null);
  }

  passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if (formGroup.get('password').value === formGroup.get('password2').value)
      return null;
    else
      return {passwordMismatch: true};
  };

  onSubmit() {
    var formValue = this.formGroup.value;
    if(formValue.usernameFormControl != '' && formValue.emailFormControl != '' && formValue.password != '' && formValue.password2 != '' && formValue.password == formValue.password2 && this.isEmailAvailable === true)
    {
      var data = {
        username: this.formGroup.value.usernameFormControl,
        email: this.formGroup.value.emailFormControl,
        password: this.formGroup.value.password
      };
      this.userService.signup(data).subscribe(
        result => {
          this.router.navigate(['auth/signin']);
        },
        error => {
          console.log(error);
        }
      )
    } else {
      return;
    }

  }

  onEmailChecking() {
    if(this.emailFormControl.errors === null) {
      var email = this.emailFormControl.value;
      this.userService.checkingEmail(email).subscribe(
        result => {
          if(result === true) {
            this.emailFormControl.setErrors(null);
            this.isEmailAvailable = true;
          } else {
            this.emailFormControl.setErrors([{'isEmailAvailable': false}]);
            this.isEmailAvailable = false;
          }
        },
        error => {
          console.log(error);
        }
      )
    }

  }
}
