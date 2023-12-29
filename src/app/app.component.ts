import { Component, OnInit, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { ConfigService } from "src/shared/config.service";
import { Order } from "src/shared/orders.model";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  isLoading = true;

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.configService.getAllOrderDetails().subscribe((res: Order[]) => {
      this.configService.dataSeries = res;
      this.isLoading = false;
    }, err => {
      console.warn(err);
      this.isLoading = false;
    });
  }

}