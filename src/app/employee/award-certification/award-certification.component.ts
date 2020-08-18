import { Component, OnInit } from "@angular/core";
import { APIService } from "../../../../src/services/shared-service/api.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { EditModeDialogComponent } from "../edit-mode-dialog/edit-mode-dialog.component";
import { SharedService } from "../shared.service";
import { SnackbarNotificationComponent } from "../snackbar-notification/snackbar-notification.component";

/**
 * award & certificate page
 * @export
 * @class AwardCertificationComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-award-certification',
    templateUrl: './award-certification.component.html',
    styleUrls: ['./award-certification.component.scss'],
})
export class AwardCertificationComponent implements OnInit {

    /**
     * show/hide content before loading complete
     * @type {boolean}
     * @memberof AwardCertificationComponent
     */
    public showContent: boolean = false;

    /**
     * data of personal details from API
     * @type {*}
     * @memberof AwardCertificationComponent
     */
    public items: any;

    /**
     * awards details
     * @type {*}
     * @memberof AwardCertificationComponent
     */
    public awards: any = [];

    /**
     * Local property to show or hide edit profile
     * @type {boolean}
     * @memberof AwardCertificationComponent
     */
    public showEditProfile: boolean = false;

    /**
     * employment details from logged user
     * @memberof AwardCertificationComponent
     */
    public employDetails;

    /** 
     * show loading spinner during waiting requested data
     * @type {boolean}
     * @memberof AwardCertificationComponent
     */
    public showSpinner: boolean = false;

    /**
     * object of form field awards
     * @memberof AwardCertificationComponent
     */
    public awardObj = { certificationName: '', certificationEnrollYear: '', certificationGraduateYear: '', certificationAttachment: '' };

    /**
    * toggle button value
    * @type {string}
    * @memberof EmploymentDetailsComponent
    */
    public toggleValue: string = 'OFF';

    /**
     * url from profile picture
     * @type {*}
     * @memberof AwardCertificationComponent
     */
    public url: any;

    public isBlur: boolean = false;

    /**
     * validation group of file
     * @private
     * @type {FormGroup}
     * @memberof AwardCertificationComponent
     */
    private _fileform: FormGroup;

    /**
     * return personal details from API
     * @readonly
     * @memberof AwardCertificationComponent
     */
    get personalList() {
        return this.items;
    }

    /**
     *Creates an instance of AwardCertificationComponent.
     * @param {APIService} apiService
     * @param {FormBuilder} fb
     * @param {SharedService} sharedService
     * @memberof AwardCertificationComponent
     */
    constructor(private apiService: APIService, private fb: FormBuilder, private sharedService: SharedService
    ) {
        this.apiService.get_profile_pic('personal').subscribe(img => this.url = img)
    }

    ngOnInit() {
        this.showSpinner = true;
        this.apiService.get_personal_details().subscribe(
            (data: any[]) => {
                this.items = data;
                this.showSpinner = false;
                this.apiService.get_user_info_employment_details().subscribe(
                    dataUserDtls => {
                        this.employDetails = dataUserDtls;
                    }
                )
                this.showContent = true;
                const award = this.items.personalDetail.certification;
                if (award != undefined) {
                    if (award instanceof Array) {
                        this.awards = award;
                    } else {
                        this.awards.push(award);
                    }
                } else {
                    this.awards = [];
                }
            });

        this._fileform = this.fb.group({
            file: ''
        });
    }

    /**
     * toggle on/off of edit mode
     * @param {*} evt
     * @memberof PersonalDetailsComponent
     */
    mainToggle(evt) {
        if (evt.detail.checked === true) {
            this.toggleValue = 'ON';
            this.apiService.matdialog.open(EditModeDialogComponent, {
                disableClose: true,
                data: 'certificate',
                height: "225.3px",
                width: "383px",
                panelClass: 'custom-dialog-container'
            });
        } else {
            this.toggleValue = 'OFF'
            if (this.isBlur === true) {
                this.updateCertificate();
            } else {
                this.msgNotification('Edit mode disabled. Good job!', true);
            }
        }
        this.sharedService.emitChange(this.toggleValue);
    }

    /**
     * get details of file after upload from local file
     * @param {*} files
     * @param {number} i
     * @returns
     * @memberof AwardCertificationComponent
     */
    preview(file: any, i: number) {
        const fileToUpload = file.item(0);
        let formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        this.apiService.post_file(formData).subscribe(res => {
            this.awards[i].certificationAttachment = res.filename;
        });
    }

    /**
     * upload awards & certification details to API
     * @param {number} [index]
     * @memberof AwardCertificationComponent
     */
    updateCertificate(index?: number) {
        this.isBlur = false;
        const body = this.items.personalDetail;
        body['id'] = this.items.id;
        body.nric = this.items.personalDetail.nric.toString();
        body.gender = this.items.personalDetail.gender;
        body.maritalStatus = this.items.personalDetail.maritalStatus;
        body.postcode = Number(this.items.personalDetail.postcode);
        if (body.certification != undefined) {
            body.certification = this.awards;
        } else {
            body['certification'] = {};
            body['certification'] = this.awards;
        }
        this.getPatchedValue(body);
    }

    /**
     * get back patched value
     * @param {*} body
     * @memberof AwardCertificationComponent
     */
    getPatchedValue(body: any) {
        this.apiService.patch_user_info_personal_id(body, this.items.id).subscribe(response => {
            this.items.personalDetail = response;
            this.msgNotification('Edit mode disabled. Good job!', true);
        },
            response => {
                this.msgNotification(JSON.parse(response._body).message[0].constraints.isNotEmpty, false);
            })
    }

    /**
     * add new form field
     * @param {*} details
     * @param {Object} item
     * @memberof AwardCertificationComponent
     */
    addInput(details: any, item: Object) {
        if (details !== undefined) {
            details.push(item);
            this.awardObject(details, item);
        } else {
            details = [];
            details.push(item);
            this.awardObject(details, item);
        }
    }

    /**
     * This method is used to get object format   
     * @param {*} list
     * @param {*} obj
     * @memberof PersonalDetailsPage
     */
    awardObject(list, obj) {
        if (obj === this.awardObj) { this.awards = list; }
    }


    /**
     * delete unwanted items
     * @param {number} i
     * @param {*} awards
     * @memberof AwardCertificationComponent
     */
    deleteItem(i: number, awards: any) {
        this.awards.splice(i, 1);
    }

    /**
     * Show notification after submit
     * @param {string} statement
     * @param {boolean} value
     * @memberof EmploymentDetailsComponent
     */
    msgNotification(statement: string, value: boolean) {
        this.apiService.snackbar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: statement, response: value }
        });
    }
}