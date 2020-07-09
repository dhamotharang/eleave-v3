import { Injectable } from '@angular/core';
import { APIService } from '../../../src/services/shared-service/api.service';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { SnackbarNotificationComponent } from '../employee/snackbar-notification/snackbar-notification.component';
import { MatDialog } from '@angular/material';

/**
 * ALl API for dashboard page
 * @export
 * @class DashboardApiService
 */
@Injectable({
    providedIn: 'root'
})
export class DashboardApiService {

    /**
     *Creates an instance of DashboardApiService.
     * @param {APIService} apiService get main api service
     * @param {Http} http
     * @param {MatDialog} dialog get pop up dialog
     * @memberof DashboardApiService
     */
    constructor(public apiService: APIService, public http: Http, public dialog: MatDialog) {
    }

    /**
     * To get employee onleave status
     * Number of total employee
     * Number of employee onleave
     * @param {*} param
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    // get_status_onleave(param): Observable<any> {
    //     this.apiService.headerAuthorization();
    //     return this.http.get(this.apiService.baseUrl + '/api/employee/status-onleave', { params: param, headers: this.apiService.headers })
    //         .pipe(map((res: Response) => res.json()))
    // }

    /**
     * To get employee onleave details
     * Name of employee 
     * Designation of employee
     * @param {*} value
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    // get_onleave_list(value): Observable<any> {
    //     this.apiService.headerAuthorization();
    //     return this.http.get(this.apiService.baseUrl + '/api/employee/leave-list', { params: value, headers: this.apiService.headers })
    //         .pipe(map((response: Response) => response.json()))
    // }

    /**
     * get self leave application status
     * @param {string} id
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    get_user_application_status(id: string): Observable<any> {
        return this.apiService.getApiWithId('/api/admin/approval-override/', id);
    }

    /**
     * get all announcement created from admin
     * @returns
     * @memberof DashboardApiService
     */
    get_announcement_list() {
        return this.apiService.getApi('/api/admin/announcement');
    }

    /**
     * get upcoming holidays from today date
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    get_upcoming_holidays(): Observable<any> {
        return this.apiService.getApi('/api/employee/upcoming-holiday');
    }

    /**
     * get details of birthday
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    get_birthday_details(): Observable<any> {
        return this.apiService.getApi('/api/employee/date-of-birth');
    }

    /**
     * get long leave (>5 days) details
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    get_long_leave_reminder(): Observable<any> {
        return this.apiService.getApi('/api/employee/long-leave/employee');
    }

    /**
     * get annual leave balance
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    get_annual_leave(): Observable<any> {
        return this.apiService.getApi('/api/employee/dashboard-annual-leave');
    }

    /**
     * get medical leave balance
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    get_medical_leave(): Observable<any> {
        return this.apiService.getApi('/api/employee/dashboard-medical-leave');
    }

    /**
     * get replacement leave balance
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    get_replacement_leave(): Observable<any> {
        return this.apiService.getApi('/api/employee/dashboard-replacement-leave');
    }

    /**
     * get simple RL balance 
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    get_simple_RL(): Observable<any> {
        return this.apiService.getApi('/api/employee/RL/simple');
    }


    /**
     * get detailed RL balance 
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    get_detailed_RL(): Observable<any> {
        return this.apiService.getApi('/api/employee/RL/detailed');
    }

    /**
     * get dashboard task to be done
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    get_task_list(): Observable<any> {
        return this.apiService.getApi('/api/employee/dashboard-my-task');
    }

    /**
     * user/superior approve/reject/cancel task leave from dashboard
     * @returns {Observable<any>}
     * @memberof DashboardApiService
     */
    post_application_status(leaveTransactionGUID, status: string): Observable<any> {
        return this.http.post(this.apiService.baseUrl + '/api/leave/' + status, leaveTransactionGUID, { headers: this.apiService.headers })
            .pipe(map((response: Response) => response.text()))
    }

    /**
     * Show notification after submit
     * @param {string} msg
     * @param {boolean} value
     * @memberof DashboardApiService
     */
    popUpDialog(msg: string, value: boolean) {
        this.apiService.snackbar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: msg, response: value }
        });
    }


}