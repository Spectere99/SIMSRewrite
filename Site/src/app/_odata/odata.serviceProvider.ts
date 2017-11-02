import { Http } from '@angular/http';

import { ODataService } from './odata.service';

export function provideODataService(url: string) {
    return {
        provide: ODataService, useFactory: (http) => {
            return new ODataService(url, http);
        },
        deps: [Http]
    };
}
