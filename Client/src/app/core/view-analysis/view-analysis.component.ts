import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
//import { Chart } from 'chart.js';
import Chart from 'chart.js/auto';
import { TrackerDetailsService } from '../services/tracker-details.service';
import { DatePipe } from '@angular/common';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-view-analysis',
  templateUrl: './view-analysis.component.html',
  styleUrls: ['./view-analysis.component.scss'],
})
export class ViewAnalysisComponent implements OnInit, AfterViewInit {
  @ViewChild('chartLoc') chartLoc: ElementRef;
  range: number = 6;
  _selectedTheme = 'light-theme';
  monthRange: any[];
  allTransactionDetails: any[];
  labels: string[] = [];

  constructor(private trackerDetailsService: TrackerDetailsService) {}

  ngOnInit(): void {
    const pipe = new DatePipe('en-US');
    for (let i = this.range - 1; i >= 0; i--) {
      const currDate = new Date();
      const featureDate = new Date(currDate.setMonth(currDate.getMonth() - i));

      this.labels.push(pipe.transform(featureDate, 'MMM-yy'));
    }
    console.log(this.labels);
    this.trackerDetailsService.getDateRange().subscribe((data) => {
      this.monthRange = data;
    });
    this.getTransaction();
  }

  ngAfterViewInit(): void {
    const canvas = this.chartLoc.nativeElement;
    const context = canvas.getContext('2d');
    const myChart = new Chart(context, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  getTransaction() {
    this.trackerDetailsService
      .getTransaction({ monthRange: this.range })
      .subscribe((data) => {
        this.allTransactionDetails = cloneDeep(data);
        //data.filter()
      });
  }
}
