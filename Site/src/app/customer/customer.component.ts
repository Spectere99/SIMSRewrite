import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
dataSource: any;

  constructor() {
    this.CreateCustomerDataSource();
   }

  CreateCustomerDataSource() {
    this.dataSource = {
      store: {
          type: 'odata',
          url: 'http://localhost:56543/odata/customers'
      },
      expand: ['customer_person', 'customer_address'],
      select: [
        'customer_id',
        'customer_name',
        'setup_date',
        'setup_by',
        'status_code',
        'ship_to_bill_ind',
        'website_url',
        'account_number',
        'override_validation_ind',
        'parent_id',
        'parent_ind',
        'customer_person/first_name',
        'customer_person/last_name',
        'customer_person/phone_1',
        'customer_person/phone_2',
        'customer_address/address_1',
        'customer_address/city',
        'customer_address/state',
        'customer_address/zip',
      ],
      //  filter: ['customer_address/type_code', '=', 'bill']
       // filter: ['order_date', '>', this.filterDate]
   };
  }

  showEditPopup(e) {
    e.cancel = true;
    console.log('e:', e);
    alert('Editing!');
  }

  buildCustomerFirstName(data) {
    if (data.customer_person !== undefined) {
      return [data.customer_person.first_name, data.customer_person.last_name].join(' ');
    }
    return '';
  }


  buildPhoneNumber1(data) {
        // console.log('columnValue:', data.customer_person.phone_1);
        if (data.customer_person === undefined) { return ''; }
        let rawNumber = (data.customer_person.phone_1 === undefined) || (data.customer_person.phone_1 === null) ? '' : data.customer_person.phone_1.toString();
        // console.log('rawNumber:', rawNumber);
        rawNumber = String(rawNumber);
        rawNumber = rawNumber.replace(/[^0-9]*/g, '');
        let formattedNumber = rawNumber;
        const c = (rawNumber[0] === '1') ? '1' : '';
        rawNumber = rawNumber[0] === '1' ? rawNumber.slice(1) : rawNumber;
        const area = rawNumber.substring(0, 3);
        const front = rawNumber.substring(3, 6);
        const end = rawNumber.substring(6, 10);
        if (front) {
          formattedNumber = (c + '(' + area + ') ' + front);
        }
        if (end) {
          formattedNumber += ('-' + end);
        }
        return formattedNumber;
  }

  buildPhoneNumber2(data) {
      if (data.customer_person === undefined) { return ''; }
      let rawNumber = (data.customer_person.phone_2 === undefined) || (data.customer_person.phone_2 === null) ? '' : data.customer_person.phone_2.toString();
      // console.log('rawNumber:', rawNumber);
      rawNumber = String(rawNumber);
      rawNumber = rawNumber.replace(/[^0-9]*/g, '');
      let formattedNumber = rawNumber;
      const c = (rawNumber[0] === '1') ? '1' : '';
      rawNumber = rawNumber[0] === '1' ? rawNumber.slice(1) : rawNumber;
      const area = rawNumber.substring(0, 3);
      const front = rawNumber.substring(3, 6);
      const end = rawNumber.substring(6, 10);
      if (front) {
        formattedNumber = (c + '(' + area + ') ' + front);
      }
      if (end) {
        formattedNumber += ('-' + end);
      }
    return formattedNumber;
  }
  ngOnInit() {
  }

}
