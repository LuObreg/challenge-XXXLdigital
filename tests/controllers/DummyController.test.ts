import DummyController from '../../source/controllers/DummyController';
import { Configuration } from "../../source/models/ConfigurationModel";

const mockConfiguration: Configuration = {
    port: 3000,
    expressServerOptions: {
      keepAliveTimeout: 5000,
      maxHeadersCount: 100,
      timeout: 120000,
      maxConnections: 100,
      headersTimeout: 10000,
      requestTimeout: 5000
    }
  };
  
  describe('DummyController', () => {
    let controller: DummyController;
  
    beforeEach(() => {
      controller = new DummyController(mockConfiguration);
    });
    it('should initialize with given configuration', () => {
        expect(controller.configuration.port).toBe(3000);
        expect(controller.configuration.expressServerOptions.keepAliveTimeout).toBe(5000);
      });

    it('isSwiss should return false for non-CH codes', () => {
        expect(controller.isSwiss('DE')).toBe(false);
      });
      it('isSwiss should return true for CH code', () => {
        expect(controller.isSwiss('CH')).toBe(true);
      });
      it('should return { code, uid } if country code is valid for DE', () => {
        const result = controller.checkCountryCode('DE', 'DE123456789');
        expect(result).toEqual({ code: 'DE', uid: 'DE123456789' });
      });
    
      it('should return { code, uid } if country code is valid for CH', () => {
        const result = controller.checkCountryCode('CH', 'CHE-123.456.789');
        expect(result).toEqual({ code: 'CH', uid: 'CHE-123.456.789' });
      });
    
      it('should throw error if country code is invalid', () => {
        expect(() => controller.checkCountryCode('XX', '12345')).toThrow('bad_request');
      });
    
      it('should throw error if country code is invalid and uid is invalid', () => {
        expect(() => controller.checkCountryCode('DE', 'A')).toThrow('not_implemented');
      });
    
      it('should throw error if country code is not two characters long', () => {
        expect(() => controller.checkCountryCode('DEU', '12345')).toThrow('bad_request');
      });
    
      it('should throw error if country code does not exist', async () => {
        await expect(controller.processCountryCode('ZZ', '12345')).rejects.toThrow('bad_request');
      });
    
      it('should throw error if country code is invalid and uid is invalid', async () => {
        await expect(controller.processCountryCode('IT', 'invalid_uid')).rejects.toThrow('not_implemented')
      });
      it('should resolve true for valid non-Swiss country code and uid', async () => {
        await expect(controller.processCountryCode('IT', 'IT12345678901')).resolves.toBe(true);
      });
      it('should resolve false for Swiss country code and uid', async () => {
        await expect(controller.processCountryCode('CH', 'CHE-123.456.789')).resolves.toBe(false);
      });      
});