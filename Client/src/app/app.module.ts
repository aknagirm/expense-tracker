import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { AddDetailsComponent } from './core/add-details/add-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IncomeDetailsSectionsComponent } from './core/income-details-sections/income-details-sections.component';
import { ReusableModule } from './core/Reusable/reusable.module';
import { AuthModule } from './core/auth/auth.module';
import { interceptorProviders } from './interceptor/interceptor';
import { ExpenseDetailsSectionsComponent } from './core/expense-details-sections/expense-details-sections.component';
import { ViewAnalysisComponent } from './core/view-analysis/view-analysis.component';
import { TransactionDetailsComponent } from './core/transaction-details/transaction-details.component';

@NgModule({
  declarations: [
    AppComponent,
    AddDetailsComponent,
    IncomeDetailsSectionsComponent,
    ExpenseDetailsSectionsComponent,
    ViewAnalysisComponent,
    TransactionDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TableModule,
    ReusableModule,
    AuthModule,
  ],
  providers: [DatePipe, interceptorProviders],

  bootstrap: [AppComponent],
})
export class AppModule {}
