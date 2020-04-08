import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { InlineSVGModule } from 'ng-inline-svg';
import { AccountSettingComponent } from './account-setting.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


const routes: Routes = [
    {
        path: '',
        component: AccountSettingComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatIconModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        InlineSVGModule,
        RouterModule.forChild(routes)
    ],
    declarations: [AccountSettingComponent, ChangePasswordComponent],
    entryComponents: [ChangePasswordComponent]
})
export class AccountSettingModule { }
