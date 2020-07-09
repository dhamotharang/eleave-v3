import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmploymentDetailsComponent } from './employment-details.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { SpinnerModule } from '../../../../src/library/spinner/spinner.module';
import { MatInputModule } from '@angular/material';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';


const routes: Routes = [
    {
        path: '',
        component: EmploymentDetailsComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        InlineSVGModule,
        SpinnerModule,
        ScrollToModule.forRoot(),
        RouterModule.forChild(routes)
    ],
    declarations: [EmploymentDetailsComponent]
})
export class EmploymentDetailsModule { }
