import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../../src/services/shared-service/api.service';
import { AccountSettingAPIService } from './account-setting-api.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthService } from '../../../../src/services/shared-service/auth.service';
import { SnackbarNotificationComponent } from '../snackbar-notification/snackbar-notification.component';

/**
 * Account Setting Page
 * @export
 * @class AccountSettingComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-account-setting',
    templateUrl: './account-setting.component.html',
    styleUrls: ['./account-setting.component.scss'],
})
export class AccountSettingComponent implements OnInit {

    /**
     * url of profile picture
     * @type {string}
     * @memberof AccountSettingComponent
     */
    public url: any;

    /**
     * get login type to show/hide change password 
     * @type {string}
     * @memberof AccountSettingComponent
     */
    public loginType: string;

    /**
     * get user data
     * @private
     * @type {*}
     * @memberof AccountSettingComponent
     */
    private userData: any;

    /**
     * email from session storage
     * @private
     * @type {string}
     * @memberof AccountSettingComponent
     */
    private _email: string;

    /**
     *Creates an instance of AccountSettingComponent.
     * @param {APIService} api
     * @param {AccountSettingAPIService} accountApi
     * @memberof AccountSettingComponent
     */
    constructor(private api: APIService, private accountApi: AccountSettingAPIService, private _auth: AuthService) {
        this.api.get_profile_pic('personal').subscribe(data => {
            this.url = data;
        })
    }

    /**
     * Initial method
     * @memberof AccountSettingComponent
     */
    ngOnInit() {
        this.api.get_user_profile().subscribe(data => this.userData = data);
        this._email = this._auth.session.get('email');
        this.loginType = this._auth.local.get('loginType');
    }

    /**
     * open dialog of change password
     * @memberof AccountSettingComponent
     */
    changePass() {
        const dialog = this.api.matdialog.open(ChangePasswordComponent, {
            disableClose: true,
            data: 'personal',
            height: "340px",
            width: "360px",
            panelClass: 'custom-dialog-container'
        });
        dialog.afterClosed().subscribe(data => {
            if (data !== undefined) {
                this.accountApi.post_change_password({
                    "loginId": this._email,
                    "password": window.btoa(data.confirmPass),
                    "oldPassword": window.btoa(data.currentPass)
                }).subscribe(
                    result => { this.notify(result.message, true) },
                    response => {
                        this.notify(JSON.parse(response._body).status, false);
                    })
            }
        })
    }

    /**
     * change profile picture 
     * @param {*} file
     * @memberof AccountSettingComponent
     */
    submitProfilePic(file: any) {
        const fileToUpload = file.item(0);
        let formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        this.api.post_file(formData).subscribe(res => {
            const data = { "userGuid": this.userData.userId, "profilePictureFile": res.filename };
            this.accountApi.post_profile_pic(data).subscribe(response => {
                this.api.get_profile_pic('personal').subscribe(data => {
                    this.url = data;
                })
            })
        });
    }

    /**
     * Show notification after submit
     * @param {string} statement
     * @param {boolean} validation
     * @memberof AccountSettingComponent
     */
    notify(statement: string, validation: boolean) {
        this.api.snackbar.openFromComponent(SnackbarNotificationComponent, {
            duration: 5000,
            verticalPosition: "top",
            data: { message: statement, response: validation }
        });
    }
}