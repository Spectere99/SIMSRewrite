import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'addressLookup' })
export class AddressLookup implements PipeTransform {
    /* const addressTypes = [
        {char_mod: 'bill', description: 'Billing'},
        {char_mod: 'ship', description: 'Shipping'},
        {char_mod: 'other', description: 'Other'}]; */
    transform(val: string, addressTypes: any[]) {

        if (addressTypes !== undefined) {
            const returnedDesc = addressTypes.filter(p => p.char_mod === val);
            console.log('lookup Desc', returnedDesc);
            if (returnedDesc.length > 0) {
                return returnedDesc[0].description;
            }
        }
        return '';
    }
}
