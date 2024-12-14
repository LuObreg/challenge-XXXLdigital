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
  checkCountryCode(code: string, uid: string){
      const obj = countryCodeCatalogue.find(entry => entry.countryCode === code);
      if(!obj){
        console.log('country not found');
        return {code, uid}
      }
      console.log(obj)
      const regex = new RegExp(obj.regex);
      return regex.test(uid);
  }
}
