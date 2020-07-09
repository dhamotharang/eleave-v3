import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { PersonalDetailsModule } from './personal-details/personal-details.module';
import { EmploymentDetailsModule } from './employment-details/employment-details.module';
import { LeaveEntitlementModule } from './leave-entitlement/leave-entitlement.module';
import { EmployeeDirectoryModule } from './employee-directory/employee-directory.module';
import { AuthGuard } from '../../../src/services/shared-service/guards/auth-guard.service';
import { EmployeeSetupComponent } from './employee-setup.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { AccountSettingModule } from './account-setting/account-setting.module';
import { PersonalDetailsService } from './personal-details/personal-details.service';
import { AwardCertificationModule } from './award-certification/award-certification.module';
import { MatSelectModule } from '@angular/material/select';

const routes: Routes = [
  {
    path: '',
    component: EmployeeSetupComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    PersonalDetailsModule,
    EmploymentDetailsModule,
    LeaveEntitlementModule,
    EmployeeDirectoryModule,
    AccountSettingModule,
    AwardCertificationModule,
    MatSelectModule,
    InlineSVGModule,
    RouterModule.forChild(routes)
  ],
  providers: [AuthGuard, PersonalDetailsService],
  declarations: [EmployeeSetupComponent]
})
export class EmployeeSetupPageModule {
}
