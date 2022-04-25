import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loader$ = new BehaviorSubject<boolean>(false);
  reqCount = 0;

  constructor() {}

  getLoaderStatus(): Observable<boolean> {
    return this.loader$.asObservable();
  }

  startLoader() {
    if (++this.reqCount == 1) {
      this.loader$.next(true);
    }
  }

  stopLoader() {
    if (this.reqCount == 0 || --this.reqCount == 0) {
      this.loader$.next(false);
    }
  }

  resetLoader() {
    this.reqCount = 0;
    this.loader$.next(false);
  }
}
