import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthResponseData, AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})

export class AuthComponent implements OnInit {
  authForm: FormGroup;
  isLoginMode = true;
  isLoading = false;
  isError = false;
  errorMessage: string = null;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.isError = false;
  }
  onSubmitForm(email: string, password: string) {
    this.isError = false;
    if (this.authForm.invalid) {
      return;
    }
    let authObs: Observable<AuthResponseData>;
    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }
    authObs.subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/words-list']);
      },
      errorMessage => {
        this.isError = true;
        this.errorMessage = errorMessage;
        this.isLoading = false;
      });
    this.authForm.reset();
  }
  errorStatusChange(errorStatus) {
    this.isError = errorStatus;
  }
}
