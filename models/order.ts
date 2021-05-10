import moment from 'moment';

import { CartItem } from './cartItem';

export class Order {
    constructor(
        readonly id: string,
        public items: CartItem[],
        public totalAmount: number,
        private _date: Date
    ) {}

    get date(): string {
        return moment(this._date).format('MMMM Do YYYY, hh:mm');
    }
}