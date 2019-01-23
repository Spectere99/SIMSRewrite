import {ErrorHandler, Injectable} from '@angular/core';
import { InjectSetupWrapper } from '@angular/core/testing';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
    constructor() {}
    handleError(error) {
        console.log(error);
    }
}