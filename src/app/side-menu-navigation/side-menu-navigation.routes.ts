import { Routes } from '@angular/router';
import { AuthGuard } from '../../../src/services/shared-service/guards/auth-guard.service';
import { SideMenuNavigationComponent } from './side-menu-navigation.component';
import { EmployeeSetupComponent } from '../employee/employee-setup.component';
import { PageNotFoundComponent } from '../page-not-found.component';
import { PersonalDetailsComponent } from '../employee/personal-details/personal-details.component';
import { AccountSettingComponent } from '../employee/account-setting/account-setting.component';
import { LeavePlanningComponent } from '../employee/leave-entitlement/leave-planning/leave-planning.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AwardCertificationComponent } from '../employee/award-certification/award-certification.component';
import { EmployeeListComponent } from '../employee/employee-directory/employee-list/employee-list.component';
import { EmployeeDirectoryComponent } from '../employee/employee-directory/employee-directory.component';
import { LeaveEntitlementsComponent } from '../employee/leave-entitlement/leave-entitlement.component';
import { EmploymentDetailsComponent } from '../employee/employment-details/employment-details.component';

export const sideMenuNavigationRoutes: Routes = [
    {
        path: 'main',
        component: SideMenuNavigationComponent,
        canActivate: [AuthGuard],
        children: [
            // { path: '', redirectTo: 'dash', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'plan-my-leave', component: LeavePlanningComponent },
            {
                path: 'employee-directory', component: EmployeeDirectoryComponent,
                children: [
                    { path: '', redirectTo: 'list', pathMatch: 'full' },
                    { path: 'list', component: EmployeeListComponent }
                ]
            },
            {
                path: 'profile', component: EmployeeSetupComponent,
                children: [
                    { path: '', redirectTo: 'personal-details', pathMatch: 'full' },
                    { path: 'personal-details', component: PersonalDetailsComponent },
                    { path: 'employment-details/:id', component: EmploymentDetailsComponent },
                    { path: 'leave-entitlement', component: LeaveEntitlementsComponent },
                    { path: 'awards-certification', component: AwardCertificationComponent },
                    { path: 'account', component: AccountSettingComponent }
                ]
            }
        ]
    },
    {
        path: 'tryadmin',
        loadChildren: () => import('../../../../eLeave_admin-V3/src/app/app.module').then(m => m.App2SharedModule)
    }

];

