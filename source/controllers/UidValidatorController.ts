/* eslint-disable @typescript-eslint/no-explicit-any */
import { Configuration } from '../models/ConfigurationModel';
import { countryCodeCatalogue } from '../documents/countryCodeCatalogue.js';
import SwissService from '../services/SwissService.js';
import EuropeService from '../services/EuropeService.js';
import { parseStringPromise } from 'xml2js';

interface responseObj {
  validated: boolean,
  details: string
};

export default class UidValidatorController {
    configuration: Configuration;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    // 1. check if it exists
    // 2. check if its valid
    // 3. check if its CH
    // 4. check in its own service

    checkCountryCode(code: string, uid: string){
        const obj = countryCodeCatalogue.find(entry => entry.countryCode === code);
        if(!obj){
            throw new Error('not_implemented');
        }
        const regex = new RegExp(obj.regex);
        const isValid = regex.test(uid);
        if(!isValid){
            throw new Error('bad_request');
        }
        return {code, uid};
      
    }

    isSwiss(code: string): boolean{
        return code == 'CH' ? true : false;
    }

    async processCountryCode(code: string, uid: string): Promise<responseObj>{
        this.checkCountryCode(code, uid);
        const isSwiss = this.isSwiss(code);
        const {euServiceURL, switzerlandServiceURL} = this.configuration.services;
        const serviceRes: unknown = isSwiss ? await SwissService.checkCode(switzerlandServiceURL, uid) : await EuropeService.checkCode(euServiceURL, uid, code);
        console.log({serviceRes});
        return await this.evaluateResponse(serviceRes, isSwiss);
       
    }

    async evaluateResponse(response: any, isSwiss: boolean): Promise<responseObj>{
        const valid: boolean= isSwiss ? await this.processSwissRes(response) : this.processEURes(response); 
        return {validated: valid,
            details: valid ? 'UID is valid for the given country code' : 'UID is not valid for the given country code'
        };

    }
    async processSwissRes(res: string): Promise<boolean> {
        try {
            const parsedRes = await parseStringPromise(res);
            const validateResult = parsedRes?.['s:Envelope']?.['s:Body']?.[0]?.['ValidateUIDResponse']?.[0]?.['ValidateUIDResult']?.[0];
    
            if (validateResult !== undefined) {
                return JSON.parse(validateResult);
            }
    
            const faultString = parsedRes?.['s:Envelope']?.['s:Body']?.[0]?.['s:Fault']?.[0]?.['faultstring']?.[0];
            if (faultString) {
                return false;
            }
    
            return false;
        } catch (error) {
            console.log({ error });
            throw new Error('service_error');
        }
    }

    processEURes(res: any): boolean{
        return res?.valid;
    }
}
