import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators, ValidationErrors, ValidatorFn} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  formGroup: FormGroup;

  matcher = new MyErrorStateMatcher();
  isCurrentPasswordHide = true;
  isPasswordHide = true;
  isConfirmPasswordHide = true;
  minPw = 8;
  isEmailAvailable: boolean = true;
  isWrong: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      emailFormControl: [this.userService.loggedInUser['email'], [
        Validators.required,
        Validators.email,
      ]],
      usernameFormControl: [this.userService.loggedInUser['userName'], [
        Validators.required
      ]],
      current_password: ['', [Validators.required, Validators.minLength(this.minPw)]],
      password: ['', [Validators.required, Validators.minLength(this.minPw)]],
      password2: ['', [Validators.required]]
    }, {validator: this.passwordMatchValidator});
    this.formGroup.value.usernameFormControl = this.userService.loggedInUser['userName'];
    this.formGroup.value.emailFormControl = this.userService.loggedInUser['email'];
    console.log(this.formGroup.value)
  }
  get emailFormControl() {
    return this.formGroup.get('emailFormControl');
  }
  get usernameFormControl() {
    return this.formGroup.get('usernameFormControl');
  }
  get current_password() { return this.formGroup.get('current_password'); }
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
    if(this.formGroup.valid)
    {
      var data = {
        id: this.userService.loggedInUser['id'],
        username: this.formGroup.value.usernameFormControl,
        email: this.formGroup.value.emailFormControl,
        currentPassword: this.formGroup.value.current_password,
        password: this.formGroup.value.password,
        isAdmin: this.userService.loggedInUser['isAdmin']
      };
      this.userService.updateProfile(data, this.userService.loggedInUser['id']).subscribe(
        result => {
          // this.router.navigate(['auth/signin']);
          console.log(result)
          if(result['msg'] === 'success') {
            this.isWrong = false;
            this.snackBar.open("Successfully changed your account info.", "x", {
              verticalPosition: 'top',
              horizontalPosition: 'end'
            });
            this.current_password.setValue('');
            this.password.setValue('');
            this.password2.setValue('');
          } else {
            this.isWrong = true;
            this.current_password.setValue('');
          }
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
      this.userService.checkingEmailByProfile(email, this.userService.loggedInUser['id']).subscribe(
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
