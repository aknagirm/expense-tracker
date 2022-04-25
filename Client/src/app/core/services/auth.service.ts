import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserDetails } from 'src/app/interfaces/model';
import * as environment from 'src/environments/environment';
import { TrackerDetailsService } from './tracker-details.service';

interface UserDetailsResp {
  msg?: string;
  token: string;
  user: UserDetails;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userDetails = new BehaviorSubject<UserDetails>(null);
  environment = environment.environment;

  constructor(
    private http: HttpClient,
    private router: Router,
    private trackerDetailsService: TrackerDetailsService
  ) {}

  loginUser(userDetails: UserDetails) {
    this.http
      .post(
        `${this.environment.baseUrl}${this.environment.servlet_endpoint.login}`,
        { userDetails }
      )
      .subscribe({
        next: (userDetailsResp: UserDetailsResp) => {
          localStorage.setItem('token', userDetailsResp.token);
          this.userDetails.next(userDetailsResp.user);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.trackerDetailsService.showError(error.error.msg);
        },
      });
  }

  logOut() {
    let userToken = localStorage.getItem('token');
    if (userToken) {
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    }
    this.userDetails.next(null);
  }

  userRegistration(userDetails: UserDetails) {
    this.http
      .post(
        `${this.environment.baseUrl}${this.environment.servlet_endpoint.registration}`,
        { userDetails }
      )
      .subscribe({
        next: (userDetailsResp: UserDetailsResp) => {
          localStorage.setItem('token', userDetailsResp.token);
          this.userDetails.next(userDetailsResp.user);
        },
        error: (error: HttpErrorResponse) =>
          this.trackerDetailsService.showError(error.error.msg),
      });
  }

  getUserDetails() {
    let token = this.getLocalStorageItem();
    if (token) {
      this.http
        .get(
          `${this.environment.baseUrl}${this.environment.servlet_endpoint.getUserDetails}`
        )
        .subscribe({
          next: (userData: UserDetails) => {
            this.userDetails.next(userData);
          },
          error: () => {
            this.userDetails.next(null);
          },
          complete: () => {},
        });
    } else {
      this.userDetails.next(null);
    }
  }

  getLocalStorageItem() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): Observable<UserDetails | HttpErrorResponse | Error> {
    return this.userDetails.asObservable();
  }

  mailOtpGenerate(email: string) {
    return this.http.post(
      `${this.environment.baseUrl}${this.environment.servlet_endpoint.mailOtpGenerator}`,
      { email }
    );
  }
}
