import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

import { OrdersNoTimeSeriesComponent } from 'src/layout/orders-no-time-series/orders-no-time-series.component';
import { OrdersValueTimeSeriesComponent } from 'src/layout/orders-value-time-series/orders-value-time-series.component';
import { BarChartOrderTypeComponent } from 'src/layout/bar-chart-order-type/bar-chart-order-type.component';
import { BarChartOrderStateComponent } from 'src/layout/bar-chart-order-state/bar-chart-order-state.component';
import { TimeSelectorComponent } from 'src/layout/time-selector/time-selector.component';
import { HeaderStarComponent } from 'src/layout/header/header-star.component';

@NgModule({
  declarations: [
    AppComponent,
    OrdersNoTimeSeriesComponent,
    OrdersValueTimeSeriesComponent,
    BarChartOrderTypeComponent,
    BarChartOrderStateComponent,
    TimeSelectorComponent,
    HeaderStarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
