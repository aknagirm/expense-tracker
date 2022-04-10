import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegistrationComponent } from "./registration/registration.component";
import { ReusableModule } from "../Reusable/reusable.module";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [LoginComponent, RegistrationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReusableModule,
    RouterModule,
  ],
  exports: [LoginComponent, RegistrationComponent],
})
export class AuthModule {}
