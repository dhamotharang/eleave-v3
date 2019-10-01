import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';

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
    public baseUrl: string = "http://zencore.zen.com.my:3000";
    /**
     *Creates an instance of AuthService.
     * @param {Router} _router
     * @param {HttpClient} httpClient
     * @memberof AuthService
     */
    constructor(private _router: Router, private httpClient: HttpClient, public http: Http) { }

    /**
     * this is used to clear anything that needs to be removed
     */
    clear(): void {
        localStorage.clear();
    }

    /**
     * check for expiration and if token is still existing or not
     * @return {boolean}
     */
    isAuthenticated(): boolean {
        return localStorage.getItem('access_token') != null && !this.isTokenExpired();
    }

    // simulate jwt token is valid
    // https://github.com/theo4u/angular4-auth/blob/master/src/app/helpers/jwt-helper.ts
    /**
     * return false if token is expired
     * @returns {boolean}
     * @memberof AuthService
     */
    isTokenExpired(): boolean {
        return false;
    }

    // loginAdmin(): void {
    //     localStorage.setItem('access_token', `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1MzMyNzM5NjksImV4cCI6MTU2NDgxMDAwNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoiVGVzdCBHdWFyZCIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJyb2xlIjoiQWRtaW4ifQ.rEkg53_IeCLzGHlmaHTEO8KF5BNfl6NEJ8w-VEq2PkE`);

    //     this._router.navigate(['/dashboard']);
    // }

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
                    localStorage.setItem('access_token', JSON.stringify(user.access_token));
                }
                return user;
            }));
    }

    /**
     * return access token or vice versa
     * @readonly
     * @type {boolean}
     * @memberof AuthService
     */
    public get loggedIn(): boolean {
        return (localStorage.getItem('access_token') !== null);
    }

    /**
     * this is used to clear local storage and also the route to login
     */
    logout(): void {
        localStorage.removeItem('access_token');
    }

    /**
     * read access token
     * @returns
     * @memberof AuthService
     */
    decode() {
        return decode(localStorage.getItem('access_token'));
    }
}