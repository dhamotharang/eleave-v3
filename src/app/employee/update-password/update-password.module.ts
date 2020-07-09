import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { InlineSVGModule } from 'ng-inline-svg';
import { SpinnerModule } from '../../../../src/library/spinner/spinner.module';
import { UpdatePasswordComponent } from './update-password.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';


const routes: Routes = [
    {
        path: '',
        component: UpdatePasswordComponent,
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        InlineSVGModule,
        SpinnerModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
    declarations: [UpdatePasswordComponent]
})
export class UpdatePasswordModule { }
