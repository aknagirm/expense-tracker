import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDetailsComponent } from './core/add-details/add-details.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegistrationComponent } from './core/auth/registration/registration.component';
import { AuthGuard } from './core/services/auth.guard';
import { TransactionDetailsComponent } from './core/transaction-details/transaction-details.component';
import { ViewAnalysisComponent } from './core/view-analysis/view-analysis.component';

const routes: Routes = [
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'addTransaction',
    component: AddDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'viewAnalysis',
    component: ViewAnalysisComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'viewTransactionDetails',
    component: TransactionDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
