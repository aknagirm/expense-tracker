import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { InputDetailsComponent } from './input-details/input-details.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { HeaderComponent } from './header/header.component';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModalComponent } from './common-modal/common-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NumbersOnlyDirective } from '../directive/numbers-only.directive';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
@NgModule({
  declarations: [
    InputDetailsComponent,
    SnackBarComponent,
    HeaderComponent,
    CommonModalComponent,
    NumbersOnlyDirective,
    LoadingScreenComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatRadioModule,
    PortalModule,
    MatDialogModule,
  ],
  exports: [
    CommonModalComponent,
    LoadingScreenComponent,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    InputDetailsComponent,
    NumbersOnlyDirective,
    HeaderComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    SnackBarComponent,
    MatMenuModule,
    MatRadioModule,
    MatDialogModule,
  ],
})
export class ReusableModule {}
