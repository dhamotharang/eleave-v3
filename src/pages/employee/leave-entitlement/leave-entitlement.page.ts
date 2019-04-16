import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-leave-entitlement',
    templateUrl: './leave-entitlement.page.html',
    styleUrls: ['./leave-entitlement.page.scss'],
})
export class LeaveEntitlementPage implements OnInit {

    public personalDataList: any;
    public showHeader: boolean = true;
    public progressPercentage: number = 80;
    public arrowDown: boolean = true;
    public entitlement: any;
    public leaveType: string;
    public leaveBalance: string;

    public get sortDirectionArrowDown(): boolean {
        return this.arrowDown;
    }
    public get personalList() {
        return this.personalDataList;
    }

    constructor(private apiService: APIService, private router: Router
    ) { }

    ngOnInit() {
        this.apiService.get_user_profile().subscribe(
            (data: any[]) => {
                this.personalDataList = data;
                this.entitlement = this.personalDataList.entitlementDetail;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            }
        );
    }

    clickToHideHeader() {
        this.showHeader = false;
    }

    toPlanLeave(leaveType: string, leaveBalance: string, leaveId: string) {
        this.router.navigate(['/main/plan-my-leave'], { queryParams: { type: leaveType, balance: leaveBalance, id: leaveId } });
        this.leaveType = leaveType;
        this.leaveBalance = leaveBalance;
    }

    sortAscLeaveType() {
        this.arrowDown = true;
        this.entitlement = this.entitlement.slice(0);
        this.entitlement.sort(function (a, b) {
            var x = a.leaveTypeName.toLowerCase();
            var y = b.leaveTypeName.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
    }

    sortDesLeaveType() {
        this.arrowDown = false;
        this.entitlement = this.entitlement.slice(0);
        this.entitlement.sort(function (a, b) {
            var x = a.leaveTypeName.toLowerCase();
            var y = b.leaveTypeName.toLowerCase();
            return x < y ? 1 : x > y ? -1 : 0;
        });
    }
}



