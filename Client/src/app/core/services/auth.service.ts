import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { UserDetails } from "src/app/interfaces/model";
import * as environment from "src/environments/environment";

interface UserDetailsResp {
  msg?: string;
  token: string;
  user: UserDetails;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userDetails = new Subject<UserDetails>();
  environment = environment.environment;

  constructor(private http: HttpClient) {}

  loginUser(userDetails: UserDetails) {
    this.http
      .post(
        `${this.environment.baseUrl}${this.environment.servlet_endpoint.login}`,
        { userDetails }
      )
      .subscribe((userDetailsResp: UserDetailsResp) => {
        localStorage.setItem("token", userDetailsResp.token);
        this.userDetails.next(userDetailsResp.user);
      });
  }

  userRegistration(userDetails: UserDetails) {
    this.http
      .post(
        `${this.environment.baseUrl}${this.environment.servlet_endpoint.registration}`,
        { userDetails }
      )
      .subscribe((userDetailsResp: UserDetailsResp) => {
        localStorage.setItem("token", userDetailsResp.token);
        this.userDetails.next(userDetailsResp.user);
      });
  }

  getUserDetails() {
    let token = this.getLocalStorageItem();
    if (token) {
      this.http
        .get(
          `${this.environment.baseUrl}${this.environment.servlet_endpoint.getUserDetails}`
        )
        .subscribe((userData: UserDetails) => {
          this.userDetails.next(userData);
        });
    } else {
      this.userDetails.next(null);
    }
  }

  getLocalStorageItem() {
    return localStorage.getItem("token");
  }

  mailOtpGenerate(email: string) {
    return this.http.post(
      `${this.environment.baseUrl}${this.environment.servlet_endpoint.mailOtpGenerator}`,
      { email }
    );
  }
}
