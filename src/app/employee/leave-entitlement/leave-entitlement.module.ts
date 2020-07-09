import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { LeaveEntitlementsComponent } from './leave-entitlement.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatTabsModule } from '@angular/material/tabs';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { SpinnerModule } from '../../../../src/library/spinner/spinner.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { LeavePlanningComponent } from './leave-planning/leave-planning.component';
import { ApplyLeaveComponent } from './leave-planning/apply-leave/apply-leave.component';
import { CalendarViewComponent } from './leave-planning/calendar-view/calendar-view.component';
import { ApplyLeaveConfirmationComponent } from './leave-planning/apply-leave/apply-leave-confirmation/apply-leave-confirmation.component';
import { MatDialogModule } from '@angular/material';


const routes: Routes = [
  {
    path: '',
    component: LeaveEntitlementsComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InlineSVGModule,
    MatTabsModule,
    // BrowserModule,
    FullCalendarModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatRadioModule,
    SpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDialogModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ApplyLeaveConfirmationComponent],
  declarations: [LeaveEntitlementsComponent, LeavePlanningComponent, ApplyLeaveComponent, CalendarViewComponent, ApplyLeaveConfirmationComponent]
})
export class LeaveEntitlementModule { }
