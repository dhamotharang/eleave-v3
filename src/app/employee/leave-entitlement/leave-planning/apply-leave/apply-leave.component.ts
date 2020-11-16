import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../../../../src/services/shared-service/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { LeavePlanningAPIService } from '../leave-planning-api.service';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../../src/app/employee/date.adapter';
import { ApplyLeaveConfirmationComponent } from './apply-leave-confirmation/apply-leave-confirmation.component';
const dayjs = require('dayjs');
/**
 * Apply Leave Page
 * @export
 * @class ApplyLeaveComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-apply-leave',
    templateUrl: './apply-leave.component.html',
    styleUrls: ['./apply-leave.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class ApplyLeaveComponent implements OnInit {
    /**
     * Local property for leave entitlement details
     * @type {*}
     * @memberof ApplyLeaveComponent
     */
    public entitlement: any;

    /**
     * Get calendar id from user profile API & request data from calendar API
     * @type {string}
     * @memberof CalendarViewPage
     */
    public calendarId: string;

    /**
     * Local property for leave day available
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    public daysAvailable: number = 0;

    /**
     * Local property for leave day applied
     * @type {number}
     * @memberof ApplyLeaveComponent
     */
    public daysCount: number = 0;

    /**
     * Local property for min. date range
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    public minDate: string;

    /**
     * Local property for max. date range
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    public maxDate: string;

    /**
     * Local property for leave form group
     * @type {FormGroup}
     * @memberof ApplyLeaveComponent
     */
    public applyLeaveForm: any;

    /**
     * Local property for leave type ID
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    public leaveTypeId: string;

    /**
    * date range selected
    * @type {*}
    * @memberof ApplyLeaveComponent
    */
    public dateSelection: any;

    /**
     * am/pm button value
     * @type {boolean[]}
     * @memberof ApplyLeaveComponent
     */
    public amButton: boolean[] = [];

    /**
     * Q1 button clicked or not
     * @type {boolean}
     * @memberof ApplyLeaveComponent
     */
    public Q1Button: boolean[] = [];

    /**
     * Q2 button clicked or not
     * @type {boolean[]}
     * @memberof ApplyLeaveComponent
     */
    public Q2Button: boolean[] = [];

    /**
     * Q3 button clicked or not
     * @type {boolean[]}
     * @memberof ApplyLeaveComponent
     */
    public Q3Button: boolean[] = [];

    /**
     * Q4 button clicked or not
     * @type {boolean[]}
     * @memberof ApplyLeaveComponent
     */
    public Q4Button: boolean[] = [];

    /**
     * day name value of each set
     * '0' = full day
     * '1' = half day
     * '2' = quarter day
     * @type {string[]}
     * @memberof ApplyLeaveComponent
     */
    public dayName: string[] = [];

    /**
     * half day value (am/pm)
     * @private
     * @type {*}
     * @memberof ApplyLeaveComponent
     */
    private _slot: any = [];

    /**
     * index of half day in dayName array
     * @type {number[]}
     * @memberof ApplyLeaveComponent
     */
    public halfDayIndex: number[] = [];

    /**
     * index of quarter day in dayName array
     * @type {number[]}
     * @memberof ApplyLeaveComponent
     */
    public quarterDayIndex: number[] = [];

    /**
     * selected leave type name
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    public leaveCode: string;

    /**
     * uploaded file
     * @type {*}
     * @memberof ApplyLeaveComponent
     */
    public uploadedFile: any;

    /**
     * allow to attach certification or not according policy
     * @type {*}
     * @memberof ApplyLeaveComponent
     */
    public allowCertification: boolean = true;

    /**
     * allow half day & quarter day 
     * @type {boolean}
     * @memberof ApplyLeaveComponent
     */
    public allowHalfQuarDay: boolean = true;

    public allowShortNotice: boolean = false;

    public makeAsEmergency: boolean = false;

    public emergency: boolean = false;

    /**
     * Local private property for value get from API
     * @private
     * @type {*}
     * @memberof ApplyLeaveComponent
     */
    private _userList: any;

    /**
     * Local private property to get number of day from a week
     * eg: sunday-saturday is 0-6
     * @private
     * @type {number}
     * @memberof ApplyLeaveComponent
     */
    private _weekDayNumber: number[] = [];
    /**
     * Local private property for selected date array list
     * @private
     * @type {*}
     * @memberof ApplyLeaveComponent
     */
    private _dateArray: any;

    /**
     * holiday date of this user (according calendar profile)
     * @private
     * @type {*}
     * @memberof ApplyLeaveComponent
     */
    private _holiday: any = [];

    /**
     * Local private property for start date
     * @private
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    private _reformatDateFrom: string;

    /**
     * Local private property for end date
     * @private
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    private _reformatDateTo: string;

    /**
     * Date selected for 1st day types selection 
     * @private
     * @memberof ApplyLeaveComponent
     */
    private _firstForm = [];

    /**
     * Data collected from (_objSlot1, _objSlot2) POST to apply leave API
     * @private
     * @memberof ApplyLeaveComponent
     */
    private _arrayDateSlot = [];

    /**
     * Local property for selected quarter hour value
     * @type {string}
     * @memberof ApplyLeaveComponent
     */
    private _selectedQuarterHour: string[] = [];

    /**
     * show value of exclude PH
     * @private
     * @type {boolean}
     * @memberof ApplyLeaveComponent
     */
    private _isExcludePH: boolean;

    /**
     * show value of exclude rest day
     * @private
     * @type {boolean}
     * @memberof ApplyLeaveComponent
     */
    private _isExcludeRest: boolean;

    /**
     * selected entitlement setup data
     * @private
     * @type {*}
     * @memberof ApplyLeaveComponent
     */
    private _setupData: any;

    private _arrayShortNotice: any;

    /**
     * Creates an instance of ApplyLeaveComponent.
     * @param {APIService} apiService
     * @param {ActivatedRoute} route
     * @param {LeavePlanningAPIService} leaveAPI
     * @memberof ApplyLeaveComponent
     */
    constructor(private apiService: APIService, private route: ActivatedRoute, private leaveAPI: LeavePlanningAPIService) {
        this.applyLeaveForm = new FormGroup({
            leaveTypes: new FormControl('', Validators.required),
            firstPicker: new FormControl('', Validators.required),
            secondPicker: new FormControl('', Validators.required),
            inputReason: new FormControl('', Validators.required),
        });
        route.queryParams
            .subscribe(params => {
                this.applyLeaveForm.patchValue({
                    leaveTypes: params.type,
                });
                this.daysAvailable = params.balance;
                this.leaveTypeId = params.id;
            });
    }

    /**
     * Initial method
     * Get user profile list from API
     * @memberof ApplyLeaveComponent
     */
    async ngOnInit() {
        const dt = new Date();
        const yr = dt.getFullYear();
        let data = await this.apiService.get_user_profile().toPromise();
        this._userList = data;
        this.calendarId = this._userList.calendarId;
        this.leaveAPI.get_personal_holiday_calendar(this.calendarId, yr).subscribe(
            data => {
                for (let i = 0; i < data.rest.length; i++) {
                    const weekdays = new Array(
                        "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
                    );
                    this._weekDayNumber.push(weekdays.indexOf(data.rest[i].fullname));
                }
                for (let j = 0; j < data.holiday.length; j++) {
                    this._holiday.push(data.holiday[j].start);
                }
            }
        );
        this.leaveAPI.get_entilement_details().subscribe(list => {
            this.entitlement = list;
        })
    }

    /**
     * according entitlement policy to filter selected date range
     * @param {string} entitlementGUID
     * @memberof ApplyLeaveComponent
     */
    getPolicy(entitlementGUID: string) {
        this.leaveAPI.get_leavetype_entitlement_id(entitlementGUID).subscribe(data => {
            this._setupData = data;
            this._isExcludePH = data.PROPERTIES_XML.excludeDayType.isExcludeHoliday;
            this._isExcludeRest = data.PROPERTIES_XML.excludeDayType.isExcludeRestDay;
            this.allowCertification = data.PROPERTIES_XML.attachmentRequired;
            this.allowHalfQuarDay = data.PROPERTIES_XML.applyFractionUnit;
            this.allowShortNotice = data.PROPERTIES_XML.applyBeforeProperties.isAllowShortNotice.isCheck;
            this.makeAsEmergency = data.PROPERTIES_XML.applyBeforeProperties.markAsEmergency;
        })
    }
    /**
     * get details of file after upload from local file
     * @param {*} files
     * @param {number} i
     * @returns
     * @memberof ApplyLeaveComponent
     */
    uploadEvent(document: any) {
        const fileToSave = document.item(0);
        let formData = new FormData();
        formData.append('file', fileToSave, fileToSave.name);
        this.apiService.post_file(formData).subscribe(res => {
            this.uploadedFile = res;
        });
    }

    /**
     * Method to get day of the week from a given date
     * @param {*} date
     * @returns
     * @memberof CalendarViewPage
     */
    getDayName(date) {
        //Create an array containing each day, starting with Sunday.
        const weekdays = new Array(
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        );
        //Use the getDay() method to get the day.
        const day = date.getDay();
        //Return the element that corresponds to that index.
        return weekdays[day];
    }

    /**
     * This method is used to create consecutive date as an array list
     * @param {*} arrayValue
     * @returns
     * @memberof ApplyLeaveComponent
     */
    createConsecutiveDate(arrayValue) {
        let arr = arrayValue,
            i = 0,
            result = arr.reduce(function (stack, b) {
                var cur = stack[i],
                    a = cur ? cur[cur.length - 1] : 0;
                if (b - a > 86400000) {
                    i++;
                }
                if (!stack[i])
                    stack[i] = [];
                stack[i].push(b);
                return stack;
            }, []);
        return result;
    }

    /**
     * This method is used to post data to apply leave API 
     * @memberof ApplyLeaveComponent
     */
    postData() {
        let newArray = [];
        newArray = this._dateArray;
        newArray = newArray.filter(val => !this._firstForm.includes(val));
        let result = this.createConsecutiveDate(newArray);
        for (let i = 0; i < result.length; i++) {
            if (result[i] !== undefined) {
                const minMax = this.getMinMaxDate(result[i]);
                const remainingFullDay = {
                    "startDate": dayjs(minMax[0]).format('YYYY-MM-DD HH:mm:ss'),
                    "endDate": dayjs(minMax[1]).format('YYYY-MM-DD HH:mm:ss'),
                    "dayType": 0,
                    "slot": "",
                    "quarterDay": ""
                }
                this._arrayDateSlot.push(remainingFullDay);
            }
        }
        this.postDataHalfQuarter();
        const applyLeaveData = {
            "leaveTypeID": this.leaveTypeId,
            "reason": this.applyLeaveForm.value.inputReason,
            "data": this._arrayDateSlot
        }
        if (this.uploadedFile != undefined) {
            applyLeaveData['attachment'] = this.uploadedFile.filename
        } else { applyLeaveData['attachment'] = '' }

        console.log(applyLeaveData);

        const dialog = this.apiService.matdialog.open(ApplyLeaveConfirmationComponent, {
            disableClose: true,
            data: { leavetype: this.leaveCode, reason: this.applyLeaveForm.value.inputReason, details: this._arrayDateSlot },
            height: "275px",
            width: "390px",
            panelClass: 'custom-dialog-container'
        });
        dialog.afterClosed().subscribe(result => {
            if (result === 'OK') {
                this.leaveAPI.post_user_apply_leave(applyLeaveData).subscribe(
                    (val) => {
                        this.clearArrayList();
                        this.applyLeaveForm.reset();
                        this.daysAvailable = 0;
                        this.daysCount = 0;
                        this.minDate = '';
                        this.maxDate = '';
                        this.emergency = false;
                        if (val.valid === true) {
                            this.leaveAPI.openSnackBar(val.message, true);
                            this.leaveAPI.get_entilement_details().subscribe(item => {
                                this.entitlement = item;
                            })
                        } else {
                            this.leaveAPI.openSnackBar(val.message, false);
                        }
                    },
                    response => {
                        this.clearArrayList();
                        this.leaveAPI.openSnackBar(JSON.parse(response._body).status, false);
                    });
            } else {
                this._arrayDateSlot = [];
            }
        });
    }

    /**
     * This method is used to clear all form value
     * @memberof ApplyLeaveComponent
     */
    clearArrayList() {
        this._firstForm = [];
        this._arrayDateSlot = [];
        this._dateArray = [];
        this._slot = [];
        this._selectedQuarterHour = [];
        this.quarterDayIndex = [];
        this.halfDayIndex = [];
        this.dayName = [];
        this.dateSelection = [];
        this.uploadedFile = null;
    }

    /**
     * get quarter and half day slot value 
     * eg: AM, PM, Q1 to Q4
     * @memberof ApplyLeaveComponent
     */
    postDataHalfQuarter() {
        this.dayName.forEach((dayVal, index) => {
            dayVal === '1' ? this.halfDayIndex.push(index) : null;
            dayVal === '2' ? this.quarterDayIndex.push(index) : null;
        });

        for (let i = 0; i < this.halfDayIndex.length; i++) {
            const remainingFullDay = {
                "startDate": dayjs(this._dateArray[this.halfDayIndex[i]]).format('YYYY-MM-DD HH:mm:ss'),
                "endDate": dayjs(this._dateArray[this.halfDayIndex[i]]).format('YYYY-MM-DD HH:mm:ss'),
                "dayType": 1,
                "slot": this._slot[this.halfDayIndex[i]],
                "quarterDay": ""
            }
            this._arrayDateSlot.push(remainingFullDay);
        }

        for (let i = 0; i < this.quarterDayIndex.length; i++) {
            const remainingFullDay = {
                "startDate": dayjs(this._dateArray[this.quarterDayIndex[i]]).format('YYYY-MM-DD HH:mm:ss'),
                "endDate": dayjs(this._dateArray[this.quarterDayIndex[i]]).format('YYYY-MM-DD HH:mm:ss'),
                "dayType": 2,
                "slot": "",
                "quarterDay": this._selectedQuarterHour[this.quarterDayIndex[i]]
            }
            this._arrayDateSlot.push(remainingFullDay);
        }
        console.log(this._arrayDateSlot);
    }

    /**
     * This method is used to patch value of selected start date & end date
     * Calculate weekdays
     * @memberof ApplyLeaveComponent
     */
    onDateChange(): void {
        if (!this.applyLeaveForm.value.firstPicker || !this.applyLeaveForm.value.secondPicker) {
        } else {
            this._reformatDateFrom = dayjs(this.applyLeaveForm.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
            this._reformatDateTo = dayjs(this.applyLeaveForm.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
            this.getWeekDays(this.applyLeaveForm.value.firstPicker, this.applyLeaveForm.value.secondPicker, this._weekDayNumber, this._holiday, this._isExcludePH, this._isExcludeRest);
            this.emergency = false;
            if (this.allowShortNotice && this.makeAsEmergency) {
                this._arrayShortNotice = [];
                let start = new Date(dayjs(new Date()).add(1, 'day'));
                while (start) {
                    if (this._arrayShortNotice.length <= this._setupData.PROPERTIES_XML.applyBeforeProperties.numberOfDays) {
                        if (this._setupData.PROPERTIES_XML.applyBeforeProperties.excludeDayType.isExcludeHoliday && this._setupData.PROPERTIES_XML.applyBeforeProperties.excludeDayType.isExcludeRestDay) {
                            if (!this._weekDayNumber.includes(start.getDay()) && !this._holiday.includes(dayjs(start).format('YYYY-MM-DD'))) {
                                this.daysCount++;
                                this._arrayShortNotice.push(new Date(start));
                            }
                        }
                        if (this._setupData.PROPERTIES_XML.applyBeforeProperties.excludeDayType.isExcludeHoliday && !this._setupData.PROPERTIES_XML.applyBeforeProperties.excludeDayType.isExcludeRestDay) {
                            if (!this._weekDayNumber.includes(dayjs(start).format('YYYY-MM-DD'))) {
                                this.daysCount++;
                                this._arrayShortNotice.push(new Date(start));
                            }
                        }
                        if (!this._setupData.PROPERTIES_XML.applyBeforeProperties.excludeDayType.isExcludeHoliday && this._setupData.PROPERTIES_XML.applyBeforeProperties.excludeDayType.isExcludeRestDay) {
                            if (!this._weekDayNumber.includes(start.getDay())) {
                                this.daysCount++;
                                this._arrayShortNotice.push(new Date(start));
                            }
                        }
                        if (!this._setupData.PROPERTIES_XML.applyBeforeProperties.excludeDayType.isExcludeHoliday && !this._setupData.PROPERTIES_XML.applyBeforeProperties.excludeDayType.isExcludeRestDay) {
                            this.daysCount++;
                            this._arrayShortNotice.push(new Date(start));
                        }
                        start.setDate(start.getDate() + 1);
                        if (this._arrayShortNotice.length === this._setupData.PROPERTIES_XML.applyBeforeProperties.numberOfDays)
                            break;
                    } else {
                        break;
                    }
                }
                this.getWeekDays(this.applyLeaveForm.value.firstPicker, this.applyLeaveForm.value.secondPicker, this._weekDayNumber, this._holiday, this._setupData.PROPERTIES_XML.applyBeforeProperties.excludeDayType.isExcludeHoliday, this._setupData.PROPERTIES_XML.applyBeforeProperties.excludeDayType.isExcludeRestDay);
                if (!(this._arrayShortNotice[this._arrayShortNotice.length - 1].getDate() < this._dateArray[0].getDate())) {
                    this.emergency = true;
                }
            }
            this.dateSelection = this._dateArray;
            this.dayName = [];
            this._slot = []; this._selectedQuarterHour = []; this._firstForm = [];
            for (let i = 0; i < this.dateSelection.length; i++) {
                this.dateSelection[i] = dayjs(this.dateSelection[i]).format('DD MMMM YYYY');
                this.dayName.push("0");
                this.amButton.push(true);
                this.Q1Button.push(true);
                this.Q2Button.push(false);
                this.Q3Button.push(false);
                this.Q4Button.push(false);
            }
        }
    }

    /**
     * day name change
     * @param {*} event
     * @param {number} j
     * @memberof ApplyLeaveComponent
     */
    dayNameChanged(event: any, j: number) {
        if (this.dayName[j] == '1' && event.value == '0') {
            this.daysCount += 0.5;
        }
        if (this.dayName[j] == '2' && event.value == '0') {
            this.daysCount += 0.75;
        }
        if (this.dayName[j] == '2' && event.value == '1') {
            this.daysCount += 0.25;
        }
        if (this.dayName[j] == '0' && event.value == '1') {
            this.daysCount -= 0.50;
        }
        if (this.dayName[j] == '1' && event.value == '2') {
            this.daysCount -= 0.25;
        }
        if (this.dayName[j] == '0' && event.value == '2') {
            this.daysCount -= 0.75;
        }
        this.dayName.splice(j, 1, event.value);
        if (event.value == '1') {
            this._slot[j] = "AM";
            if (this._firstForm.indexOf(this._dateArray[j]) < 0) {
                this._firstForm.push(this._dateArray[j]);
            }
        }
        if (event.value === '2') {
            this._selectedQuarterHour[j] = "Q1";
            if (!(this._firstForm.includes(this._dateArray[j]))) {
                this._firstForm.push(this._dateArray[j]);
            }
        }
        if (event.value == '0') {
            const index = this._firstForm.indexOf(this._dateArray[j]);
            this._firstForm.splice(index, 1);
        }
    }

    /**
     * get am/pm or quarter value(Q1 to Q4)
     * @param {number} j
     * @param {string} buttonVal
     * @memberof ApplyLeaveComponent
     */
    getHalfQuarterValue(j: number, buttonVal: string) {
        if (buttonVal == 'AM' || buttonVal == 'PM') {
            this._slot[j] = buttonVal;
        } else {
            this._selectedQuarterHour[j] = buttonVal;
        }
    }

    /**
     * This method is used to calculate weekdays
     * @param {Date} first
     * @param {Date} last
     * @returns
     * @memberof ApplyLeaveComponent
     */
    getWeekDays(first: Date, last: Date, dayNumber: number[], holiday: any[], isExludePH, isExludeRest) {
        if (first > last) return -1;
        var start = new Date(first.getTime());
        var end = new Date(last.getTime());
        this.daysCount = 0;
        this._dateArray = [];
        while (start <= end) {
            if (isExludePH && isExludeRest) {
                if (!dayNumber.includes(start.getDay()) && !holiday.includes(dayjs(start).format('YYYY-MM-DD'))) {
                    this.daysCount++;
                    this._dateArray.push(new Date(start));
                }
            }
            if (isExludePH && !isExludeRest) {
                if (!holiday.includes(dayjs(start).format('YYYY-MM-DD'))) {
                    this.daysCount++;
                    this._dateArray.push(new Date(start));
                }
            }
            if (!isExludePH && isExludeRest) {
                if (!dayNumber.includes(start.getDay())) {
                    this.daysCount++;
                    this._dateArray.push(new Date(start));
                }
            }
            if (!isExludePH && !isExludeRest) {
                this.daysCount++;
                this._dateArray.push(new Date(start));
            }
            start.setDate(start.getDate() + 1);
        }
        return [this.daysCount, this._dateArray];
    }

    /**
     * This method is used to get min. and max. date of each date array
     * @param {*} all_dates
     * @returns
     * @memberof ApplyLeaveComponent
     */
    getMinMaxDate(all_dates) {
        let max_dt = all_dates[0],
            max_dtObj = new Date(all_dates[0]);
        let min_dt = all_dates[0],
            min_dtObj = new Date(all_dates[0]);
        all_dates.forEach(function (dt, index) {
            if (new Date(dt) > max_dtObj) {
                max_dt = dt;
                max_dtObj = new Date(dt);
            }
            if (new Date(dt) < min_dtObj) {
                min_dt = dt;
                min_dtObj = new Date(dt);
            }
        });
        return [min_dt, max_dt];
    }

    /**
     * This method is used to set min. date of datepicker start date
     * @param {MatDatepickerInputEvent<string>} event
     * @returns {string}
     * @memberof ApplyLeaveComponent
     */
    getValueFrom(event: MatDatepickerInputEvent<string>): string {
        return this.minDate = dayjs(event.value).format('YYYY-MM-DD');
    }

    /**
     * This method is used to set max. date of datepicker end date
     * @param {MatDatepickerInputEvent<string>} event
     * @returns {string}
     * @memberof ApplyLeaveComponent
     */
    getValueTo(event: MatDatepickerInputEvent<string>): string {
        const toDate: string = dayjs(event.value).format('YYYY-MM-DD');
        if (toDate < this.minDate) {
            return this.maxDate = this.minDate;
        } else {
            return this.maxDate = toDate;
        }
    }

}
