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
import { TransDetails } from 'src/app/interfaces/model';

@Component({
  selector: 'app-view-analysis',
  templateUrl: './view-analysis.component.html',
  styleUrls: ['./view-analysis.component.scss'],
})
export class ViewAnalysisComponent implements OnInit {
  @ViewChild('lineChartLoc') lineChartLoc: ElementRef;
  @ViewChild('pieChartLoc') pieChartLoc: ElementRef;
  range: number = 6;
  _selectedTheme = 'light-theme';
  monthRange: any[];
  allTransactionDetails: TransDetails[];
  monthlyTotalExpenses = {};
  monthlyExpensesChart: Chart<'line', unknown[], string>;
  sectionExpensesChart: Chart<'pie', unknown[], string>;
  datePipe: DatePipe = new DatePipe('en-US');

  constructor(private trackerDetailsService: TrackerDetailsService) {}

  ngOnInit(): void {
    this.trackerDetailsService.getDateRange().subscribe((data) => {
      this.monthRange = data;
    });
    this.getTransaction();
  }

  getMonthlyExpensesTotal(): any {
    let monthlyTotalExpenses = {};
    const allTransactionDetailsTemp = cloneDeep(this.allTransactionDetails);
    const onlyDebitTrxs = allTransactionDetailsTemp.filter(
      (eachTrx) => eachTrx.creditDebitInd === 'D'
    );
    monthlyTotalExpenses = onlyDebitTrxs.reduce((acc, currVal) => {
      const label = this.datePipe.transform(
        new Date(currVal.transDate),
        'MMM-yy'
      );
      acc[label] = acc[label]
        ? acc[label] + parseInt(currVal.transAmount)
        : parseInt(currVal.transAmount);
      return acc;
    }, monthlyTotalExpenses);
    this.monthlyExpensesChartCreate(
      Object.keys(monthlyTotalExpenses),
      Object.values(monthlyTotalExpenses)
    );
  }

  getTransaction() {
    this.trackerDetailsService
      .getTransaction({ monthRange: this.range })
      .subscribe((data: TransDetails[]) => {
        this.allTransactionDetails = cloneDeep(
          data.sort((a, b) =>
            new Date(a.transDate).getTime() - new Date(b.transDate).getTime() >
            0
              ? 1
              : -1
          )
        );
        this.getMonthlyExpensesTotal();
        this.createSectionExpenseGraphLabel('Apr-22');
      });
  }

  createSectionExpenseGraphLabel(monthSelected: string) {
    const allTransactionDetailsTemp = cloneDeep(this.allTransactionDetails);
    let sectionTotalExtenses = {};
    let colorList = [];
    sectionTotalExtenses = allTransactionDetailsTemp.reduce((acc, currVal) => {
      const formattedTransDate = this.datePipe.transform(
        currVal.transDate,
        'MMM-yy'
      );

      if (
        formattedTransDate === monthSelected &&
        currVal.creditDebitInd === 'D'
      ) {
        const color = Math.floor(0x1000000 * Math.random()).toString(16);
        colorList.push(`#${('000000' + color).slice(-6)}`);
        const sectionList = this.trackerDetailsService.sectionDetails;
        const label = sectionList.filter(
          (section) => section.value === currVal.sectionValue
        )[0]?.label;
        acc[label] = acc[label]
          ? acc[label] + parseInt(currVal.transAmount)
          : parseInt(currVal.transAmount);
      }
      return acc;
    }, {});
    this.sectionExpensesChartCreate(
      Object.keys(sectionTotalExtenses),
      Object.values(sectionTotalExtenses),
      colorList
    );
  }

  monthlyExpensesChartCreate(labels: string[], monthlyTotalExpenses: string[]) {
    const canvas = this.lineChartLoc.nativeElement;
    const context = canvas.getContext('2d');
    this.monthlyExpensesChart = new Chart(context, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Monthly Expenses',
            data: monthlyTotalExpenses,
            borderWidth: 1,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.5,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        onClick: (evt, activeElements, chart) => {
          if (activeElements[0] !== undefined) {
            this.monthCLickOnLineGraph(activeElements[0]?.index);
          }
        },
      },
    });
  }

  monthCLickOnLineGraph(dataIndex: number) {
    this.sectionExpensesChart.destroy();
    this.createSectionExpenseGraphLabel(
      this.monthlyExpensesChart.data.labels[dataIndex]
    );
  }

  sectionExpensesChartCreate(
    labels: string[],
    sectionTotalExpenses: string[],
    backgroundColors: string[]
  ) {
    const canvas = this.pieChartLoc.nativeElement;
    const context = canvas.getContext('2d');
    this.sectionExpensesChart = new Chart(context, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Monthly Expenses',
            data: sectionTotalExpenses,
            borderWidth: 1,
            backgroundColor: backgroundColors,
            hoverOffset: 4,
          },
        ],
      },
    });
  }
}
