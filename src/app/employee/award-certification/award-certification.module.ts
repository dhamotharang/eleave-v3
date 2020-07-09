import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SpinnerModule } from '../../../../src/library/spinner/spinner.module';
import { AwardCertificationComponent } from './award-certification.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';



const routes: Routes = [
    {
        path: '',
        component: AwardCertificationComponent,
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
        PdfViewerModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
    declarations: [AwardCertificationComponent]
})
export class AwardCertificationModule { }
