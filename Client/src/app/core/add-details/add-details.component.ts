import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.scss'],
})
export class AddDetailsComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  logout() {
    let userToken = localStorage.getItem('token');
    if (userToken) {
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    }
  }
}
