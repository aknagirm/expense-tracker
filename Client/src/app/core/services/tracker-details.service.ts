import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import {
  AlertObjectModel,
  creditDebitIndType,
  MonthRange,
  SectionDetailsModel,
  TransDetails,
  UserDetails,
} from 'src/app/interfaces/model';
import * as environment from 'src/environments/environment';
import { InputDetailsComponent } from '../Reusable/input-details/input-details.component';
import { SnackBarComponent } from '../Reusable/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class TrackerDetailsService {
  sectionDetails = new Subject<SectionDetailsModel[]>();
  alertSubject = new Subject<AlertObjectModel>();
  environment = environment.environment;

  constructor(private http: HttpClient, private matSnackBar: MatSnackBar) {}

  setAlert(newAlert: AlertObjectModel) {
    console.log(newAlert);
    this.alertSubject.next(newAlert);
  }

  getAlert() {
    return this.alertSubject.asObservable();
  }

  getSectionDetails(): Observable<SectionDetailsModel[]> {
    return this.sectionDetails.asObservable();
  }

  getDateRange(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.environment.baseUrl}${this.environment.servlet_endpoint.getDateRange}`
    );
  }

  getIncomeDetailsSection() {
    this.http
      .get(
        `${this.environment.baseUrl}${this.environment.servlet_endpoint.getAllSection}`
      )
      .subscribe((sectionList: SectionDetailsModel[]) => {
        this.sectionDetails.next(sectionList);
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
      this.http
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
            return transDetail;
          }),
          catchError((error) => {
            console.log(error);
            let errorMsg = error['msg']
              ? error['msg']
              : 'Fields do not have valid data!!!';
            this.showError(errorMsg);
            return of(error);
          })
        )
        .subscribe();
    } else {
      let errorMsg = 'Fields do not have valid data!!!';
      this.showError(errorMsg);
      return of(new Error(errorMsg));
    }
  }

  getTransaction(monthRange: MonthRange): Observable<any> {
    return this.http.post(
      `${this.environment.baseUrl}${this.environment.servlet_endpoint.getTransaction}`,
      monthRange
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
}
