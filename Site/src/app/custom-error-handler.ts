import {ErrorHandler, Injectable} from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';
import * as Raven from 'raven-js';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
    constructor() {}
    handleError(error) {
        Raven.captureException(error);        
    }
}