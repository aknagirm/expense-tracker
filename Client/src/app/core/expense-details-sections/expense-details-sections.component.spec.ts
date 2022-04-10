import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDetailsSectionsComponent } from './expense-details-sections.component';

describe('ExpenseDetailsSectionsComponent', () => {
  let component: ExpenseDetailsSectionsComponent;
  let fixture: ComponentFixture<ExpenseDetailsSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseDetailsSectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseDetailsSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
