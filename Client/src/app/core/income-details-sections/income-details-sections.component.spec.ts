import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeDetailsSectionsComponent } from './income-details-sections.component';

describe('IncomeDetailsSectionsComponent', () => {
  let component: IncomeDetailsSectionsComponent;
  let fixture: ComponentFixture<IncomeDetailsSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeDetailsSectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeDetailsSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
