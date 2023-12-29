import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from './orders.model';

@Injectable({providedIn: 'root'})

export class ConfigService {

    private _dataSeries: Order[];

    constructor(private http: HttpClient) { }

    getAllOrderDetails(): Observable<Order[]> {
        return this.http.get<Order[]>('http://localhost:3000/api/orders');
    }
    
    get dataSeries() {
        return [...this._dataSeries];
    }

    set dataSeries(data: Order[]) {
        this._dataSeries = [...data];
    }

}