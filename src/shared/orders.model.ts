export interface Order {
    itemType: string;
    orderState: string;
    lastUpdateTime: Date;
    branch: number;
    customer: string;
    totalValue: number;
}

export interface DisplayData {
    time: Date;
    value: any
}

export type TimeSelection = 'hour' | 'day' | 'week' | 'month';  

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];