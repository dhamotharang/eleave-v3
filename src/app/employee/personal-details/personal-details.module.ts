import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PersonalDetailsComponent } from './personal-details.component';
import { MatCardModule } from '@angular/material/card';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SpinnerModule } from '../../../../src/library/spinner/spinner.module';
import { EditModeDialogComponent } from '../edit-mode-dialog/edit-mode-dialog.component';
import { SnackbarNotificationComponent } from '../snackbar-notification/snackbar-notification.component';


const routes: Routes = [
  {
    path: '',
    component: PersonalDetailsComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatCardModule,
    InlineSVGModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    SpinnerModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  declarations: [PersonalDetailsComponent, EditModeDialogComponent, SnackbarNotificationComponent],
  entryComponents: [EditModeDialogComponent, SnackbarNotificationComponent]
})
export class PersonalDetailsModule { }
