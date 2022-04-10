import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Message } from "primeng//api";
import { MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { TrackerDetailsService } from "../../services/tracker-details.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  @Output() formViewRegister = new EventEmitter<any>();
  @Output() popUpClosed = new EventEmitter<any>();
  hide = true;
  loginForm: FormGroup;
  msgs: Message[] = [];

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit() {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      emailId: ["", Validators.required],
      passWord: ["", Validators.required],
    });
  }

  loginUser() {
    this.auth.loginUser(this.loginForm.value);
  }
}
