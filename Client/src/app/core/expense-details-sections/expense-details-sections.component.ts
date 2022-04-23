import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import {
  AlertObjectModel,
  SectionDetailsModel,
  TransDetails,
} from 'src/app/interfaces/model';
import { CommonModalComponent } from '../Reusable/common-modal/common-modal.component';
import { InputDetailsComponent } from '../Reusable/input-details/input-details.component';
import { TrackerDetailsService } from '../services/tracker-details.service';

@Component({
  selector: 'app-expense-details-sections',
  templateUrl: './expense-details-sections.component.html',
  styleUrls: ['./expense-details-sections.component.scss'],
})
export class ExpenseDetailsSectionsComponent implements OnInit {
  @ViewChildren('inputDetails')
  inputDetails: any;
  @ViewChildren('expansionPanel')
  expansionPanel: any;
  @ViewChildren('panelH') panelH: any;
  sectionList: SectionDetailsModel[];
  isOpen = false;

  constructor(
    public dialog: MatDialog,
    private trackerDetailsService: TrackerDetailsService
  ) {}

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

  saveTransaction(idx: number, inputSection: SectionDetailsModel) {
    const selectedInputDetailsComp = this.inputDetails._results[idx];
    this.trackerDetailsService
      .saveTransaction(selectedInputDetailsComp, inputSection, 'D')
      .subscribe((data) => {
        if (!(data instanceof Error)) {
          this.accordionToogle(idx);
        }
      });
  }

  toggleAccordion(index: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    let dirtyComponent = undefined;
    this.inputDetails._results.forEach((eachComp: InputDetailsComponent) => {
      if (eachComp.incomeDetailsForm?.dirty) {
        dirtyComponent = eachComp;
        return;
      }
    });
    if (dirtyComponent) {
      const confMsg = 'Changes will be lost. Do you want to proceed?';
      const dialogRef = this.dialog.open(CommonModalComponent, {
        data: confMsg,
      });
      dialogRef.afterClosed().subscribe((confirmation: boolean) => {
        if (confirmation) {
          dirtyComponent.incomeDetailsForm.reset();
          this.accordionToogle(index);
        }
      });
    } else {
      this.accordionToogle(index);
    }
  }

  accordionToogle(index: number) {
    this.expansionPanel.forEach(
      (eachAccordion: MatExpansionPanel, idx: number) => {
        if (idx === index) {
          eachAccordion.expanded ? eachAccordion.close() : eachAccordion.open();
        } else {
          eachAccordion.close();
        }
      }
    );
  }
}
