import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrackerDetailsService } from '../services/tracker-details.service';

@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.scss'],
})
export class AddDetailsComponent implements OnInit {
  constructor(private trackerDetailsService: TrackerDetailsService) {}

  ngOnInit() {
    this.trackerDetailsService.setHeaderTitle('Add Transaction Details');
  }
}
