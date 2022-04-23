import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { debounceTime, fromEvent, Observable } from 'rxjs';
import {
  DateRangeModel,
  TransDetails,
  TransDetailsWithBlnc,
} from 'src/app/interfaces/model';
import { CommonModalComponent } from '../Reusable/common-modal/common-modal.component';
import { TrackerDetailsService } from '../services/tracker-details.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
})
export class TransactionDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  monthRange: DateRangeModel[];
  range: number;
  allTransactionDetails: TransDetailsWithBlnc[];
  datePipe: DatePipe = new DatePipe('en-US');
  allTransactionDetailsBkp: TransDetailsWithBlnc[];

  constructor(
    private trackerDetailsService: TrackerDetailsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.trackerDetailsService
      .getNewMonthSelected()
      .subscribe((newMonth: Date) => {
        if (this.searchInput) {
          this.searchInput.nativeElement.value = '';
        }
        this.getTransaction(newMonth);
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(500))
      .subscribe(() => {
        const allTransactionDetailsTemp = cloneDeep(
          this.allTransactionDetailsBkp
        );
        const searchInputVal = this.searchInput.nativeElement.value;
        this.allTransactionDetails = [];
        allTransactionDetailsTemp.forEach((eachTrx) => {
          const allVal: string[] = Object.values(eachTrx);
          for (let eachVal of allVal) {
            if (`${eachVal}`.indexOf(searchInputVal) !== -1) {
              this.allTransactionDetails.push(eachTrx);
              break;
            }
          }
        });
      });
  }

  getTransaction(newMonth: Date) {
    console.log(newMonth);
    const endDtTemp = new Date(
      newMonth.getFullYear(),
      newMonth.getMonth() + 1,
      1
    );
    const endDt = new Date(endDtTemp.setDate(endDtTemp.getDate() - 1));
    const startDt = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1);
    this.trackerDetailsService.setHeaderTitle(
      `Transactions of ${this.datePipe.transform(newMonth, 'MMM-yy')}`
    );
    this.trackerDetailsService
      .getTransaction(startDt, endDt)
      .subscribe((data: TransDetails[]) => {
        this.buildTransactionData(data);
      });
  }

  buildTransactionData(data: TransDetails[]) {
    this.allTransactionDetails = [];
    this.allTransactionDetailsBkp = [];
    this.allTransactionDetails = cloneDeep(
      data.sort((a, b) =>
        new Date(a.transDate).getTime() - new Date(b.transDate).getTime() > 0
          ? 1
          : -1
      )
    );
    const sectionList = this.trackerDetailsService.sectionDetails;
    let tempSum = 0;
    this.allTransactionDetails.forEach((eachTrx) => {
      eachTrx.sectionValue = sectionList.filter(
        (section) => section.value === eachTrx.sectionValue
      )[0]?.label;
      const transAmt =
        eachTrx.creditDebitInd === 'C'
          ? parseInt(eachTrx.transAmount)
          : parseInt(eachTrx.transAmount) * -1;
      tempSum = tempSum + transAmt;
      eachTrx.currBalance = tempSum;
      eachTrx.trxClicked = false;
    });
    this.allTransactionDetailsBkp = cloneDeep(this.allTransactionDetails);
  }

  transDetailsClicked(selectedTrx: TransDetailsWithBlnc) {
    this.allTransactionDetails.map((eachTrx) => {
      if (eachTrx._id.toString() == selectedTrx._id.toString()) {
        eachTrx.trxClicked = !eachTrx.trxClicked;
      } else {
        eachTrx.trxClicked = false;
      }
    });
  }

  deleteCalled(eachTrx: TransDetailsWithBlnc) {
    const confMsg = 'Are you sure you want to delete this transaction?';
    const dialogRef = this.dialog.open(CommonModalComponent, { data: confMsg });

    dialogRef.afterClosed().subscribe((confirmation: boolean) => {
      if (confirmation) {
        this.trackerDetailsService
          .deleteTransaction(eachTrx)
          .subscribe((data) => {
            this.buildTransactionData(data);
          });
      }
    });
  }
}
