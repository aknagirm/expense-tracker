import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddDetailsComponent } from "./core/add-details/add-details.component";
import { LoginComponent } from "./core/auth/login/login.component";
import { RegistrationComponent } from "./core/auth/registration/registration.component";

const routes: Routes = [
  { path: "registration", component: RegistrationComponent },
  { path: "login", component: LoginComponent },
  { path: "transactionDetails", component: AddDetailsComponent },
  { path: "", redirectTo: "/login", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
