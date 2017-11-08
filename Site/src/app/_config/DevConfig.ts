import { FactoryProvider  } from '@angular/core';

export class AppConfiguration {

    constructor () {
        const config = {
            baseUrl: ''
        };
        config.baseUrl = 'http://localhost:56543/odata';
        return config;
    }
}
