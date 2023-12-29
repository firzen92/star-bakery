import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TimeSelection } from 'src/shared/orders.model';

@Component({
    selector: 'time-selector',
    templateUrl: 'time-selector.component.html',
    styleUrls: ['time-selector.component.scss']
})

export class TimeSelectorComponent implements OnInit {

    selectedTime: TimeSelection = 'hour';
    timeLabels: any[] = [{
        id: 'hour',
        label: 'Hourly'
    }, {
        id: 'day',
        label: 'Daily'
    }, {
        id: 'week',
        label: 'Weekly'
    }, {
        id: 'month',
        label: 'Monthly'
    }];

    @Output() onClick = new EventEmitter<TimeSelection>();

    constructor() { }

    ngOnInit() { }

    onBtnClick(flag: TimeSelection) {
        this.selectedTime = flag;
        this.onClick.emit(flag);
    }
}