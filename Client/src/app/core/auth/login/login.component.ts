import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Message } from 'primeng//api';
import { AuthService } from '../../services/auth.service';
import { TrackerDetailsService } from '../../services/tracker-details.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() formViewRegister = new EventEmitter<any>();
  @Output() popUpClosed = new EventEmitter<any>();
  hide = true;
  loginForm: FormGroup;
  msgs: Message[] = [];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private trackerDetailsService: TrackerDetailsService
  ) {}

  ngOnInit() {
    this.createLoginForm();
    this.trackerDetailsService.setHeaderTitle(`Welcome`);
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      emailId: ['', Validators.required],
      passWord: ['', Validators.required],
    });
  }

  loginUser() {
    this.auth.loginUser(this.loginForm.value);
  }
}
