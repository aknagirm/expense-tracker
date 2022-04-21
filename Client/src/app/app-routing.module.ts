import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDetailsComponent } from './core/add-details/add-details.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegistrationComponent } from './core/auth/registration/registration.component';
import { TransactionDetailsComponent } from './core/transaction-details/transaction-details.component';
import { ViewAnalysisComponent } from './core/view-analysis/view-analysis.component';

const routes: Routes = [
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'addTransaction', component: AddDetailsComponent },
  { path: 'viewAnalysis', component: ViewAnalysisComponent },
  { path: 'viewTransactionDetails', component: TransactionDetailsComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
