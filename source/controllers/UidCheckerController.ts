import { Configuration } from "../models/ConfigurationModel";
import { countryCodeCatalogue } from '../documents/countryCodeCatalogue.js';
import SwissService from "../services/SwissService.js";
import EuropeService from "../services/EuropeService.js";

export default class UidCheckerController {
  configuration: Configuration;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
  }

  // 1. check if it exists
  // 2. check if its valid
  // 3. check if its CH
  // 4. check in its own service

  checkCountryCode(code: string, uid: string){
    try {
      const obj = countryCodeCatalogue.find(entry => entry.countryCode === code);
      if(!obj){
        throw new Error('bad_request')
      }
      const regex = new RegExp(obj.regex);
      const isValid = regex.test(uid);
      if(!isValid){
        throw new Error('not_implemented');
      }
      return {code, uid}
    } catch (error) {
      throw error;
    }
  }

  isSwiss(code: string): boolean{
    return code == 'CH' ? true : false;
  }

  async processCountryCode(code: string, uid: string){
    try {
      this.checkCountryCode(code, uid);
      let isSwiss = this.isSwiss(code);
      const {euServiceURL, switzerlandServiceURL} = this.configuration.services;
      return await isSwiss ? SwissService.checkCode(switzerlandServiceURL, uid) : EuropeService.checkCode(euServiceURL, uid, code);
    } catch (error) {
      throw error;
    }
  }
}
