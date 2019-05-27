import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatList } from '@angular/material/list';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

    public buttonOneFill: string = 'outline';
    public buttonTwoFill: string = 'clear';
    public buttonThreeFill: string = 'clear';
    public showAllUpdates: boolean = true;
    public showMyRecent: boolean = false;
    public showAnnouncement: boolean = false;
    public showDot: boolean = true;
    public showViewMore: boolean;
    public clickOnViewMore: boolean;
    @ViewChild('matList', { read: ElementRef }) private matList: ElementRef;
    @ViewChild('matCard', { read: ElementRef }) private matCard: ElementRef;


    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        const listHeight = this.matList.nativeElement.offsetHeight;
        const cardHeight = this.matCard.nativeElement.offsetHeight;
        console.log(listHeight);
        console.log(cardHeight);
        if (listHeight == 160) {
            this.showViewMore = true;
        }
    }

    buttonClick(value: number) {
        if (value === 1) {
            this.buttonOneFill = 'outline';
            this.buttonTwoFill = 'clear';
            this.buttonThreeFill = 'clear';
            this.showAllUpdates = true;
            this.showMyRecent = false;
            this.showAnnouncement = false;
        } else if (value === 2) {
            this.buttonOneFill = 'clear';
            this.buttonTwoFill = 'outline';
            this.buttonThreeFill = 'clear';
            this.showAllUpdates = false;
            this.showMyRecent = true;
            this.showAnnouncement = false;
        } else {
            this.buttonOneFill = 'clear';
            this.buttonTwoFill = 'clear';
            this.buttonThreeFill = 'outline';
            this.showAllUpdates = false;
            this.showMyRecent = false;
            this.showAnnouncement = true;
            this.showDot = false;
        }
    }

}