import { FactoryProvider  } from '@angular/core';
import { ODataConfiguration } from 'angular-odata-es5';

export class AppConfiguration {

    constructor () {
        const config = new ODataConfiguration();
        config.baseUrl = 'http://localhost:56543/odata';
        return config;
    }
}
