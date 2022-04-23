import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import {
  AlertObjectModel,
  creditDebitIndType,
  DateRangeModel,
  MonthRange,
  SectionDetailsModel,
  TransDetails,
  TransDetailsWithBlnc,
  UserDetails,
} from 'src/app/interfaces/model';
import * as environment from 'src/environments/environment';
import { InputDetailsComponent } from '../Reusable/input-details/input-details.component';
import { SnackBarComponent } from '../Reusable/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class TrackerDetailsService {
  sectionDetails$ = new Subject<SectionDetailsModel[]>();
  sectionDetails: SectionDetailsModel[] = [];
  alertSubject = new Subject<AlertObjectModel>();
  environment = environment.environment;
  headerTitle$ = new Subject<string>();
  monthRangeChange$ = new BehaviorSubject<number>(3);
  newMonthSelected$ = new BehaviorSubject<Date>(new Date());

  constructor(private http: HttpClient, private matSnackBar: MatSnackBar) {}

  setNewMonthSelected(newMonth: Date) {
    this.newMonthSelected$.next(newMonth);
  }

  getNewMonthSelected(): Observable<Date> {
    return this.newMonthSelected$.asObservable();
  }

  setNewMonthRange(newMonthRange: number) {
    this.monthRangeChange$.next(newMonthRange);
  }

  getNewMonthRange(): Observable<number> {
    return this.monthRangeChange$.asObservable();
  }

  setHeaderTitle(title: string) {
    this.headerTitle$.next(title);
  }

  getHeaderTitle(): Observable<string> {
    return this.headerTitle$.asObservable();
  }

  setAlert(newAlert: AlertObjectModel) {
    this.alertSubject.next(newAlert);
  }

  getAlert() {
    return this.alertSubject.asObservable();
  }

  getSectionDetails(): Observable<SectionDetailsModel[]> {
    return this.sectionDetails$.asObservable();
  }

  getDateRange(): Observable<DateRangeModel[]> {
    return this.http.get<DateRangeModel[]>(
      `${this.environment.baseUrl}${this.environment.servlet_endpoint.getDateRange}`
    );
  }

  getIncomeDetailsSection() {
    this.http
      .get(
        `${this.environment.baseUrl}${this.environment.servlet_endpoint.getAllSection}`
      )
      .subscribe((sectionList: SectionDetailsModel[]) => {
        this.sectionDetails = sectionList;
        this.sectionDetails$.next(sectionList);
      });
  }

  saveTransaction(
    inputDetails: InputDetailsComponent,
    inputSection: SectionDetailsModel,
    creditDebitInd: creditDebitIndType
  ): Observable<any> {
    let inputForm: FormGroup = inputDetails.incomeDetailsForm;
    if (inputForm.valid) {
      let transDetails: TransDetails = {
        transDate: inputForm.value.transDate,
        creditDebitInd: creditDebitInd,
        sectionValue: inputSection.value,
        transAmount: inputForm.value.transAmount,
        note: inputForm.value.note,
      };
      return this.http
        .post(
          `${this.environment.baseUrl}${this.environment.servlet_endpoint.saveTransaction}`,
          { transDetails }
        )
        .pipe(
          map((transDetail) => {
            console.log(transDetail);
            this.matSnackBar.openFromComponent(SnackBarComponent, {
              duration: 5000,
            });
            let alertObj: AlertObjectModel = {
              alertMessage: transDetail['msg'],
              alertType: 'success',
            };
            this.setAlert(alertObj);
            inputDetails.incomeDetailsForm.reset();
            return transDetail;
          }),
          catchError((error) => {
            console.log(error);
            let errorMsg = error['msg']
              ? error['msg']
              : 'Fields do not have valid data!!!';
            this.showError(errorMsg);
            return error;
          })
        );
    } else {
      let errorMsg = 'Fields do not have valid data!!!';
      this.showError(errorMsg);
      return of(new Error(errorMsg));
    }
  }

  getTransaction(startDate: Date, endDate: Date): Observable<TransDetails[]> {
    return this.http.post<TransDetails[]>(
      `${this.environment.baseUrl}${this.environment.servlet_endpoint.getTransaction}`,
      { startDt: startDate, endDt: endDate }
    );
  }

  showError(errorMsg: string) {
    this.matSnackBar.openFromComponent(SnackBarComponent, {
      duration: 5000,
    });
    let alertObj: AlertObjectModel = {
      alertMessage: errorMsg,
      alertType: 'error',
    };
    this.setAlert(alertObj);
  }

  deleteTransaction(transaction: TransDetailsWithBlnc) {
    const httpParams = new HttpParams().set('_id', transaction._id);
    return this.http
      .delete(
        `${this.environment.baseUrl}${this.environment.servlet_endpoint.deleteTransaction}`,
        { params: httpParams }
      )
      .pipe(
        map((data) => {
          console.log(data);
          this.matSnackBar.openFromComponent(SnackBarComponent, {
            duration: 5000,
          });
          let alertObj: AlertObjectModel = {
            alertMessage: data['msg'],
            alertType: 'success',
          };
          this.setAlert(alertObj);
          return data['data'];
        }),
        catchError((error) => {
          console.log(error);
          let errorMsg = error['msg']
            ? error['msg']
            : 'Fields do not have valid data!!!';
          this.showError(errorMsg);
          return of(error);
        })
      );
  }
}
