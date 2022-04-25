import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'bank-app';
  constructor(private auth: AuthService, private route: Router) {}

  ngOnInit(): void {
    this.auth.getUserDetails();
  }
}
