import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserDetails } from 'src/app/interfaces/model';
import { AuthService } from '../../services/auth.service';
import { TrackerDetailsService } from '../../services/tracker-details.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  registrationFrom: FormGroup;
  mailVerified = 'not tried';
  hide1 = true;
  hide2 = true;
  verifyMailOpen = false;
  counter$: Subscription;
  myMailTimer: string;
  tempMailOtp: any;
  mailOtp: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private trackerDetailsService: TrackerDetailsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.isLoggedIn().subscribe((user) => {
      if (user) {
        this.router.navigate(['/addTransaction']);
      }
    });
    this.createRegistrationForm();
    this.trackerDetailsService.setHeaderTitle(`Welcome`);
  }

  createRegistrationForm() {
    this.registrationFrom = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      passWord: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/
          ),
        ],
      ],
      passWordConf: ['', Validators.required],
    });
  }

  getFormField(name: string) {
    this.registrationFrom.get(name);
  }

  mailOtpGenerate() {
    this.counter$ ? this.counter$.unsubscribe() : '';
    this.mailVerified = 'not tried';
    this.auth
      .mailOtpGenerate(this.registrationFrom.controls.emailId.value)
      .subscribe({
        next: (data) => {
          this.verifyMailOpen = true;
          this.tempMailOtp = data;
        },
        error: (error: HttpErrorResponse) => {
          this.mailVerified = error.error.msg;
          this.trackerDetailsService.showError(error.error.msg);
        },
      });

    this.counter$ = this.startTimer('00:02:00').subscribe((data) => {
      this.myMailTimer = data.substr(3, 5);
    });
  }

  verifyMail() {
    this.mailOtp = (<HTMLInputElement>(
      document.getElementById('otp-mail')
    )).value;

    if (this.myMailTimer == '00:00') {
      this.mailVerified = 'expired';
      this.trackerDetailsService.showError('OTP Expired, Please retry');
      this.verifyMailOpen = false;
      this.tempMailOtp.mailOtp = null;
    } else {
      if (this.mailOtp == this.tempMailOtp.mailOtp) {
        this.mailVerified = 'matched';
        setTimeout(() => {
          this.verifyMailOpen = false;
        }, 2000);
      } else {
        this.mailVerified = 'not matched';
        this.trackerDetailsService.showError('otp not matched');
      }
    }
  }

  startTimer(str: string): Observable<any> {
    var startHrs: number = parseInt(str.substr(0, 2));
    var startMin: number = +str.substr(3, 2);
    var startSec: number = +str.substr(6, 2);
    var maxCount = startHrs * 3600 + startMin * 60 + startSec;
    var count = 0;
    return Observable.create((obs) => {
      var intervalId = setInterval(() => {
        count = count + 1;
        if (startSec == 0 && startMin != 0) {
          startMin = startMin - 1;
          startSec = 60;
        }
        if (startMin == 0 && startSec == 0) {
          startHrs = startHrs - 1;
          startMin = 60;
          startSec = 60;
        }

        if (count == maxCount) {
          clearInterval(intervalId);
        }

        startSec = startSec - 1;
        obs.next(
          ('0' + startHrs).slice(-2) +
            ':' +
            ('0' + startMin).slice(-2) +
            ':' +
            ('0' + startSec).slice(-2)
        );
      }, 1000);
    });
  }

  registrationSubmit() {
    let userDetails: UserDetails = this.registrationFrom.value;
    this.auth.userRegistration(userDetails);
  }
}
