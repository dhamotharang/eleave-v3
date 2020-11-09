import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'angular-web-storage';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

/**
 * authenticate service
 * @export
 * @class AuthService
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    /**
     * main url of server
     * @type {string}
     * @memberof AuthService
     */
    public baseUrl: string = environment.API_URL;

    public redirectUrl: string;


    /**
     *Creates an instance of AuthService.
     * @param {SessionStorageService} session
     * @param {LocalStorageService} local
     * @param {HttpClient} httpClient
     * @memberof AuthService
     */
    constructor(private router: Router, public session: SessionStorageService, public local: LocalStorageService, private httpClient: HttpClient) { }

    /**
     * this is used to clear anything that needs to be removed
     */
    clear(): void {
        this.local.clear();
    }

    /**
     * check for expiration and if token is still existing or not
     * @return {boolean}
     */
    isAuthenticated(): boolean {
        return this.local.get('timer') != null && this.local.get('timer') > Date.now();
    }

    /**
     * login to post to endpoint
     * @param {string} email
     * @param {string} password
     * @returns
     * @memberof AuthService
     */
    login(email: string, password: string) {
        return this.httpClient.post<any>(this.baseUrl + `/api/auth/login`, { email, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    this.local.set('access_token', JSON.stringify(user.access_token));
                    this.local.set('loginType', user.login_type);
                    this.local.set('timer', Date.now() + (user.expires_in * 1000));
                    if (this.redirectUrl) {
                        this.router.navigate([this.redirectUrl]);
                        this.redirectUrl = null;
                    } else {
                        this.router.navigate(['main']);
                    }
                    setTimeout(() => {
                        alert('Your session has expired. Please login to continue your last access page.');
                        this.redirectUrl = this.router.url;
                        this.router.navigate([''], {
                            queryParams: {
                                returnUrl: this.redirectUrl
                            }
                        });
                        this.logout();
                    }, user.expires_in * 1000);
                }
                return user;
            }));
    }

    /**
     * this is used to clear local storage and also the route to login
     */
    logout(): void {
        this.local.clear();
    }
}