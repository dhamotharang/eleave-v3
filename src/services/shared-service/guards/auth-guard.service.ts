import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../src/services/shared-service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  /**
   *Creates an instance of AuthGuard.
   * @param {AuthService} _authService
   * @param {Router} _router
   * @memberof AuthGuard
   */
  constructor(private _authService: AuthService, private _router: Router) {
  }

  /**
   * determine the route is it active
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof AuthGuard
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this._authService.isAuthenticated()) {
      return true;
    }
    alert('Your session has expired. Please login to continue your last access page.');
    // Store the attempted URL for redirecting
    this._authService.redirectUrl = url;

    // Navigate to the login page with extras
    this._router.navigate([''], {
      queryParams: {
        returnUrl: this._authService.redirectUrl
      }
    });
    this._authService.logout();
    return false;
  }

}