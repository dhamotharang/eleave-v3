import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';

@Component({
    selector: 'app-employee-profile',
    templateUrl: './employee-profile.page.html',
    styleUrls: ['./employee-profile.page.scss'],
})
export class EmployeeProfilePage implements OnInit {

    public list: any;
    public userId: string;
    public employmentlist: any;
    public setAsFavourite = [];
    public numOfArray: boolean = false;

    get personalList() {
        return this.list;
    }
    get employmentPersonalList() {
        return this.employmentlist;
    }

    constructor(private apiService: APIService) {
    }

    ngOnInit() {
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.list = data;
                this.userId = this.list.id;
                console.log(this.list);
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
        setTimeout(() => {
            // const userId = this.list.id;
            this.apiService.get_employment_details(this.userId).subscribe(
                data => {
                    this.employmentlist = data;
                    console.log('employ:', this.employmentlist);
                }
            )
        }, 1000);
    }

    clickAsFavourite() {
        if (this.numOfArray) {
            this.numOfArray = false;
        } else {
            this.numOfArray = true;
        }
    };

}
