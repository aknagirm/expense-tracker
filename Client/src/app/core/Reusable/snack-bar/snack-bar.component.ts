import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AlertObjectModel } from 'src/app/interfaces/model';
import { TrackerDetailsService } from '../../services/tracker-details.service';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
})
export class SnackBarComponent implements OnInit {
  colorCode: string = '';
  message: string = '';
  constructor(private trackerDetailsService: TrackerDetailsService) {}

  ngOnInit() {
    console.log('snackbar');
    this.trackerDetailsService
      .getAlert()
      .subscribe((alert: AlertObjectModel) => {
        switch (alert.alertType) {
          case 'error': {
            this.colorCode = 'red';
            break;
          }
          case 'success': {
            this.colorCode = 'green';
            break;
          }
          case 'info': {
            this.colorCode = 'blue';
            break;
          }
          case 'warning': {
            this.colorCode = 'yellow';
            break;
          }
        }
        this.message = alert.alertMessage;
        console.log(this.message, this.colorCode);
      });
  }
}
