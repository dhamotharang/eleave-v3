import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from 'src/services/shared-service/api.service';
import { ActivatedRoute } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import * as _moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DayType } from './apply-leave.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { LeavePlanningAPIService } from '../leave-planning-api.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/employee/date.adapter';
const moment = _moment;
/**
 * Apply Leave Page
 * @export
 * @class ApplyLeavePage
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
export class ApplyLeavePage implements OnInit {
    /**
     * Local property for leave entitlement details
     * @type {*}
     * @memberof ApplyLeavePage
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
     * @memberof ApplyLeavePage
     */
    public daysAvailable: number = 0;

    /**
     * Local property for leave day applied
     * @type {number}
     * @memberof ApplyLeavePage
     */
    public daysCount: number = 0;

    /**
     * Local property for show or hide Add icon
     * @type {boolean}
     * @memberof ApplyLeavePage
     */
    public showAddIcon: boolean = true;

    /**
     * This is input property for plugins of Full Calendar Component
     * @memberof ApplyLeavePage
     */
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];

    /**
     * Property for alias Event Input of Full Calendar Component
     * @type {EventInput[]}
     * @memberof ApplyLeavePage
     */
    public calendarEvents: EventInput[];

    /**
     * Local property for min. date range
     * @type {string}
     * @memberof ApplyLeavePage
     */
    public minDate: string;

    /**
     * Local property for max. date range
     * @type {string}
     * @memberof ApplyLeavePage
     */
    public maxDate: string;

    /**
     * Local property for leave form group
     * @type {FormGroup}
     * @memberof ApplyLeavePage
     */
    public applyLeaveForm: any;

    /**
     * Local property for selected quarter hour value
     * @type {string}
     * @memberof ApplyLeavePage
     */
    public selectedQuarterHour: string = '';

    /**
     * Local property for leave type ID
     * @type {string}
     * @memberof ApplyLeavePage
     */
    public leaveTypeId: string;

    /**
     * show text in clicked calendar
     * @type {string}
     * @memberof ApplyLeavePage
     */
    public text: string;

    /**
     * date in clicked calendar
     * @type {Date}
     * @memberof ApplyLeavePage
     */
    public date: Date;

    /**
     * Local private property for value get from API
     * @private
     * @type {*}
     * @memberof ApplyLeavePage
     */
    private _userList: any;

    /**
     * Local private property to get number of day from a week
     * eg: sunday-saturday is 0-6
     * @private
     * @type {number}
     * @memberof ApplyLeavePage
     */
    private _weekDayNumber: number[] = [];
    /**
     * Local private property for selected date array list
     * @private
     * @type {*}
     * @memberof ApplyLeavePage
     */
    private _dateArray: any;

    /**
     * Local private property for start date
     * @private
     * @type {string}
     * @memberof ApplyLeavePage
     */
    private _reformatDateFrom: string;

    /**
     * Local private property for end date
     * @private
     * @type {string}
     * @memberof ApplyLeavePage
     */
    private _reformatDateTo: string;

    /**
     * Default index number for first day types selection
     * @private
     * @type {string}
     * @memberof ApplyLeavePage
     */
    private _index: string = '0';

    /**
     * Date selected for 1st day types selection 
     * @private
     * @memberof ApplyLeavePage
     */
    private _firstForm = [];

    /**
     * Date selected for 2nd day types selection 
     * @private
     * @memberof ApplyLeavePage
     */
    private _secondForm = [];

    /**
     * Date selected for 3rd day types selection 
     * @private
     * @memberof ApplyLeavePage
     */
    private _thirdForm = [];

    /**
     * Index number of selected date from selection list (_dateArray) for 1st day types selection
     * @private
     * @memberof ApplyLeavePage
     */
    private _firstFormIndex = [];

    /**
     * Index number of selected date from selection list (_dateArray) for 2nd day types selection
     * @private
     * @memberof ApplyLeavePage
     */
    private _secondFormIndex = [];

    /**
     * Index number of selected date from selection list (_dateArray) for 3rd day types selection
     * @private
     * @memberof ApplyLeavePage
     */
    private _thirdFormIndex = [];

    /**
     * Disable date option list (true/false)
     * @private
     * @memberof ApplyLeavePage
     */
    private _arrayList = [];

    /**
     * AM/PM for 1st day types selection
     * @private
     * @type {string}
     * @memberof ApplyLeavePage
     */
    private _slot1: string;

    /**
     * AM/PM for 2nd day types selection
     * @private
     * @type {string}
     * @memberof ApplyLeavePage
     */
    private _slot2: string;

    /**
     * AM/PM for 3rd day types selection
     * @private
     * @type {string}
     * @memberof ApplyLeavePage
     */
    private _slot3: string;

    /**
     * {startDate: "YYYY-MM-DD 00:00:00", endDate: "YYYY-MM-DD 00:00:00", dayType: number, slot: string, quarterDay: string}
     * Object for 1st day types selection
     * @private
     * @memberof ApplyLeavePage
     */
    private _objSlot1 = [];

    /**
     * Object for 2nd day types selection
     * @private
     * @memberof ApplyLeavePage
     */
    private _objSlot2 = [];

    /**
     * Object for 3rd day types selection
     * @private
     * @memberof ApplyLeavePage
     */
    private _objSlot3 = [];

    /**
     * Data collected from (_objSlot1, _objSlot2, _objSlot3) POST to apply leave API
     * @private
     * @memberof ApplyLeavePage
     */
    private _arrayDateSlot = [];

    /**
     * This is local property for Full Calendar Component
     * @type {FullCalendarComponent}
     * @memberof ApplyLeavePage
     */
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    /**
     * get return value of dayTypes array list
     * @readonly
     * @type {FormArray}
     * @memberof ApplyLeavePage
     */
    get dayTypes(): FormArray {
        return this.applyLeaveForm.get('dayTypes') as FormArray;
    }

    /**
     * Creates an instance of ApplyLeavePage.
     * @param {APIService} apiService
     * @param {ActivatedRoute} route
     * @param {LeavePlanningAPIService} leaveAPI
     * @memberof ApplyLeavePage
     */
    constructor(private apiService: APIService, private route: ActivatedRoute, private leaveAPI: LeavePlanningAPIService) {
        this.applyLeaveForm = this.formGroup();
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
     * @memberof ApplyLeavePage
     */
    ngOnInit() {
        const dt = new Date();
        const yr = dt.getFullYear();
        this.apiService.get_user_profile().subscribe(
            (data: any[]) => {
                this._userList = data;
                this.entitlement = this._userList.entitlementDetail;
                this.calendarId = this._userList.calendarId;
            },
            error => {
                if (error) {
                    window.location.href = '/login';
                }
            },
            () => {
                this.leaveAPI.get_personal_holiday_calendar(this.calendarId, yr).subscribe(
                    data => {
                        this.formatDate(data.holiday);
                        for (let i = 0; i < data.rest.length; i++) {
                            const weekdays = new Array(
                                "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
                            );
                            this._weekDayNumber.push(weekdays.indexOf(data.rest[i].fullname));
                        }
                    }
                );
            }
        );
        setTimeout(() => {
            let calendarApi = this.calendarComponent.getApi();
            calendarApi.render();
        }, 100);
    }

    /**
     * This method is used to form group for validation
     * @returns
     * @memberof ApplyLeavePage
     */
    formGroup() {
        return new FormGroup({
            dayTypes: new FormArray([
                new FormGroup({
                    name: new FormControl(0),
                    selectArray: new FormArray([
                        new FormControl(['0']),
                        new FormControl(''),
                    ]),
                    status: new FormControl([false])
                })
            ]),
            leaveTypes: new FormControl('', Validators.required),
            firstPicker: new FormControl('', Validators.required),
            secondPicker: new FormControl('', Validators.required),
            inputReason: new FormControl('', Validators.required),
        });
    }

    /**
     * format date using moment library
     * @param {*} holiday
     * @memberof CalendarViewPage
     */
    formatDate(holiday) {
        this.calendarEvents = holiday;
        for (let i = 0; i < holiday.length; i++) {
            this.calendarEvents[i].start = (moment(holiday[i].start).format('YYYY-MM-DD'));
            this.calendarEvents[i].end = moment(holiday[i].end).format('YYYY-MM-DD');
            this.calendarEvents[i].day = this.getDayName(new Date(holiday[i].start));
            this.calendarEvents[i].allDay = true;
            this.calendarEvents[i]["backgroundColor"] = "#7069d8";
            this.calendarEvents[i]["borderColor"] = "#7069d8";
        }
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
     * @memberof ApplyLeavePage
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
     * @memberof ApplyLeavePage
     */
    postData() {
        let newArray = [];
        newArray = this._dateArray;
        newArray = newArray.filter(val => !this._firstForm.includes(val));
        newArray = newArray.filter(val => !this._secondForm.includes(val));
        newArray = newArray.filter(val => !this._thirdForm.includes(val));

        if (this.dayTypes.value[0].name !== 2) {
            let result = this.createConsecutiveDate(newArray);
            for (let i = 0; i < result.length; i++) {
                if (result[i] !== undefined) {
                    const minMax = this.getMinMaxDate(result[i]);
                    const remainingFullDay = {
                        "startDate": moment(minMax[0]).format('YYYY-MM-DD HH:mm:ss'),
                        "endDate": moment(minMax[1]).format('YYYY-MM-DD HH:mm:ss'),
                        "dayType": 0,
                        "slot": "",
                        "quarterDay": this.selectedQuarterHour
                    }
                    this._arrayDateSlot.push(remainingFullDay);
                }
            }
        }
        if (this.dayTypes.value[0].name == 2) {
            let result = this.createConsecutiveDate(newArray);
            for (let i = 0; i < result.length; i++) {
                if (result[i] !== undefined) {
                    const minMaxValue = this.getMinMaxDate(result[i]);
                    const remainingFullDay = {
                        "startDate": moment(minMaxValue[0]).format('YYYY-MM-DD HH:mm:ss'),
                        "endDate": moment(minMaxValue[1]).format('YYYY-MM-DD HH:mm:ss'),
                        "dayType": 2,
                        "slot": "",
                        "quarterDay": this.selectedQuarterHour
                    }
                    this._arrayDateSlot.push(remainingFullDay);
                }
            }
        }

        const applyLeaveData = {
            "leaveTypeID": this.leaveTypeId,
            "reason": this.applyLeaveForm.value.inputReason,
            "data": this._arrayDateSlot
        }
        console.log(applyLeaveData);

        this.leaveAPI.post_user_apply_leave(applyLeaveData).subscribe(
            (val) => {
                console.log("PATCH call successful value returned in body", val);
                this.clearArrayList();
                this.leaveAPI.openSnackBar('success');
            },
            response => {
                console.log("PATCH call in error", response);
                this.clearArrayList();
                this.leaveAPI.openSnackBar('fail');
                if (response.status === 401) {
                    window.location.href = '/login';
                }
            });
    }

    /**
     * This method is used to clear all form value
     * @memberof ApplyLeavePage
     */
    clearArrayList() {
        this.applyLeaveForm = this.formGroup();
        this._arrayList = [];
        this._firstForm = [];
        this._secondForm = [];
        this._thirdForm = [];
        this._firstFormIndex = [];
        this._secondFormIndex = [];
        this._thirdFormIndex = [];
        this._objSlot1 = [];
        this._objSlot2 = [];
        this._objSlot3 = [];
        this._arrayDateSlot = [];
        this.selectedQuarterHour = '';
    }

    /**
     * This method is used to patch value of selected start date & end date
     * Calculate weekdays
     * @memberof ApplyLeavePage
     */
    onDateChange(): void {
        if (!this.applyLeaveForm.value.firstPicker || !this.applyLeaveForm.value.secondPicker) {
        } else {
            this._reformatDateFrom = moment(this.applyLeaveForm.value.firstPicker).format('YYYY-MM-DD HH:mm:ss');
            this._reformatDateTo = moment(this.applyLeaveForm.value.secondPicker).format('YYYY-MM-DD HH:mm:ss');
            this.getWeekDays(this.applyLeaveForm.value.firstPicker, this.applyLeaveForm.value.secondPicker, this._weekDayNumber);
            this.dayTypes.patchValue([{ selectArray: [this._dateArray] }]);
        }
    }

    /**
     * This method is used to calculate weekdays
     * @param {Date} first
     * @param {Date} last
     * @returns
     * @memberof ApplyLeavePage
     */
    getWeekDays(first: Date, last: Date, dayNumber: number[]) {
        if (first > last) return -1;
        var start = new Date(first.getTime());
        var end = new Date(last.getTime());
        this.daysCount = 0;
        this._dateArray = [];
        while (start <= end) {
            if (!dayNumber.includes(start.getDay())) {
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
     * @memberof ApplyLeavePage
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
     * @memberof ApplyLeavePage
     */
    getValueFrom(event: MatDatepickerInputEvent<string>): string {
        return this.minDate = moment(event.value).format('YYYY-MM-DD');
    }

    /**
     * This method is used to set max. date of datepicker end date
     * @param {MatDatepickerInputEvent<string>} event
     * @returns {string}
     * @memberof ApplyLeavePage
     */
    getValueTo(event: MatDatepickerInputEvent<string>): string {
        const toDate: string = moment(event.value).format('YYYY-MM-DD');
        if (toDate < this.minDate) {
            return this.maxDate = this.minDate;
        } else {
            return this.maxDate = toDate;
        }
    }

    /**
     * This method is used to detect selection change of day types
     * @param {*} event
     * @param {*} index
     * @memberof ApplyLeavePage
     */
    dayTypesChanged(event: any, index: any) {
        this._index = index;
        this.showAddIcon = true;
        if (event.value == '1') {
            this.open(index);
        }
    }

    /**
     * This method is used to patch value to form control status
     * @param {number} i
     * @param {*} value
     * @param {boolean} disabled
     * @memberof ApplyLeavePage
     */
    patchValueFunction(i: number, value: any, disabled: boolean) {
        for (let j = 0; j < value.length; j++) {
            const valueFirst = (this.dayTypes.controls[i].value.status[0]).splice(value[j], 1, disabled);
            this.dayTypes.controls[0].patchValue([{ status: valueFirst }]);
        }
    }

    /**
     * This method is used to detect opened change of half day dates
     * @param {number} index
     * @memberof ApplyLeavePage
     */
    open(index: number) {
        if (this._arrayList.length === 0) {
            for (let j = 0; j < this.dayTypes.controls[index].value.selectArray[0].length; j++) {
                this._arrayList.push(false);
            }
        }
        const selected = (this.dayTypes.controls[index].value.status).splice(0, 1, this._arrayList);
        this.dayTypes.controls[index].patchValue([{ status: selected }]);
        if (index == 0) {
            this.patchValueFunction(index, this._firstFormIndex, false);
            this.patchValueFunction(index, this._secondFormIndex, true);
            this.patchValueFunction(index, this._thirdFormIndex, true);
        } if (index == 1) {
            this.patchValueFunction(index, this._firstFormIndex, true);
            this.patchValueFunction(index, this._secondFormIndex, false);
            this.patchValueFunction(index, this._thirdFormIndex, true);
        } if (index == 2) {
            this.patchValueFunction(index, this._firstFormIndex, true);
            this.patchValueFunction(index, this._secondFormIndex, true);
            this.patchValueFunction(index, this._thirdFormIndex, false);
        }
    }

    /**
     * This method is used to calculate days of leave apply
     * @param {*} date
     * @param {*} form
     * @memberof ApplyLeavePage
     */
    calculate(date: any, form: any) {
        let missing = null;
        for (let i = 0; i < form.length; i++) {
            if (date.indexOf(form[i]) == -1) {
                missing = form[i];
                this.daysCount = this.daysCount + 0.5;
            }
        }
        if (!missing) { this.daysCount = this.daysCount - 0.5; }
    }

    /**
     * This method is used to check duplicate start date
     * @param {*} obj
     * @param {*} list
     * @returns
     * @memberof ApplyLeavePage
     */
    containsObject(obj: any, list: any) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].startDate === obj.startDate) {
                return true;
            }
        }
        return false;
    }

    /**
     * This method is used to format body to be send to POST API
     * @param {*} form
     * @param {*} array
     * @param {string} slot
     * @memberof ApplyLeavePage
     */
    postValueReformat(form: any, array: any, slot: string) {
        for (let j = 0; j < form.length; j++) {
            const obj = {
                "startDate": moment(form[j]).format('YYYY-MM-DD HH:mm:ss'),
                "endDate": moment(form[j]).format('YYYY-MM-DD HH:mm:ss'),
                "dayType": Number(this.dayTypes.controls[this._index].value.name),
                "slot": slot,
                "quarterDay": this.selectedQuarterHour,
            }
            if (this.containsObject(obj, array) === false) {
                array.push(obj);
            }
            if (obj.slot !== array[j].slot) {
                array.splice(j, 1, obj);
            }
        }
    }

    /**
     * This method is used to calculate days when selected date options
     * @param {*} selectedDate
     * @param {number} index
     * @memberof ApplyLeavePage
     */
    halfDaySelectionChanged(selectedDate: any, index: number) {
        if (index == 0) {
            this.calculate(selectedDate, this._firstForm);
            this._firstForm = selectedDate;
            this.postValueReformat(this._firstForm, this._objSlot1, this._slot1);
        }
        if (index == 1) {
            this.calculate(selectedDate, this._secondForm);
            this._secondForm = selectedDate;
            this.postValueReformat(this._secondForm, this._objSlot2, this._slot2);
        }
        if (index == 2) {
            this.calculate(selectedDate, this._thirdForm);
            this._thirdForm = selectedDate;
            this.postValueReformat(this._thirdForm, this._objSlot3, this._slot3);
        }
        this._arrayDateSlot = this._objSlot1.concat(this._objSlot2).concat(this._objSlot3);
    }

    /**
     * This method is used to assign value of selected date option
     * @param {number} i
     * @param {number} indexj
     * @memberof ApplyLeavePage
     */
    valueSelected(i: number, indexj: number) {
        if (i == 0) {
            const index = this._firstFormIndex.findIndex(item => item === indexj);
            if (index > -1) {
                this._firstFormIndex.splice(index, 1);
            } else {
                this._firstFormIndex.push(indexj);
            }
        } if (i == 1) {
            const index = this._secondFormIndex.findIndex(item => item === indexj);
            if (index > -1) {
                this._secondFormIndex.splice(index, 1);
            } else {
                this._secondFormIndex.push(indexj);
            }
        } if (i == 2) {
            const index = this._thirdFormIndex.findIndex(item => item === indexj);
            if (index > -1) {
                this._thirdFormIndex.splice(index, 1);
            } else {
                this._thirdFormIndex.push(indexj);
            }
        }
    }

    /**
     * This method is used to get time slot AM/PM when detect change
     * @param {*} event
     * @param {*} i
     * @memberof ApplyLeavePage
     */
    timeSlotChanged(event: any, i: any) {
        this._index = i;
        const selected = (this.dayTypes.controls[this._index].value.selectArray).splice(1, 1, event.value);
        this.dayTypes.controls[i].patchValue([{ selectArray: selected }]);
        if (i === 0) {
            this._slot1 = event.value;
            this.postValueReformat(this._firstForm, this._objSlot1, this._slot1);
        }
        if (i === 1) {
            this._slot2 = event.value;
            this.postValueReformat(this._secondForm, this._objSlot2, this._slot2);
        }
        if (i === 2) {
            this._slot3 = event.value;
            this.postValueReformat(this._thirdForm, this._objSlot3, this._slot3);
        }
        this._arrayDateSlot = this._objSlot1.concat(this._objSlot2).concat(this._objSlot3);
    }

    /**
     * This method is used for add new form group after clicked add button
     * @memberof ApplyLeavePage
     */
    addFormField() {
        if (this.dayTypes.controls.length < Object.keys(DayType).length / 2) {
            this.dayTypes.push(new FormGroup({
                name: new FormControl(0),
                selectArray: new FormArray([new FormControl(this._dateArray), new FormControl('')]),
                status: new FormControl([false])
            }));
        } else {
            this.showAddIcon = false;
            alert("No other option");
        }
    }



}
