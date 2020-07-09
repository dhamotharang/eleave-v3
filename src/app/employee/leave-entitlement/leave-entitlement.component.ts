import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../../src/services/shared-service/api.service';
import { Router } from '@angular/router';
import { LeavePlanningAPIService } from './leave-planning/leave-planning-api.service';
/**
 * Leave Entitlement Page
 * @export
 * @class LeaveEntitlementsComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-leave-entitlement',
    templateUrl: './leave-entitlement.component.html',
    styleUrls: ['./leave-entitlement.component.scss'],
})
export class LeaveEntitlementsComponent implements OnInit {
    /**
     * This is local property used to get user profile list from API
     * @type {*}
     * @memberof LeaveEntitlementsComponent
     */
    public personalDataList: any;

    /**
     * This is local property used to get user details from API
     * @memberof LeaveEntitlementsComponent
     */
    public employeeDetails;

    /**
     * This is local property used to show header profile completeness
     * @type {boolean}
     * @memberof LeaveEntitlementsComponent
     */
    public showHeader: boolean = true;

    /**
     * This is local property used to get the entitlement details from API
     * @type {*}
     * @memberof LeaveEntitlementsComponent
     */
    public entitlement: any;

    /**
     * This is local property used to get leave types
     * @type {string}
     * @memberof LeaveEntitlementsComponent
     */
    public leaveType: string;

    /**
     * This is local property used to get leave balances
     * @type {string}
     * @memberof LeaveEntitlementsComponent
     */
    public leaveBalance: string;

    /**
     * This is local property used to show loading spinner
     * @type {boolean}
     * @memberof LeaveEntitlementsComponent
     */
    public showSpinner: boolean = true;

    /**
   * Local property to show or hide content during loading
   * @type {boolean}
   * @memberof LeaveEntitlementsComponent
   */
    public showContent: boolean = false;

    /**
     * url of profile picture
     * @type {*}
     * @memberof LeaveEntitlementsComponent
     */
    public url: any;

    /**
     * Return API content
     * @readonly
     * @memberof LeaveEntitlementsComponent
     */
    public get personalList() {
        return this.personalDataList;
    }

    /**
     *Creates an instance of LeaveEntitlementsComponent.
     * @param {APIService} apiService
     * @param {Router} router
     * @memberof LeaveEntitlementsComponent
     */
    constructor(private apiService: APIService, private apiLeave: LeavePlanningAPIService, private router: Router
    ) {
        // xservice.percentChanged.subscribe(value => {
        //     this.progressPercentage = value;
        // })
        this.apiService.get_profile_pic('personal').subscribe(img => this.url = img)
    }

    /**
     * Initial method
     * Get user profile details from API
     * @memberof LeaveEntitlementsComponent
     */
    ngOnInit() {
        this.apiService.get_user_profile().subscribe(
            (data: any[]) => {
                this.personalDataList = data;
                this.showSpinner = false;
                this.showContent = true;
            });

        this.apiService.get_user_info_employment_details().subscribe(
            dataUserDtls => {
                this.employeeDetails = dataUserDtls;
            }
        )
        this.apiLeave.get_entilement_details().subscribe(data => {
            this.entitlement = data;
        })
    }


    /**
     * This method is used to route to apply leave menu with query parameters (leave type, leave balance)
     * @param {string} leaveType
     * @param {string} leaveBalance
     * @param {string} leaveId
     * @memberof LeaveEntitlementsComponent
     */
    toPlanLeave(leaveType: string, leaveBalance: string, leaveId: string) {
        this.router.navigate(['/main/plan-my-leave'], { queryParams: { type: leaveType, balance: leaveBalance, id: leaveId } });
        this.leaveType = leaveType;
        this.leaveBalance = leaveBalance;
    }
}



