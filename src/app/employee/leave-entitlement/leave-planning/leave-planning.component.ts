import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../../../src/services/shared-service/api.service';
import { Router } from '@angular/router';
import { LeavePlanningAPIService } from './leave-planning-api.service';

/**
 * Leave Planning Page
 * @export
 * @class LeavePlanningComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-leave-planning',
    templateUrl: './leave-planning.component.html',
    styleUrls: ['./leave-planning.component.scss'],
})
export class LeavePlanningComponent implements OnInit {

    /**
     * This local property is used to get personal details from API
     * @type {*}
     * @memberof LeavePlanningComponent
     */
    public list: any;

    /**
     * get entitlement details
     * @type {*}
     * @memberof LeavePlanningComponent
     */
    public entitlementDetails: any;

    /**
     * get user employment details
     * @type {*}
     * @memberof LeavePlanningComponent
     */
    public employment: any;

    /**
     * This local property is used to show or hide spinner
     * @type {boolean}
     * @memberof LeavePlanningComponent
     */
    public showSpinner: boolean = true;

    /**
     * get url of profile picture
     * @type {*}
     * @memberof LeavePlanningComponent
     */
    public url: any

    /**
     *Creates an instance of LeavePlanningComponent.
     * @param {APIService} API
     * @param {Router} router
     * @memberof LeavePlanningComponent
     */
    constructor(private API: APIService, private leaveApi: LeavePlanningAPIService, private router: Router
    ) {
        this.API.get_profile_pic('personal').subscribe(img => this.url = img)
    }

    /**
     * Initial method
     * Get personal details from API
     * @memberof LeavePlanningComponent
     */
    ngOnInit() {
        this.API.get_user_profile().subscribe(
            (list: any[]) => {
                this.showSpinner = false;
                this.list = list;
            });
        this.leaveApi.get_entilement_details().subscribe(list => {
            this.entitlementDetails = list;
        })
        this.API.get_user_info_employment_details().subscribe(details => this.employment = details)
    }

    /**
     * This method is used to route to the personal leave entitlement page
     * @memberof LeavePlanningComponent
     */
    backToProfile() {
        this.router.navigate(['/main/profile/leave-entitlement']);
    }
}