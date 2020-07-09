import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from '../../../../src/services/shared-service/api.service';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

/**
 * account setting api
 * @export
 * @class AccountSettingAPIService
 */
@Injectable({
    providedIn: 'root'
})
export class AccountSettingAPIService {

    /**
     *Creates an instance of AccountSettingAPIService.
     * @param {APIService} api
     * @memberof AccountSettingAPIService
     */
    constructor(private api: APIService, public http: Http) {
    }

    /**
     * post profile picture name
     * @returns {Observable<any>}
     * @memberof AccountSettingAPIService
     */
    post_profile_pic(data): Observable<any> {
        this.api.headerAuthorization();
        return this.api.postApi(data, '/api/profile-picture');
    }

    /**
     * change password for local database only
     * NOT SUPPORTED FOR AD
     * @param {*} value
     * @returns {Observable<any>}
     * @memberof AccountSettingAPIService
     */
    post_change_password(value): Observable<any> {
        this.api.headerAuthorization();
        return this.api.postApi(value, '/api/change-password/execute');
    }


}