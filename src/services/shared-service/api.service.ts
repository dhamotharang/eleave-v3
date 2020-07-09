import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'angular-web-storage';
import { AuthService } from './auth.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';

/**
 * Store all API used in employee folder
 * @export
 * @class APIService
 */
@Injectable({
    providedIn: 'root'
})
export class APIService {

    /**
     * headers for application
     * @memberof APIService
     */
    public headers = new Headers();

    /**
     * main server URL
     * @type {string}
     * @memberof APIService
     */
    public baseUrl: string = environment.API_URL;

    /**
     *Creates an instance of APIService.
     * @param {Http} http
     * @memberof APIService
     */
    constructor(public http: Http, public local: LocalStorageService, private auth: AuthService, public matdialog: MatDialog, public snackbar: MatSnackBar) {
    }

    /**
     * This method is used to pass authorize token to header
     * @memberof APIService
     */
    headerAuthorization() {
        if (this.headers["_headers"].size != 1 && this.auth.isAuthenticated) {
            this.headers.append('Authorization', 'JWT ' + JSON.parse(this.local.get('access_token')));
        }
    }

    /**
     * This method is used to get endpoint with specific path
     * @param {string} address
     * @returns
     * @memberof APIService
     */
    getApi(address: string) {
        return this.http.get(this.baseUrl + address, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * This method is used to get endpoint with specific path & guid
     * @param {string} address
     * @param {string} guid
     * @returns
     * @memberof APIService
     */
    getApiWithId(address: string, guid: string) {
        return this.http.get(this.baseUrl + address + guid, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * This method is used to patch endpoint with specific path
     * @param {*} patchData
     * @param {string} url
     * @returns
     * @memberof APIService
     */
    patchApi(patchData: any, url: string) {
        return this.http.patch(this.baseUrl + url, patchData, { headers: this.headers })
            .pipe(map((res: Response) => res.json()))
    }

    /**
     * This method is used to post endpoint with specific path and body data
     * @param {*} data
     * @param {string} address
     * @returns
     * @memberof APIService
     */
    postApi(data: any, address: string) {
        return this.http.post(this.baseUrl + address, data, { headers: this.headers })
            .pipe(map((res: Response) => res.json()
            ));
    }

    /**
     * This method is used to get personal details endpoint
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_personal_details(): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/api/userprofile/personal-detail');
    }

    /**
     * This method is used to get personal details endpoint with id of requested user
     * @param {*} guid
     * @returns {Observable<any>}
     * @memberof APIService
     */
    // get_user_personal_details(guid): Observable<any> {
    //     return this.getApiWithId('/api/userprofile/personal-detail/', guid);
    // }

    /**
     * This method is used to get employment details
     * @param {*} userId
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_employment_details(userId): Observable<any> {
        return this.getApiWithId('/api/userprofile/employment-detail/', userId);
    }


    /**
     * This method is used to get employment details based on user info
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_user_info_employment_details(): Observable<any> {
        return this.getApi('/api/admin/user-info-details/employment-detail');
    }

    /**
     * patch user info personal-details
     * @param {*} data
     * @param {string} id
     * @returns {Observable<any>}
     * @memberof APIService
     */
    patch_user_info_personal_id(data: any, id: string): Observable<any> {
        return this.patchApi(data, '/api/admin/user-info-details/personal/' + id);
    }

    /**
     * update employement details 
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof APIService
     */
    patch_user_info_employement_id(data, userId: string): Observable<any> {
        return this.patchApi(data, '/api/admin/user-info-details/employment/' + userId);
    }

    /**
     * This method is used to get user profile information
     * Personal, employment, leave entitlement, education details
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_user_profile(): Observable<any> {
        // this.headerAuthorization();
        return this.getApi('/api/userprofile');
    }

    /**
     * This method is used to get all users basic information
     * Id, userId, staffNumber, employeeName, designation, email
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_user_profile_list(): Observable<any> {
        // this.headerAuthorization();
        return this.getApi('/api/users/employee');
    }

    /**
     * This method is used to get user profile information of requested GUID
     * @param {*} guid
     * @returns {Observable<any>}
     * @memberof APIService
     */
    // get_user_profile_details(guid): Observable<any> {
    //     this.headerAuthorization();
    //     return this.http.get(this.baseUrl + '/api/userprofile/' + guid, { headers: this.headers })
    //         .pipe(map((res: Response) => res.json()));
    // }

    /**
     * This method is used to get any desired item
     * department, designation, section, branch, bank, costcentre, country
     * @returns {Observable<any>}
     * @memberof APIService
     */
    // get_master_list(item): Observable<any> {
    //     // this.headerAuthorization();
    //     return this.getApiWithId('/api/admin/master/', item);
    // }

    /**
     * upload file to azure
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof APIService
     */
    post_file(data): Observable<any> {
        this.headerAuthorization();
        return this.postApi(data, '/api/azure/upload');
    }

    /**
     * get profile picture 
     * @param {string} type
     * @returns {Observable<any>}
     * @memberof APIService
     */
    get_profile_pic(type: string): Observable<any> {
        this.headerAuthorization();
        return this.getApi('/api/profile-picture/' + type);
    }


}
