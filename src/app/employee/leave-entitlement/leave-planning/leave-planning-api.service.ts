import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIService } from '../../../../../src/services/shared-service/api.service';
import { MatSnackBar } from '@angular/material';
import { SnackbarNotificationComponent } from '../../snackbar-notification/snackbar-notification.component';

/**
 * All leave planning API
 * @export
 * @class LeavePlanningAPIService
 */
@Injectable({
    providedIn: 'root'
})
export class LeavePlanningAPIService {

    /**
     *Creates an instance of LeavePlanningAPIService.
     * @param {Http} http
     * @param {APIService} api
     * @param {MatSnackBar} snackBar
     * @memberof LeavePlanningAPIService
     */
    constructor(public http: Http, private api: APIService, public snackBar: MatSnackBar) {
    }

    /**
     * This method is used to submit leave application information
     * @param {*} leaveData
     * @returns {Observable<any>}
     * @memberof LeavePlanningAPIService
     */
    post_user_apply_leave(leaveData: any): Observable<any> {
        this.api.headerAuthorization();
        return this.http.post(this.api.baseUrl + '/api/leave/apply', leaveData, { headers: this.api.headers })
            .pipe(map((res: Response) => res.json()));
    }

    /**
     * To get personal calendar holiday details
     * @param {string} id
     * @param {number} year
     * @returns {Observable<any>}
     * @memberof LeavePlanningAPIService
     */
    get_personal_holiday_calendar(id: string, year: number): Observable<any> {
        return this.http.get(this.api.baseUrl + '/api/admin/holiday/calendar-profile/days/' + id + '/' + year, { headers: this.api.headers })
            .pipe(map((response: Response) => response.json()))
    }

    /**
     * get all employee onleave list
     * @returns {Observable<any>}
     * @memberof LeavePlanningAPIService
     */
    get_calendar_onleave_list(value?: any): Observable<any> {
        return this.http.get(this.api.baseUrl + '/api/employee/calendar-leave-list', { params: value, headers: this.api.headers })
            .pipe(map((response: Response) => response.json()))
    }

    /**
     * get requested user's entitlement details
     * leave type, entitled day, balance, pending, taken
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof LeavePlanningAPIService
     */
    get_entilement_details(): Observable<any> {
        this.api.headerAuthorization();
        return this.api.getApi('/api/leave-entitlement');
    }

    /**
     * get leave entitlement policy (to check PH & rest day allow or not)
     * @param {*} id
     * @returns {Observable<any>}
     * @memberof LeavePlanningAPIService
     */
    get_leavetype_entitlement_id(id): Observable<any> {
        this.api.headerAuthorization();
        return this.api.getApiWithId('/api/leavetype-entitlement/', id);
    }

    /**
     * Show message of pass or fail after post data
     * @param {string} message
     * @memberof LeavePlanningAPIService
     */
    openSnackBar(message: string, val: boolean) {
        this.snackBar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: message, response: val }
        });
    }
}