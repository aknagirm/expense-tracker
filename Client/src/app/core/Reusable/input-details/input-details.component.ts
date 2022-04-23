import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-input-details',
  templateUrl: './input-details.component.html',
  styleUrls: ['./input-details.component.scss'],
})
export class InputDetailsComponent implements OnInit {
  selectedDate = new Date();
  daysDiff = 'Today';
  noteText = '';
  incomeDetailsForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.incomeDetailsForm = this.fb.group({
      note: ['', Validators.required],
      transDate: [new Date(), Validators.required],
      transAmount: [{ value: '0', disabled: true }],
    });
    this.incomeDetailsForm.valueChanges.subscribe((data) => {
      console.log(this.incomeDetailsForm.controls.transAmount);
    });
  }

  changeDate(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    let today = new Date();
    this.selectedDate = event.value;
    this.incomeDetailsForm.get('transAmount').setValue(this.selectedDate);
    let days = Math.floor(
      (today.getTime() - this.selectedDate.getTime()) / 1000 / 60 / 60 / 24
    );
    console.log(this.selectedDate, days);
    if (days < 1) {
      this.daysDiff = 'Today';
    } else if (1 <= days && days < 2) {
      this.daysDiff = 'Yesterday';
    } else if (2 <= days && days <= 90) {
      this.daysDiff = `${days} days back`;
    } else {
      this.daysDiff = 'Long Back';
    }
    return days;
  }

  amountInputBtnClick(value: string | number) {
    let incomeAmountField: AbstractControl =
      this.incomeDetailsForm.get('transAmount');
    let incomeAmountCurrVal: string = incomeAmountField.value?.replace(
      /^0+/,
      ''
    );
    if (value == '*' || value == '+' || value == '/' || value == '-') {
      let evalVal = eval(incomeAmountCurrVal);
      incomeAmountField.setValue(`${evalVal ?? 0}${value}`);
    } else if (value == 'x') {
      incomeAmountField.setValue(
        incomeAmountCurrVal.substring(0, incomeAmountCurrVal.length - 1)
      );
    } else if (value == 'result') {
      let evalVal = eval(incomeAmountCurrVal);
      incomeAmountField.setValue(`${evalVal ?? 0}`);
    } else {
      incomeAmountField.setValue(`${incomeAmountCurrVal}${value}`);
    }
  }
}
