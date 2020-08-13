export interface ISideMenu {
  /**
   * This is local interface property as title of menu
   * @type {string}
   * @memberof ISideMenu
   */
  title: string;

  /**
   * This is local interface property as url of menu
   * @type {string}
   * @memberof ISideMenu
   */
  url: string;

  /**
   * This is local interface property as icon of menu
   * @type {string}
   * @memberof ISideMenu
   */
  icon: string;
}

import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { APIService } from '../../../src/services/shared-service/api.service';
import { SharedService } from '../employee/shared.service';
import { RouteDialogComponent } from '../employee/route-dialog/route-dialog.component';
import { filter } from 'rxjs/operators';
/**
 * Side Menu Navigation Component
 * @export
 * @class SideMenuNavigationComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-side-menu-navigation',
  templateUrl: './side-menu-navigation.component.html',
  styleUrls: ['./side-menu-navigation.component.scss']
})
export class SideMenuNavigationComponent implements OnInit {
  /**
   * This is local property to show full menu
   * @type {boolean}
   * @memberof SideMenuNavigationComponent
   */
  public showFullMenu: boolean = true;

  /**
   * This is local property to small icon menu
   * @type {boolean}
   * @memberof SideMenuNavigationComponent
   */
  public showIconMenu: boolean = false;

  /**
   * This is local property to determine active route after clicked on menu
   * @type {*}
   * @memberof SideMenuNavigationComponent
   */
  public activeRoute: any;

  /**
   * This is local property to get personal details from API endpoint
   * @type {*}
   * @memberof SideMenuNavigationComponent
   */
  public list: any;

  /**
  * emitted toggle value
  * @type {string}
  * @memberof SideMenuNavigationComponent
  */
  public emittedData: string;

  /**
   * get profile picture
   * @type {*}
   * @memberof SideMenuNavigationComponent
   */
  public url: any;

  public image: string = "assets/icon/beesuite.png";

  public imageName:string;

  /**
   * show admin profile navigation on dropdown menu
   * @type {boolean}
   * @memberof SideMenuNavigationComponent
   */
  public showAdmin: string;

  /**
   * This is local property to show list of menu, url & icon name
   * @type {ISideMenu[]}
   * @memberof SideMenuNavigationComponent
   */
  public appPages: ISideMenu[] = [
    {
      title: 'Dashboard',
      url: '/main/dashboard',
      icon: 'icon_dashboard@3x.png'
    },
    {
      title: 'Profile',
      url: '/main/profile',
      icon: 'icon_customers@3x.png'
    },
    {
      title: 'Plan My Leave',
      url: '/main/plan-my-leave',
      icon: 'icon_calendar@3x.png'
    },
    {
      title: 'Employee',
      url: '/main/employee-directory',
      icon: 'icon_persons@3x.png'
    }
  ];

  /** 
   * This method used to get return value from property list
   * @readonly
   * @type {*}
   * @memberof SideMenuNavigationComponent
   */
  get personalList(): any {
    return this.list;
  }

  /**
   * This method used to get return value from property showFullMenu
   * @readonly
   * @type {boolean}
   * @memberof SideMenuNavigationComponent
   */
  get displayFullMenu(): boolean {
    return this.showFullMenu;
  }

  /**
   * This method used to get return value from property showIconMenu
   * @readonly
   * @type {boolean}
   * @memberof SideMenuNavigationComponent
   */
  get displayIconMenu(): boolean {
    return this.showIconMenu;
  }

  /**
   *Creates an instance of SideMenuNavigationComponent.
   * @param {MenuController} menu
   * @param {Router} router
   * @param {APIService} apiService
   * @memberof SideMenuNavigationComponent
   */
  constructor(private menu: MenuController, public router: Router,
    private apiService: APIService, private sharedService: SharedService
  ) {
    this.imageName = this.image.substring(this.image.lastIndexOf('/') + 1).split('.')[0];
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.getRoute(event.urlAfterRedirects);
        this.apiService.get_profile_pic('personal').subscribe(data => {
          this.url = data;
        })
      });

    sharedService.changeEmitted$.subscribe(
      data => {
        this.emittedData = data;
      });
  }

  /**
   * This method used to get initial value from personal details API json data
   * Open full menu
   * Get active route
   * @memberof SideMenuNavigationComponent
   */
  ngOnInit() {
    this.showAdmin = localStorage.getItem('view_admin');
    this.getRoute(this.router.url);
    this.openAtBeginning();
    this.apiService.get_personal_details().subscribe(data => {
      // this.userId = data.id;
      this.list = data;
    });
  }

  /**
  * get route to highlight active route
  * @param {*} URL
  * @memberof SideMenuNavigationComponent
  */
  getRoute(URL) {
    if (URL.split("/").length == 4) {
      const url = URL.split('/');
      const lastSegment = url.pop();
      this.activeRoute = url.join('/');
    } if (URL.split("/").length == 5) {
      const url = URL.split('/');
      const lastSegment = url.pop();
      const last = url.pop();
      this.activeRoute = url.join('/');
    } if (URL.split("/").length < 4 || URL.split("/").length > 5) {
      this.activeRoute = URL;
    }
  }

  /**
   * show active route highlight in menu 
   * @param {string} currentRoute
   * @memberof SideMenuNavigationComponent
   */
  activeUrl(currentRoute: string) {
    if (this.emittedData == 'OFF' || this.emittedData == null) {
      this.router.navigate([currentRoute]);
      this.activeRoute = currentRoute;
    } else {
      this.sharedService.dialog.open(RouteDialogComponent, {
        width: "283px",
        height: "194px",
        panelClass: 'custom-dialog-container'
      });
    }
  }

  /**
   * This method used to open full menu
   * @memberof SideMenuNavigationComponent
   */
  openAtBeginning() {
    if (this.displayFullMenu === true) {
      this.expandMenu();
      this.menu.open('first');
      this.onResize();
    }
  }

  /**
   * This method used to collapse full menu and expand icon menu
   * @memberof SideMenuNavigationComponent
   */
  collapseMenu() {
    this.showFullMenu = false;
    this.showIconMenu = true;
    this.menu.enable(false, 'first');
    this.menu.close('first');
    this.menu.enable(true, 'custom');
    setTimeout(() => {
      this.menu.open('custom');
    }, 10);
  }

  /**
   * This method used to expand full menu and collapse icon menu
   * @memberof SideMenuNavigationComponent
   */
  expandMenu() {
    this.showFullMenu = true;
    this.showIconMenu = false;
    this.menu.enable(true, 'first');
    this.menu.enable(false, 'custom');
    this.menu.close('custom');
    setTimeout(() => {
      this.menu.open('first');
    }, 10);
  }

  /**
   * This method is used to open full menu
   * @memberof SideMenuNavigationComponent
   */
  fullMenuClosedHandler() {
    this.menu.open('first');
  }

  /**
   * This method is used to open icon menu
   * @memberof SideMenuNavigationComponent
   */
  iconMenuClosedHandler() {
    this.menu.open('custom');
  }

  /**
   * This method is used to route to Login page after clicked logout button
   * @param {*} event
   * @memberof SideMenuNavigationComponent
   */
  logout(event) {
    // window.location.href = '/login';
    this.router.navigate(['/']);
    localStorage.clear();
  }

  /**
   * This method is used to check window inner width. Once the width < 992px,
   * it will collapse side menu nav bar
   * @memberof SideMenuNavigationComponent
   */
  onResize() {
    if (window.innerWidth < 992) {
      this.collapseMenu();
    }
  }
}
