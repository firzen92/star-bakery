import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ConfigService } from 'src/shared/config.service';
import { Order } from 'src/shared/orders.model';

@Component({
    selector: 'bar-chart-order-state',
    templateUrl: 'bar-chart-order-state.component.html'
})

export class BarChartOrderStateComponent implements AfterViewInit {
    constructor(private configService: ConfigService) { }

    ngAfterViewInit() {
        this.createChart();
    }

    createChart() {
        // set the dimensions and margins of the graph
        var margin = { top: 30, right: 30, bottom: 70, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#bar_order_state")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Parse the Data
        let data = this.configService.dataSeries;
        let dataMap = new Map();
        data.forEach((row: Order) => {
            if (dataMap.has(row.orderState)) {
                let count = +dataMap.get(row.orderState);
                dataMap.set(row.orderState, count + 1);
            } else {
                dataMap.set(row.orderState, 1);
            }
        })

        var objConvert = Array.from(dataMap).map(row => ({
            orderState: row[0],
            total: row[1]
        }))

        // X axis
        var x = d3.scaleBand()
            .range([0, width])
            .domain(objConvert.map(function (d: any) { return d.orderState; }))
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(objConvert, (d: any) => d.total) as any]).nice(10)
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("mybar")
            .data(objConvert)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.orderState) as any; })
            .attr("y", function (d) { return y(d.total); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.total); })
            .attr("fill", "#9c88d4")

    }
}