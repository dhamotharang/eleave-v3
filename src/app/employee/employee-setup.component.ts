export interface ISubSideMenu {
  /**
   * This is local interface property as title of menu
   * @type {string}
   * @memberof ISubSideMenu
   */
  title: string;

  /**
   * This is local interface property as url of menu
   * @type {string[]}
   * @memberof ISubSideMenu
   */
  url: string[];

  /**
   * This is local interface property as icon name of menu
   * @type {string}
   * @memberof ISubSideMenu
   */
  icon: string;
}

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { APIService } from '../../../src/services/shared-service/api.service';
import { filter } from 'rxjs/operators';
import { SharedService } from './shared.service';
import { RouteDialogComponent } from './route-dialog/route-dialog.component';

/**
 * Employee Setup Page
 * @export
 * @class EmployeeSetupComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-employee-setup',
  templateUrl: './employee-setup.component.html',
  styleUrls: ['./employee-setup.component.scss'],
})
export class EmployeeSetupComponent implements OnInit {
  /**
   * This is local property used to get the number of index in array of employee setup page
   * @type {number}
   * @memberof EmployeeSetupComponent
   */
  public numOfArray: number;

  /** 
   * This is local property used to get user ID from API
   * @type {string}
   * @memberof EmployeeSetupComponent
   */
  public userId: string;

  /**
   * This is local property used to get content from personal details API
   * @type {*}
   * @memberof EmployeeSetupComponent
   */
  public list: any;

  /**
   * This is local property used to get url 
   * @type {string}
   * @memberof EmployeeSetupComponent
   */
  public url: string;

  /**
   * Thid is local property used to get last segment of url
   * @type {string}
   * @memberof EmployeeSetupComponent
   */
  public lastSegment: string;

  /**
     * toggle mode on off value
     * @type {string}
     * @memberof EmployeeSetupComponent
     */
  public emittedValue: string;

  /**
   * This is local property used to set menu title, path routing & icon name
   * @type {ISubSideMenu[]}
   * @memberof EmployeeSetupComponent
   */
  public employeeSetupPage: ISubSideMenu[] = [
    {
      title: 'Personal Details',
      url: ['/main/profile/personal-details'],
      icon: 'icon_user@3x.png',
    },
    {
      title: 'Employment Details',
      url: ['/main/profile/employment-details', this.userId],
      icon: 'icon_org_profile@3x.png',
    },
    {
      title: 'Leave Entitlement',
      url: ['/main/profile/leave-entitlement'],
      icon: 'icon_calendar@3x.png',
    },
    {
      title: 'Awards & Certification',
      url: ['/main/profile/awards-certification'],
      icon: 'icon_users_roles@3x.png',
    },
    {
      title: 'Account Settings',
      url: ['/main/profile/account'],
      icon: 'icon_setting@3x.png',
    }
  ];

  /**
   * return value from API content 
   * @readonly
   * @memberof EmployeeSetupComponent
   */
  get personalList() {
    return this.list;
  }

  /**
   *Creates an instance of EmployeeSetupComponent.
   * @param {APIService} apiService
   * @param {Router} router
   * @param {SharedService} _sharedService
   * @memberof EmployeeSetupComponent
   */
  constructor(private apiService: APIService, private router: Router, private _sharedService: SharedService) {
    router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.url = e.urlAfterRedirects;
        this.checkUrl(this.url);
      });

    _sharedService.changeEmitted$.subscribe(
      text => {
        this.emittedValue = text;
      });
  }

  /**
   * Initial method
   * Get personal details API content
   * @memberof EmployeeSetupComponent
   */
  ngOnInit() {
    this.apiService.get_personal_details().subscribe(data => {
      this.userId = data.id;
      this.list = data;
      this.employeeSetupPage[1].url = ['/main/profile/employment-details', this.userId];
    });
    this.checkUrl(this.router.url);
  }

  /**
   * This method is used to check clicked current url
   * @param {string} url
   * @memberof EmployeeSetupComponent
   */
  checkUrl(url: string) {
    const splitUrl = url.split('/');
    this.lastSegment = splitUrl.pop();
    const joinSplitUrl = splitUrl.join('/');
    if (joinSplitUrl === '/main/profile/employment-details') {
      this.getIndexToShowArrow(1);
    } else {
      for (let i = 0; i < this.employeeSetupPage.length; i++) {
        if (this.employeeSetupPage[i].url.includes(url)) {
          this.getIndexToShowArrow(i);
        }
      }
    }
  }

  /**
   * This method is used to get the current url to show arrow icon
   * @param {number} index
   * @memberof EmployeeSetupComponent
   */
  getIndexToShowArrow(index: number) {
    if (this.emittedValue == 'OFF' || this.emittedValue == null) {
      this.numOfArray = index;
      if (this.employeeSetupPage[index].url && index !== 1) {
        this.router.navigate(this.employeeSetupPage[index].url);
      } else {
        if (this.userId === undefined) {
          this.employeeSetupPage[1].url = ['/main/profile/employment-details', this.lastSegment];
          this.router.navigate(this.employeeSetupPage[index].url);
        }
        this.router.navigate(this.employeeSetupPage[index].url);
      }
    } else {
      this._sharedService.dialog.open(RouteDialogComponent, {
        width: "283px",
        height: "194px",
        panelClass: 'custom-dialog-container'
      });
    }


  }

}
