import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from 'src/shared/config.service';
import { DisplayData, MONTHS, Order, TimeSelection } from 'src/shared/orders.model';
import * as d3 from 'd3';

@Component({
    selector: 'orders-value-time-series',
    templateUrl: './orders-value-time-series.component.html',
    styleUrls: ['./orders-value-time-series.component.scss']
})


export class OrdersValueTimeSeriesComponent implements AfterViewInit {

    dataSeries: Order[];
    dataDisplaySeries: DisplayData[];
    selectedTime: TimeSelection = 'hour';
    isLoading = false;

    @ViewChild('ordersValue') ordersValue: ElementRef;
    constructor(private configService: ConfigService) { }

    ngAfterViewInit() {
        this.dataSeries = [...this.configService.dataSeries];
        this.clickHandler(this.selectedTime);
    }

    createGraph(data: DisplayData[]) {
        this.ordersValue.nativeElement.innerHTML = '';

        const width = window.innerWidth;
        let totalWidth = width * 2;
        if (this.selectedTime === 'day') {
            totalWidth = width;
        } else if (this.selectedTime === 'hour') {
            totalWidth = width * 20;
        } else if (this.selectedTime === 'month') {
            totalWidth = width / 4;
        } else if (this.selectedTime === 'week') {
            totalWidth = width / 4;
        }

        const height = 420;
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 30;
        const marginLeft = 50;

        const x = d3.scaleUtc()
            .domain(d3.extent(data, (d: DisplayData) => d.time) as any)
            .range([marginLeft, totalWidth - marginRight]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value) as any]).nice(6)
            .range([height - marginBottom, marginTop]);

        const area = d3.area()
            .curve(d3.curveStep)
            .x((d: any) => x(d.time))
            .y0(y(0))
            .y1((d: any) => y(d.value));

        const parent = d3.select('#orders_value_time_series');

        parent.append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("z-index", 1)
            .append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(6))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Sales INR"));

        const body = parent.append("div")
            .style("overflow-x", "scroll")
            .style("-webkit-overflow-scrolling", "touch");

        const svg = body.append("svg")
            .attr("width", totalWidth)
            .attr("height", height)
            .style("display", "block");

        const axisX = svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)

        if (this.selectedTime === 'day') {
            axisX.call(d3.axisBottom(x).ticks(d3.utcDay.every(1)).tickSizeOuter(0));
        } else if (this.selectedTime === 'hour') {
            axisX.call(d3.axisBottom(x).ticks(d3.utcHour.every(1)).tickSizeOuter(0));
        } else if (this.selectedTime === 'month') {
            axisX.call(d3.axisBottom(x).ticks(d3.utcMonth.every(1)).tickSizeOuter(0));
        } else if (this.selectedTime === 'week') {
            axisX.call(d3.axisBottom(x).ticks(d3.utcWeek.every(1)).tickSizeOuter(0));
        }

        svg.append("path")
            .datum(data)
            .attr("fill", "#9c88d4")
            .attr("d", area as any);

        (<any>body).node().scrollBy(totalWidth, 0);

        this.isLoading = false;
    }

    clickHandler(flag: TimeSelection) {
        this.isLoading = true;
        // create an empty Map, the key will hold the time and value will be the summation of total value that we got
        let dataMap = new Map();

        this.selectedTime = flag;
        // minimumDate and maximumDate for Weekly and Hourly
        let minimumDate = this.dataSeries.reduce((acc, curr) => {
            if (acc > new Date(curr.lastUpdateTime))
                return new Date(curr.lastUpdateTime);
            else
                return acc;
        }, new Date());
        let maximumDate = this.dataSeries.reduce((acc, curr) => {
            if (acc < new Date(curr.lastUpdateTime))
                return new Date(curr.lastUpdateTime);
            else
                return acc;
        }, new Date());

        let now = new Date().getTime();

        switch (flag) {
            case 'day':
                this.dataSeries.forEach(row => {
                    const updateTime = new Date(row.lastUpdateTime);
                    // key will be in the form of 2021-10-22
                    const formatDate = `${updateTime.getUTCFullYear()}-${updateTime.getUTCMonth() + 1}-${updateTime.getUTCDate()}`;

                    if (dataMap.has(formatDate)) {
                        const val = dataMap.get(formatDate);
                        dataMap.set(formatDate, val + row.totalValue);
                    } else {
                        dataMap.set(formatDate, row.totalValue);
                    }
                });
                this.dataDisplaySeries = [];
                for (const [key, value] of dataMap.entries()) {
                    this.dataDisplaySeries.push({
                        time: new Date(key),
                        value: value
                    });
                }
                break;
            case 'hour':
                let now1 = new Date().getTime();
                while (minimumDate < maximumDate) {
                    dataMap.set([minimumDate, new Date(minimumDate.getTime() + 6 * 6 * 1e5)], 0);
                    minimumDate = new Date(minimumDate.getTime() + 6 * 6 * 1e5);
                }

                let i = 0;
                for (const key of dataMap.keys()) {
                    while (i < this.dataSeries.length && key[0] <= new Date(this.dataSeries[i].lastUpdateTime) && new Date(this.dataSeries[i].lastUpdateTime) <= key[1]) {
                        dataMap.set(key, +dataMap.get(key) + this.dataSeries[i].totalValue);
                        i++;
                    }
                }
            

                this.dataDisplaySeries = [];
                for (const [key, value] of dataMap.entries()) {
                    this.dataDisplaySeries.push({
                        time: new Date(key[1]),
                        value: value
                    });
                }

                break;
            case 'month':
                this.dataSeries.forEach(row => {
                    const updateTime = new Date(row.lastUpdateTime);
                    // key will be in the form of 2021-10-01, here we are only concerned about year and month
                    const formatDate = `${updateTime.getUTCFullYear()}-${updateTime.getUTCMonth() + 1}-01`;

                    if (dataMap.has(formatDate)) {
                        const val = dataMap.get(formatDate);
                        dataMap.set(formatDate, val + row.totalValue);
                    } else {
                        dataMap.set(formatDate, row.totalValue);
                    }
                });
                this.dataDisplaySeries = [];
                for (const [key, value] of dataMap.entries()) {
                    this.dataDisplaySeries.push({
                        time: new Date(key),
                        value: value
                    });
                }
                break;
            case 'week':
                while (minimumDate < maximumDate) {
                    dataMap.set([minimumDate, new Date(minimumDate.getTime() + 6 * 6 * 24 * 7 * 1e5)], 0);
                    minimumDate = new Date(minimumDate.getTime() + 6 * 6 * 24 * 7 * 1e5);
                }
                this.dataSeries.forEach(row => {
                    for (const key of dataMap.keys()) {
                        if (key[0] <= new Date(row.lastUpdateTime) && new Date(row.lastUpdateTime) <= key[1]) {
                            dataMap.set(key, +dataMap.get(key) + row.totalValue);
                            break;
                        }
                    }
                });
                this.dataDisplaySeries = [];
                for (const [key, value] of dataMap.entries()) {
                    this.dataDisplaySeries.push({
                        time: new Date(key[1]),
                        value: value
                    });
                }
                break;
        }
        let later = new Date().getTime();
        console.log((later - now)/1000);
        this.createGraph(this.dataDisplaySeries);
    }
}