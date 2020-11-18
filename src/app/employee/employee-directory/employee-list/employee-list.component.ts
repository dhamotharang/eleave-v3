import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../../../src/services/shared-service/api.service';

/**
 * Employee List Page
 * @export
 * @class EmployeeListComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-employee-list',
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {

    /**
     * This local property is used to get user profile list from API
     * @type {*}
     * @memberof EmployeeListComponent
     */
    public items: any;

    /**
     * This local property is used to show types of arrow icon for name column
     * @type {boolean}
     * @memberof EmployeeListComponent
     */
    public arrowDownName: boolean = true;

    /**
     * This local property is used to show types of arrow icon for ID column
     * @type {boolean}
     * @memberof EmployeeListComponent
     */
    public arrowDownId: boolean = true;

    /**
     * This local property is used to get total number of user profile list
     * @type {number}
     * @memberof EmployeeListComponent
     */
    public totalItem: number;

    /**
     * This local property is used to show list view
     * @type {boolean}
     * @memberof EmployeeListComponent
     */
    public listView: boolean = true;

    /**
     * This local property is used to show grid view
     * @type {boolean}
     * @memberof EmployeeListComponent
     */
    public gridView: boolean = false;

    /**
     * This local property is used to show loading spinner
     * @type {boolean}
     * @memberof EmployeeListComponent
     */
    public showSpinner: boolean = true;

    /**
     * profile picture url
     * @type {*}
     * @memberof EmployeeListComponent
     */
    public url: any;

    /**
     * detect window size
     * @type {boolean}
     * @memberof EmployeeListComponent
     */
    public mobile: boolean;

    /**
     * page number of paginator
     * @type {number}
     * @memberof EmployeeListComponent
     */
    p: number;

    /**
     *Creates an instance of EmployeeListComponent.
     * @param {APIService} apiService
     * @memberof EmployeeListComponent
     */
    constructor(private apiService: APIService) {
        this.apiService.get_profile_pic('all').subscribe(img => this.url = img)
    }

    /**
     * Inital method
     * Get user profile list from API
     * Get department list from API
     * @memberof EmployeeListComponent
     */
    ngOnInit() {
        (window.innerWidth < 992) ? this.viewList(false) : this.viewList(true);
        this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.items = data;
                this.nameSorting(true, -1, 1);
                this.showSpinner = false;
            }
        );
    }

    /**
     * This method is used to show view list or grid list items
     * @param {boolean} showList
     * @memberof EmployeeListComponent
     */
    viewList(showList: boolean) {
        this.listView = showList;
        this.gridView = !showList;
    }

    /**
     * detect window resize event
     * @memberof EmployeeListComponent
     */
    onResize() {
        if (window.innerWidth < 576) {
            this.viewList(false);
        }
    }

    /**
     * This method is used to sort name column
     * @param {boolean} value
     * @param {number} checkAsc
     * @param {number} checkDes
     * @memberof EmployeeListComponent
     */
    nameSorting(value: boolean, checkAsc: number, checkDes: number) {
        this.arrowDownName = value;
        this.items = this.items.slice(0);
        this.items.sort(function (a: any, b: any) {
            const x = a.employeeName.toUpperCase();
            const y = b.employeeName.toUpperCase();
            return x < y ? checkAsc : x > y ? checkDes : 0;
        });
    }

    /**
     * This method is used to sort ID column
     * @param {boolean} value
     * @param {number} ascValue
     * @param {number} desValue
     * @memberof EmployeeListComponent
     */
    IDSorting(value: boolean, ascValue: number, desValue: number) {
        this.arrowDownId = value;
        this.items = this.items.slice(0);
        this.items.sort(function (x, y) {
            const a = x.staffNumber;
            const b = y.staffNumber;
            return a < b ? ascValue : a > b ? desValue : 0;
        });
    }

    /**
     * This method is used to filter employee name
     * @param {*} char
     * @memberof EmployeeListComponent
     */
    filterDetails(char: any) {
        if (char && char.trim() != '') {
            let name = this.items.filter((data: any) => {
                return (data.employeeName.toUpperCase().indexOf(char.toUpperCase()) > -1);
            })
            let id = this.items.filter((details: any) => {
                return (details.staffNumber.indexOf(char) > -1);
            })
            let department = this.items.filter((details: any) => {
                return (details.department.toUpperCase().indexOf(char.toUpperCase()) > -1);
            })
            let company = this.items.filter((list: any) => {
                if (list.companyName != null) {
                    return (list.companyName.toUpperCase().indexOf(char.toUpperCase()) > -1);
                }
            })
            this.items = require('lodash').uniqBy(name.concat(id).concat(department).concat(company), 'userId');
            this.showSpinner = false;
        }
    }

    /**
     * This method is used to get content after clear value from search bar
     * @memberof EmployeeListComponent
     */
    clearDetails() {
        this.apiService.get_user_profile_list().subscribe(
            (data: any[]) => {
                this.items = data;
                this.nameSorting(true, -1, 1);
                this.showSpinner = false;
            }
        );
    }

    /**
     * This method is used to determine the filter content when change occured
     * @param {*} text
     * @memberof EmployeeListComponent
     */
    changeDetails(text: any) {
        this.showSpinner = true;
        if (text.srcElement.value === '') {
            this.clearDetails();
        } else {
            this.filterDetails(text.srcElement.value);
        }
    }

}
