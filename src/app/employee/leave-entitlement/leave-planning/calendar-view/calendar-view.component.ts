import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listYear from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { APIService } from '../../../../../../src/services/shared-service/api.service';
import * as _moment from 'moment';
import { LeavePlanningAPIService } from '../leave-planning-api.service';
const moment = _moment;

/**
 * Calendar View Page
 * @export
 * @class CalendarViewComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-calendar-view',
    templateUrl: './calendar-view.component.html',
    styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnInit {

    /**
     * This is local property for Full Calendar Component
     * @type {FullCalendarComponent}
     * @memberof CalendarViewComponent
     */
    @ViewChild('calendar') calendar: FullCalendarComponent;

    /**
     * This is input property for plugins of Full Calendar Component
     * @memberof CalendarViewComponent
     */
    public calendarPlugins = [dayGridPlugin, interactionPlugin];

    /**
     * Get data from user profile API
     * @type {*}
     * @memberof CalendarViewComponent
     */
    public list: any;

    /**
     * Get calendar id from user profile API & request data from calendar API
     * @type {string}
     * @memberof CalendarViewComponent
     */
    public calendarId: string;

    /** 
     * Property for alias Event Input of Full Calendar Component
     * @type {EventInput[]}
     * @memberof CalendarViewComponent
     */
    public events: EventInput[];

    /**
     * public holiday list
     * @type {*}
     * @memberof CalendarViewComponent
     */
    public PBList: any;

    /**
     * get end date
     * @type {string}
     * @memberof CalendarViewComponent
     */
    public endDate: string;

    /**
     * get full or half day
     * @type {string}
     * @memberof CalendarViewComponent
     */
    public timeslot: string;

    /**
     * all on leave list from database
     * @type {*}
     * @memberof CalendarViewComponent
     */
    public calendarList: any;

    /**
     * get onleave employee from selected date
     * @type {*}
     * @memberof CalendarViewComponent
     */
    public onLeaveList: any

    /**
     *Creates an instance of CalendarViewComponent.
     * @param {APIService} apiService
     * @param {LeavePlanningAPIService} leaveAPI
     * @memberof CalendarViewComponent
     */
    constructor(private apiService: APIService, private leaveAPI: LeavePlanningAPIService) { }

    /**
     * initial method
     * @memberof CalendarViewComponent
     */
    async ngOnInit() {
        const date = new Date();
        let year = date.getFullYear();
        let a = await this.apiService.get_user_profile().toPromise();
        this.list = a;
        this.calendarId = this.list.calendarId;
        let holidayList = await this.leaveAPI.get_personal_holiday_calendar(this.calendarId, year).toPromise();
        this.PBList = holidayList.holiday;
        await this.allOnleaveList();
        await this.getOnLeaveList(new Date());
        this.events = this.PBList.concat(this.calendarList);
        this.editDateFormat(this.PBList);
        this.getEmployeeLeaveList(this.events);
    }

    /**
     * get leave application on the selected date
     * @param {Date} date
     * @memberof CalendarViewComponent
     */
    async getOnLeaveList(date: Date) {
        this.onLeaveList = await this.leaveAPI.get_calendar_onleave_list({ 'enddate': moment(date).format('YYYY-MM-DD'), 'startdate': moment(date).format('YYYY-MM-DD') }).toPromise();
    }

    /**
     * get all employee onleave list
     * @memberof CalendarViewComponent
     */
    async allOnleaveList() {
        this.calendarList = await this.leaveAPI.get_all_onleave_list().toPromise();
        for (let i = 0; i < this.calendarList.length; i++) {
            if (this.calendarList[i].STATUS === 'APPROVED') {
                this.calendarList[i]["backgroundColor"] = "#46cdcf";
                this.calendarList[i]["borderColor"] = "#46cdcf";
            }
            if (this.calendarList[i].STATUS === 'REJECTED') {
                this.calendarList[i]["backgroundColor"] = "#ff6768";
                this.calendarList[i]["borderColor"] = "#ff6768";
            }
            if (this.calendarList[i].STATUS === 'CANCELLED') {
                this.calendarList[i]["backgroundColor"] = "#3b86ff";
                this.calendarList[i]["borderColor"] = "#3b86ff";
            }
            if (this.calendarList[i].STATUS === 'PENDING') {
                this.calendarList[i]["backgroundColor"] = "#ffb961";
                this.calendarList[i]["borderColor"] = "#ffb961";
            }
        }
    }

    /**
     * format date using moment library
     * @param {*} date
     * @memberof CalendarViewComponent
     */
    editDateFormat(date: any) {
        for (let i = 0; i < date.length; i++) {
            this.PBList[i].str = (moment(date[i].start).format('DD-MM-YYYY'));
            this.PBList[i].day = this.getWeekDay(new Date(date[i].start));
            this.PBList[i]["backgroundColor"] = "#3b86ff";
            this.PBList[i]["borderColor"] = "#3b86ff";
        }
    }

    /**
     * display onleave & public holiday event in calendar
     * @param {*} list
     * @memberof CalendarViewComponent
     */
    getEmployeeLeaveList(list: any) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].CODE != undefined) {
                this.events[i].start = moment(list[i].START_DATE).format("YYYY-MM-DD[T]HH:mm:ss");
                this.events[i].end = moment(list[i].END_DATE).format("YYYY-MM-DD[T]HH:mm:ss");
                this.events[i].title = list[i].FULLNAME + ' ' + '(' + (list[i].CODE) + ')';
                // this.events[i].allDay = true;
            } else {
                this.events[i].start = (moment(list[i].start).format('YYYY-MM-DD'));
                this.events[i].end = moment(list[i].end).format('YYYY-MM-DD');
                this.events[i].allDay = true;
            }
        }
        setTimeout(() => {
            let calendarView = this.calendar.getApi();
            calendarView.render();
        }, 100);
    }

    /**
     * Method to get day of the week from a given date
     * @param {*} date
     * @returns
     * @memberof CalendarViewComponent
     */
    getWeekDay(date) {
        //Create an array containing each day, starting with Sunday.
        const weekdays = new Array(
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        );
        //Use the getDay() method to get the day.
        const day = date.getDay();
        //Return the element that corresponds to that index.
        return weekdays[day];
    }

}
