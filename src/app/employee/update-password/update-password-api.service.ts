import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { APIService } from '../../../../src/services/shared-service/api.service';

/**
 * All update password API
 * @export
 * @class UpdatePasswordApiService
 */
@Injectable({
    providedIn: 'root'
})
export class UpdatePasswordApiService {

    /**
     *Creates an instance of UpdatePasswordApiService.
     * @param {Http} http
     * @param {APIService} apiService
     * @memberof UpdatePasswordApiService
     */
    constructor(public http: Http, private apiService: APIService) {
    }

    /**
     * This method is used to update password for first time
     * @param {*} password
     * @returns {Observable<any>}
     * @memberof UpdatePasswordApiService
     */
    patch_invitation(password): Observable<any> {
        this.apiService.headerAuthorization();
        return this.apiService.patchApi(password, '/api/invitation');
    }

    /**
     * This method is used to accept invitation sent by admin
     * @param {*} token
     * @returns {Observable<any>}
     * @memberof UpdatePasswordApiService
     */
    get_invitation(token): Observable<any> {
        return this.apiService.getApiWithId('/api/invitation/', token);
    }
}