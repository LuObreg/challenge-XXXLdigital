import { Configuration } from "../models/ConfigurationModel";
import { countryCodeCatalogue } from '../documents/countryCodeCatalogue.js';


export default class DummyController {
  configuration: Configuration;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
  }

  async dummyFunction(dummyValue: boolean): Promise<boolean> {
    this.dummyFunction.toString();
    return dummyValue;
  }
  // 1. check if it exists
  // 2. check if its valid
  // 3. check if its CH
  // 4. continue on its own service

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
}
