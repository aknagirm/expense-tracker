import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SectionDetailsModel, TransDetails } from 'src/app/interfaces/model';
import { InputDetailsComponent } from '../Reusable/input-details/input-details.component';
import { TrackerDetailsService } from '../services/tracker-details.service';

@Component({
  selector: 'app-income-details-sections',
  templateUrl: './income-details-sections.component.html',
  styleUrls: ['./income-details-sections.component.scss'],
})
export class IncomeDetailsSectionsComponent implements OnInit {
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
          ? sectionList.filter((eachSection) => eachSection.cdInd == 'C')
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
      'C'
    );
  }
}
