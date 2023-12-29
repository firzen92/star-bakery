import { Component, OnInit } from "@angular/core";
import { ConfigService } from "src/shared/config.service";
import { Order } from "src/shared/orders.model";


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