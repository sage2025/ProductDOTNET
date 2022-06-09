import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
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
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  loginForm: FormGroup;
  minPw: number = 8;

  matcher = new MyErrorStateMatcher();
  hide = true;
  ErrorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [Validators.required, Validators.minLength(this.minPw)]],
    });
  }
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    var loginData = this.loginForm.value;
    if(loginData.email != '' && loginData.password != '') {
      this.userService.signin(loginData).subscribe(
        result => {
          if(result['msg'] === "No user") {
            this.ErrorMessage = "This user doesn't exist. Please enter correctly.";
            this.email.setErrors([{ isEmailError : true}]);
            this.email.setValue('');
            this.password.setValue('');
          } else if(result['msg'] === "Password invalid") {
            this.ErrorMessage = "Password is invalid. Please enter correctly.";
            this.password.setErrors([{ isPasswordError : true}]);
            this.password.setValue('');
          } else if(result['msg'] === "Success") {
            this.userService.loggedInUser = result['user'];
            this.userService.loggedInUser.order = [];
            localStorage.setItem('user', JSON.stringify(this.userService.loggedInUser));

            var clearOrder = [];
            localStorage.setItem('order', JSON.stringify(clearOrder));
            this.router.navigate(['/']);
          }
        },
        error => {
          console.log(error);
        }
      )
    }
  }
}
