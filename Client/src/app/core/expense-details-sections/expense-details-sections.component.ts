import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertObjectModel,
  SectionDetailsModel,
  TransDetails,
} from 'src/app/interfaces/model';
import { InputDetailsComponent } from '../Reusable/input-details/input-details.component';
import { TrackerDetailsService } from '../services/tracker-details.service';

@Component({
  selector: 'app-expense-details-sections',
  templateUrl: './expense-details-sections.component.html',
  styleUrls: ['./expense-details-sections.component.scss'],
})
export class ExpenseDetailsSectionsComponent implements OnInit {
  @ViewChild('inputDetails', { static: false })
  inputDetails: InputDetailsComponent;
  sectionList: SectionDetailsModel[];
  isOpen = false;

  constructor(private trackerDetailsService: TrackerDetailsService) {}

  ngOnInit() {
    this.getTrackerDetails();
    this.trackerDetailsService
      .getSectionDetails()
      .subscribe((sectionList: SectionDetailsModel[]) => {
        console.log(sectionList);
        this.sectionList = sectionList.length
          ? sectionList.filter((eachSection) => eachSection.cdInd == 'D')
          : [];
      });
  }

  getTrackerDetails() {
    this.trackerDetailsService.getIncomeDetailsSection();
  }

  saveTransaction(inputSection: SectionDetailsModel) {
    this.trackerDetailsService.saveTransaction(
      this.inputDetails,
      inputSection,
      'D'
    );
  }
}
