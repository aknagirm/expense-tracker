import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatCalendarView, MatDatepicker } from '@angular/material/datepicker';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs';
import { DateRangeModel } from 'src/app/interfaces/model';
import { AuthService } from '../../services/auth.service';
import { TrackerDetailsService } from '../../services/tracker-details.service';

type StartView = 'month' | 'year' | 'multi-year';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('monthPicker') monthPicker: MatDatepicker<Date>;

  endDate = new Date();
  monthSelectionMenuTrigger: MatMenuTrigger;
  title: string;
  monthRange: DateRangeModel[];
  currentNavigation: string;
  minDate: Date;
  maxDate: Date;
  startView: StartView = 'year';
  constructor(
    private router: Router,
    private trackerDetailsService: TrackerDetailsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    this.minDate = new Date(currentYear - 2, currentMonth - 1, 1);
    this.maxDate = new Date();
    this.router.events
      .pipe(
        map((event) => {
          if (event instanceof NavigationEnd) return event;
        })
      )
      .subscribe((event) => {
        if (event) {
          this.currentNavigation = event.url;
        }
      });
    this.trackerDetailsService
      .getDateRange()
      .subscribe((data: DateRangeModel[]) => {
        this.monthRange = data;
      });
    this.trackerDetailsService
      .getHeaderTitle()
      .subscribe((title) => (this.title = title));
  }

  monthRangeChange(newRange: number) {
    this.trackerDetailsService.setNewMonthRange(newRange);
  }

  logout() {
    this.authService.logOut();
  }

  viewAnalysisCheck() {
    this.router.navigate(['viewAnalysis']);
  }

  viewTransactionDetails() {
    this.router.navigate(['viewTransactionDetails']);
  }

  navigateToAddTransaction() {
    this.router.navigate(['addTransaction']);
  }

  monthSelected(event: Date) {
    this.monthPicker.close();
    this.trackerDetailsService.setNewMonthSelected(event);
  }
}
