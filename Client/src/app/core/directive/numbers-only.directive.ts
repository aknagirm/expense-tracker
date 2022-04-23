import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numberOnly]',
})
export class NumbersOnlyDirective {
  constructor(private _el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event) {
    console.log(event);
    const initialValue = this._el.nativeElement.value;
    let numbersOnlyValue = null;
    this._el.nativeElement.value = initialValue.replace(/[^0-9.]*/g, '');
    numbersOnlyValue = initialValue.replace(/[^0-9.]*/g, '');

    this.control.control.setValue(numbersOnlyValue);
    if (initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
