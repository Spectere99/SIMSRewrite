import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class Order {
    order_id: number;
    customer_id: number;
    order_number: string;
    order_type: string;
    purchase_order: string;
    order_date: string;
    order_due_date: string;
    order_status: string;
    taken_user_id: number;
    assigned_user_id: number;
    est_begin_date: string;
    act_begin_date: string;
    est_complete_date: string;
    act_complete_date: string;
    shipped_date: string;
    subtotal: number;
    tax_rate: string;
    tax_amount: number;
    shipping: number;
    total: number;
    payments: number;
    balance_due: number;
    IMAGE_FILE: string;
    BILL_ADDRESS_1: string;
    BILL_ADDRESS_2: string;
    BILL_CITY: string;
    BILL_STATE: string;
    BILL_ZIP: string;
    SHIP_ADDRESS_1: string;
    SHIP_ADDRESS_2: string;
    SHIP_CITY: string;
    SHIP_STATE: string;
    SHIP_ZIP: string;
    PRIORITY: number;
    PERCENT_COMPLETE: string;
    ship_carrier: null;
    ship_tracking: null;
    previous_order: null;
    reorder_ind: null;
    ship_attn: string;
    contact: string;
    contact_email: string;
    contact_phone1: string;
    contact_phone1_ext: string;
    contact_phone1_type: string;
    contact_phone2: string;
    contact_phone2_ext: string;
    contact_phone2_type: string;
}

export class OrderDetail {
    order_detail_id: number;
    order_id: number;
    item_type: string;
    item_line_number: number;
    item_quantity: number;
    pricelist_id: number;
    style_code: string;
    color_code: string;
    size_code: string;
    vendor: string;
    manufacturer: string;
    product_code: number;
    item_price_each: string;
    item_price_ext: string;
    taxable_ind: string;
    shipping_po: string;
    notes: string;
    checked_in_ind: string;
    checked_out_ind: string;
    xsmall_qty: number;
    small_qty: number;
    med_qty: number;
    large_qty: number;
    xl_qty: number;
    C2xl_qty: number;
    C3xl_qty: number;
    C4xl_qty: number;
    C5xl_qty: number;
    other1_type: number;
    other1_qty: number;
    other2_type: number;
    other2_qty: number;
    other3_type: number;
    other3_qty: number;
    order_number: number;
    customer_name: string;
    garment_order_date: string;
    garment_recvd_date: string;
}

export class OrderArtPlacement {
    order_art_placement_id: number;
    order_id: number;
    art_placement_code: string;
    added_by: string;
    added_date: string;
    colors: string;
    color_codes: string;
    notes: string;
}

export class OrderFee  {
    order_fee_id: number;
    order_id: number;
    fee_line_number: number;
    fee_quantity: number;
    pricelist_id: number;
    fee_price_each: string;
    fee_price_ext: string;
    taxable_ind: string;
    notes: string;
}

export class OrderPayment {
    order_payment_id: number;
    order_id: number;
    payment_date: string;
    payment_type_code: string;
    check_number: string;
    payment_amount: string;
    entered_user_id: number;
}

export class OrderArtFile {
    order_art_id: number;
    order_id: number;
    order_by: number;
    image_file: string;
    art_folder: string;
    note: string;
}

@Injectable()
export class OrderService {
    // private baseURL = 'http://localhost:56543/odata';
    private baseURL = environment.odataEndpoint;
    private artBaseURL = environment.artUploadURL;
    public requestResult: Array<any>;
    public options: string;

    public _ORDER_ACTION = 'orders';
    public _ORDER_DETAIL_ACTION = 'OrderDetails';
    public _ORDER_ART_PLACEMENT_ACTION = 'OrderArtPlacement';
    public _ORDER_FEE_ACTION = 'OrderFees';
    public _ORDER_PAYMENT_ACTION = 'OrderPayments';
    public _ORDER_ART_FILE_ACTION = 'orderartfile';

    constructor( private http: Http ) { }

    private getHeaders(userId) {
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('userid', userId);
        // headers.append('showInactive'; this.showInactive.toString());
        return headers;
    }

    loadOrderData(userId, orderId: number): Observable<any> {
        // Build customer odata Options
        const expandCmd = '?$expand=';
        const expandFields = 'order_detail';
        this.options = '(' + orderId + ')';
        this.options = this.options.concat(expandCmd, expandFields);

        return this.http.get(this.baseURL + this._ORDER_ACTION + this.options, {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    loadArtPlacementData(userId, orderId: number): Observable<any> {
        // Build customer odata Options
        const expandCmd = '?$expand=';
        const expandFields = 'order_art_placement';
        this.options = '(' + orderId + ')';
        this.options = this.options.concat(expandCmd, expandFields);

        return this.http.get(this.baseURL + this._ORDER_ACTION + this.options, {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    loadOrderFeeData(userId, orderId: number): Observable<any> {
        // Build customer odata Options
        const expandCmd = '?$expand=';
        const expandFields = 'order_fees';
        this.options = '(' + orderId + ')';
        this.options = this.options.concat(expandCmd, expandFields);

        return this.http.get(this.baseURL + this._ORDER_ACTION + this.options, {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    loadOrderPaymentData(userId, orderId: number): Observable<any> {
        // Build customer odata Options
        const expandCmd = '?$expand=';
        const expandFields = 'order_payments';
        this.options = '(' + orderId + ')';
        this.options = this.options.concat(expandCmd, expandFields);

        return this.http.get(this.baseURL + this._ORDER_ACTION + this.options, {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    loadOrderArtFileData(userId, orderId: number): Observable<any> {
        // Build customer odata Options
        const expandCmd = '?$expand=';
        const expandFields = 'order_art_file';
        this.options = '(' + orderId + ')';
        this.options = this.options.concat(expandCmd, expandFields);

        return this.http.get(this.baseURL + this._ORDER_ACTION + this.options, {headers: this.getHeaders(userId)})
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

    addOrderInfo(userId, order: Order) {
        console.log('OrderInfo in addOrderInfo', order);
        return this.http.post(this.baseURL + this._ORDER_ACTION, order, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    updateOrderInfo(userId, order: Order) {
        this.options = '(' + order.order_id + ')';
        console.log('OrderInfo in updateOrderInfo', order);
        return this.http.put(this.baseURL + this._ORDER_ACTION + this.options, order, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    deleteOrderInfo(userId, order_id: number) {
        this.options = '(' + order_id + ')';
        console.log('OrderInfo in deleteOrderInfo', order_id);
        return this.http.delete(this.baseURL + this._ORDER_ACTION + this.options, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    addOrderLineItem(userId, lineItem: OrderDetail) {
        console.log('OrderDetail in addOrderLineItem', lineItem);
        return this.http.post(this.baseURL + this._ORDER_DETAIL_ACTION, lineItem, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    updateOrderLineItem(userId, lineItem: OrderDetail) {
        this.options = '(' + lineItem.order_detail_id + ')';
        console.log('OrderDetail in updateOrderLineItem', lineItem);
        return this.http.put(this.baseURL + this._ORDER_DETAIL_ACTION + this.options, lineItem, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    deleteOrderLineItem(userId, order_detail_id: number) {
        this.options = '(' + order_detail_id + ')';
        console.log('OrderDetail ID in deleteOrderLineItem', order_detail_id);
        return this.http.delete(this.baseURL + this._ORDER_DETAIL_ACTION + this.options, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    addOrderArtPlacement(userId, orderArtPlacement: OrderArtPlacement) {
        console.log('OrderArtPlacement in addOrderArtPlacement', orderArtPlacement);
        return this.http.post(this.baseURL + this._ORDER_ART_PLACEMENT_ACTION, orderArtPlacement, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    updateOrderArtPlacement(userId, orderArtPlacement: OrderArtPlacement) {
        this.options = '(' + orderArtPlacement.order_art_placement_id + ')';
        console.log('OrderDetail in updateOrderArtPlacement', orderArtPlacement);
        return this.http.put(this.baseURL + this._ORDER_ART_PLACEMENT_ACTION + this.options, orderArtPlacement
                            , {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    deleteOrderArtPlacement(userId, order_art_placement_id: number) {
        this.options = '(' + order_art_placement_id + ')';
        console.log('OrderArtPlacement ID in deleteOrderArtPlacement', order_art_placement_id);
        return this.http.delete(this.baseURL + this._ORDER_ART_PLACEMENT_ACTION + this.options
                                , {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    addOrderFee(userId, orderFee: OrderFee) {
        console.log('OrderFee in addOrderFee', orderFee);
        return this.http.post(this.baseURL + this._ORDER_FEE_ACTION, orderFee, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    updateOrderFee(userId, orderFee: OrderFee) {
        this.options = '(' + orderFee.order_fee_id + ')';
        console.log('OrderFee in updateOrderFee', orderFee);
        return this.http.put(this.baseURL + this._ORDER_FEE_ACTION + this.options, orderFee, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    deleteOrderFee(userId, order_fee_id: number) {
        this.options = '(' + order_fee_id + ')';
        console.log('OrderFee ID in deleteOrderFee', order_fee_id);
        return this.http.delete(this.baseURL + this._ORDER_FEE_ACTION + this.options, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    addOrderPayment(userId, orderPayment: OrderPayment) {
        console.log('OrderPayment in addOrderPayment', orderPayment);
        return this.http.post(this.baseURL + this._ORDER_PAYMENT_ACTION, orderPayment, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    updateOrderPayment(userId, orderPayment: OrderPayment) {
        this.options = '(' + orderPayment.order_payment_id + ')';
        console.log('OrderPayment in updateOrderPayment', orderPayment);
        return this.http.put(this.baseURL + this._ORDER_PAYMENT_ACTION + this.options, orderPayment, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    deleteOrderPayment(userId, order_payment_id: number) {
        this.options = '(' + order_payment_id + ')';
        console.log('OrderPayment ID in deleteOrderPayment', order_payment_id);
        return this.http.delete(this.baseURL + this._ORDER_PAYMENT_ACTION + this.options, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    // NOTE:  All Art File Actions use a Web API 2.0 back end insted of ODATA
    addOrderArtFile(userId, orderArtFile: OrderArtFile) {
        console.log('OrderArtFile in addOrderArtFile', orderArtFile);
        return this.http.post(this.artBaseURL + '/' + this._ORDER_ART_FILE_ACTION, orderArtFile, {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    updateOrderArtFile(userId, orderArtFile: OrderArtFile) {
        this.options = '(' + orderArtFile.order_art_id + ')';
        console.log('OrderArtFile in updateOrderArtFile', orderArtFile);
        return this.http.put(this.artBaseURL + '/' + this._ORDER_ART_FILE_ACTION + this.options, orderArtFile
                            , {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }
    deleteOrderArtFile(userId, order_art_id: number) {
        this.options = '/?id=' + order_art_id;
        console.log('OrderArtFile ID in deleteOrderArtFile', order_art_id);
        return this.http.delete(this.artBaseURL + '/' + this._ORDER_ART_FILE_ACTION + this.options
                            , {headers: this.getHeaders(userId) })
        .map((res: Response) => {
            // console.log(res.json());
            return res.json();
        });
    }

}
