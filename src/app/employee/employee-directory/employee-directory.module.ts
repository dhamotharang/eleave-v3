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
import { SpinnerModule } from '../../../../src/library/spinner/spinner.module';
import { EmployeeDirectoryComponent } from './employee-directory.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
    {
        path: '',
        component: EmployeeDirectoryComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatPaginatorModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatIconModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        InlineSVGModule,
        SpinnerModule,
        NgxPaginationModule,
        RouterModule.forChild(routes)
    ],
    declarations: [EmployeeDirectoryComponent, EmployeeListComponent]
})
export class EmployeeDirectoryModule { }
