import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneFormat' })
export class PhoneFormat implements PipeTransform {
    transform(val: number) {
        if (val === undefined) { return ''; }
        let rawNumber = (val === undefined) ||
                          (val === null) ? '' : val.toString();
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
}
