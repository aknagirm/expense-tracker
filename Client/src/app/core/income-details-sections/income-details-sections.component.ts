import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import {
  SectionDetailsModel,
  SectionDetailsRespModel,
  TransDetails,
} from 'src/app/interfaces/model';
import { CommonModalComponent } from '../Reusable/common-modal/common-modal.component';
import { InputDetailsComponent } from '../Reusable/input-details/input-details.component';
import { TrackerDetailsService } from '../services/tracker-details.service';

@Component({
  selector: 'app-income-details-sections',
  templateUrl: './income-details-sections.component.html',
  styleUrls: ['./income-details-sections.component.scss'],
})
export class IncomeDetailsSectionsComponent implements OnInit {
  @ViewChildren('inputDetails')
  inputDetails: any;
  @ViewChildren('expansionPanel')
  expansionPanel: any;
  @ViewChildren('panelH') panelH: any;

  sectionList: SectionDetailsRespModel[];
  isExpanded = false;

  constructor(
    private trackerDetailsService: TrackerDetailsService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getTrackerDetails();
    this.trackerDetailsService
      .getSectionDetails()
      .subscribe((sectionList: SectionDetailsRespModel[]) => {
        this.sectionList = sectionList.length
          ? sectionList.filter((eachSection) => eachSection.cdInd == 'C')
          : [];
      });
  }

  getTrackerDetails() {
    this.trackerDetailsService.getIncomeDetailsSection();
  }

  saveTransaction(idx: number, inputSection: SectionDetailsModel) {
    const selectedInputDetailsComp = this.inputDetails._results[idx];
    this.trackerDetailsService
      .saveTransaction(selectedInputDetailsComp, inputSection, 'C')
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
