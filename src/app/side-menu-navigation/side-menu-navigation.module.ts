import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';

import { IonicModule } from '@ionic/angular';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { AuthGuard } from '../../../src/services/shared-service/guards/auth-guard.service';
import { sideMenuNavigationRoutes } from './side-menu-navigation.routes';
import { EmployeeSetupPageModule } from '../../../src/app/employee/employee-setup.module';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { UpdatePasswordModule } from '../employee/update-password/update-password.module';
import { EmailInvitationModule } from '../employee/email-invitation/email-invitation.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { SharedService } from '../employee/shared.service';
import { RouteDialogComponent } from '../employee/route-dialog/route-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InlineSVGModule.forRoot(),
    // HttpClientModule,
    EmployeeSetupPageModule,
    MatMenuModule,
    UpdatePasswordModule,
    EmailInvitationModule,
    DashboardModule,
    RouterModule.forChild(sideMenuNavigationRoutes)
  ],
  entryComponents: [RouteDialogComponent],
  providers: [AuthGuard, SharedService],
  declarations: [SideMenuNavigationComponent, RouteDialogComponent]
})
export class SideMenuNavigationModule { }

