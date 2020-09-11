import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../../src/services/shared-service/api.service';
import { ActivatedRoute } from '@angular/router';
import { EditModeDialogComponent } from '../edit-mode-dialog/edit-mode-dialog.component';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { SnackbarNotificationComponent } from '../snackbar-notification/snackbar-notification.component';
import { SharedService } from '../shared.service';
const dayjs = require('dayjs');

/**
 * Employment Details Page
 * @export
 * @class EmploymentDetailsComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-employment-details',
    templateUrl: './employment-details.component.html',
    styleUrls: ['./employment-details.component.scss'],
})
export class EmploymentDetailsComponent implements OnInit {

    /**
     * This local property is used to get employment details from API
     * @type {*}
     * @memberof EmploymentDetailsComponent
     */
    public list: any;

    /**
     * This local property is used to show progress header
     * @type {boolean}
     * @memberof EmploymentDetailsComponent
     */
    public showHeader: boolean = true;

    /**
     * This local property is used to show profile completeness %
     * @type {number}
     * @memberof EmploymentDetailsComponent
     */
    public progressPercentage: number;

    /**
     * This local property is used to get employment details from API
     * @type {string}
     * @memberof EmploymentDetailsComponent
     */
    public userId: string;

    /**
     * This local property is used to show or hide loading spinner 
     * @type {boolean}
     * @memberof EmploymentDetailsComponent
     */
    public showSpinner: boolean = true;

    /**
     * Local property to show or hide content during loading
     * @type {boolean}
     * @memberof EmploymentDetailsComponent
     */
    public showContent: boolean = false;

    /**
     * show edit profile 
     * @type {boolean}
     * @memberof EmploymentDetailsComponent
     */
    public showEditProfile: boolean = false;

    /**
     * toggle button value
     * @type {string}
     * @memberof EmploymentDetailsComponent
     */
    public modeValue: string = 'OFF';

    /**
     * personal details of this user
     * @type {*}
     * @memberof EmploymentDetailsComponent
     */
    public personalDetail: any;

    /**
     * url of profile picture
     * @type {*}
     * @memberof EmploymentDetailsComponent
     */
    public url: any;

    /**
     * all profile picture list
     * @type {*}
     * @memberof EmploymentDetailsComponent
     */
    public reportingUrl: any;

    public isBlur: boolean = false;

    /**
     * supervisor not found in profile picture list 
     * @type {boolean}
     * @memberof EmploymentDetailsComponent
     */
    public svNotFound: boolean;

    /**
     * return API content
     * @readonly
     * @memberof EmploymentDetailsComponent
     */
    get personalList() {
        return this.list;
    }

    /**
     *Creates an instance of EmploymentDetailsComponent.
     * @param {APIService} apiService
     * @param {ActivatedRoute} route
     * @param {ScrollToService} _scrollToService
     * @param {SharedService} sharedService
     * @memberof EmploymentDetailsComponent
     */
    constructor(private apiService: APIService, private route: ActivatedRoute, private _scrollToService: ScrollToService, private sharedService: SharedService) {
        route.params.subscribe(params => {
            this.userId = params.id;
        });
        this.apiService.get_profile_pic('personal').subscribe(img => this.url = img)
    }

    /**
     * Initial method
     * Get employment details content from API
     * @memberof EmploymentDetailsComponent
     */
    async ngOnInit() {
        let data = await this.apiService.get_employment_details(this.userId).toPromise();
        this.personalDetail = data;
        this.apiService.get_user_info_employment_details().subscribe(
            dataUserDtls => {
                this.list = dataUserDtls;
                this.showSpinner = false;
                this.showContent = true;
                this.apiService.get_profile_pic('all').subscribe(data => {
                    this.reportingUrl = data;
                })
            },
            error => {
                this.snackbarMsg(JSON.parse(error._body).status, false);
            }
        )
    }


    /**
     * toggle on/off of edit mode
     * @param {*} evt
     * @memberof PersonalDetailsComponent
     */
    mainToggle(evt) {
        if (evt.detail.checked === true) {
            this.modeValue = 'ON';
            this.apiService.matdialog.open(EditModeDialogComponent, {
                disableClose: true,
                data: 'employment',
                height: "225.3px",
                width: "383px",
                panelClass: 'custom-dialog-container'
            });
            const config: ScrollToConfigOptions = {
                target: 'destination'
            };
            this._scrollToService.scrollTo(config);
        } else {
            this.modeValue = 'OFF'
            if (this.isBlur === true) {
                this.patchEmployment();
            } else {
                this.snackbarMsg('Edit mode disabled. Good job!', true);
            }
        }
        this.sharedService.emitChange(this.modeValue);
    }

    /**
     * patch employment details
     * @memberof EmploymentDetailsComponent
     */
    async patchEmployment() {
        this.isBlur = false;
        const body = this.list.employmentDetail;
        body["id"] = this.list.id;
        body.employmentStatus = body.employmentStatus;
        body.epfNumber = body.epfNumber.toString();
        body.employeeId = body.employeeId.toString();
        body.incomeTaxNumber = body.incomeTaxNumber.toString();
        body.bankAccountNumber = body.bankAccountNumber.toString();
        if (body.dateOfConfirmation != '') {
            body.dateOfConfirmation = dayjs(body.dateOfConfirmation).format('YYYY-MM-DD');
        }
        if (body.dateOfJoin != '') {
            body.dateOfJoin = dayjs(body.dateOfJoin).format('YYYY-MM-DD');
        }
        if (body.dateOfResignation != '') {
            body.dateOfResignation = dayjs(body.dateOfResignation).format('YYYY-MM-DD');
        }
        let list = await this.apiService.get_user_profile_list().toPromise();
        list.filter(item => {
            if (item.employeeName === body.reportingTo) {
                body.reportingTo = item.userId;
            }
        })
        this.apiService.patch_user_info_employement_id(body, this.list.id).subscribe(res => {
            this.showEditProfile = false;
            this.snackbarMsg('Edit mode disabled. Good job!', true);
            this.apiService.get_user_profile_list().subscribe(data => {
                this.list.employmentDetail = res;
                data.filter(item => {
                    if (this.list.employmentDetail.reportingTo === item.userId) {
                        this.list.employmentDetail.reportingTo = item.employeeName
                    }
                })
            });
        },
            err => {
                this.snackbarMsg(JSON.parse(err._body).message[0].constraints.isNotEmpty, false);
            })
    }

    /**
     * Show notification after submit
     * @param {string} statement
     * @param {boolean} value
     * @memberof EmploymentDetailsComponent
     */
    snackbarMsg(statement: string, value: boolean) {
        this.apiService.snackbar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: statement, response: value }
        });
    }

}
