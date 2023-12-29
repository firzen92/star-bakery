import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from './orders.model';

@Injectable({providedIn: 'root'})

export class ConfigService {

    constructor(private http: HttpClient) { }

    getAllOrderDetails(): Observable<Order[]> {
        return this.http.get<Order[]>('http://localhost:3000/api/orders');
    }
    
}