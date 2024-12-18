import UidValidatorController from '../../source/controllers/UidValidatorController';
import { Configuration } from '../../source/models/ConfigurationModel';
import SwissService from '../../source/services/SwissService';
import EuropeService from '../../source/services/EuropeService';

jest.mock('../../source/services/SwissService');
jest.mock('../../source/services/EuropeService');
const mockConfiguration: Configuration = {
    port: 3000,
    expressServerOptions: {
        keepAliveTimeout: 5000,
        maxHeadersCount: 100,
        timeout: 120000,
        maxConnections: 100,
        headersTimeout: 10000,
        requestTimeout: 5000
    },
    services: {
        euServiceURL: 'http://EU',
        switzerlandServiceURL: 'http://CH'
    }
};
  
describe('UidValidatorController', () => {
    let controller: UidValidatorController;
  
    beforeEach(() => {
        controller = new UidValidatorController(mockConfiguration);
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
        expect(() => controller.checkCountryCode('XX', '12345')).toThrow('not_implemented');
    });
    
    it('should throw error if country code is valid and uid is invalid', () => {
        expect(() => controller.checkCountryCode('DE', 'A')).toThrow('bad_request');
    });
    
    it('should throw error if country code is valid and uid is invalid', async () => {
        await expect(controller.processCountryCode('IT', 'invalid_uid')).rejects.toThrow('bad_request');
    });
      
    it('should call SwissService for CH code', async () => {
        const checkCodeMock = jest.fn().mockResolvedValue('<response>false</response>');
        SwissService.checkCode = checkCodeMock;
        const result = await controller.processCountryCode('CH', 'CHE-123.456.789');
            
        expect(checkCodeMock).toHaveBeenCalledWith('http://CH', 'CHE-123.456.789');
        expect(result.validated).toBe(false);
    });      
    
    it('should call EuropeService for EU code', async () => {
        (EuropeService.checkCode as jest.Mock).mockResolvedValue({ valid: true });
        const result = await controller.processCountryCode('DE', 'DE123456789');
        expect(EuropeService.checkCode).toHaveBeenCalledWith('http://EU', 'DE123456789', 'DE');
        expect(result.validated).toBe(true);
    });
    
    it('should return false for invalid Swiss response', async () => {
        (SwissService.checkCode as jest.Mock).mockResolvedValue('<response>false</response>');
        const result = await controller.processCountryCode('CH', 'CHE-123.456.789');
        expect(result.validated).toBe(false);
    });
    
    it('should return false for invalid EU response', async () => {
        (EuropeService.checkCode as jest.Mock).mockResolvedValue({ valid: false });
        const result = await controller.processCountryCode('DE', 'DE123456789');
        expect(result.validated).toBe(false);
    });
    
    it('should evaluate Swiss response correctly', async () => {
        const mockSwissResponse = '<response>true</response>';
        jest.spyOn(controller, 'processSwissRes').mockResolvedValue(true);
    
        const result = await controller.evaluateResponse(mockSwissResponse, true);
        expect(result.validated).toBe(true);
        expect(result.details).toBe('UID is valid for the given country code');
    });
    
    it('should evaluate EU response correctly', () => {
        const mockEUResponse = { valid: true };
        const result = controller.processEURes(mockEUResponse);
        expect(result).toBe(true);
    });
    it('should throw an error if the Swiss service fails', async () => {
        const checkCodeMock = jest.fn().mockRejectedValue(new Error('service_error'));
        SwissService.checkCode = checkCodeMock;
        await expect(controller.processCountryCode('CH', 'CHE-123.456.789')).rejects.toThrow('service_error');
    });
    it('should handle invalid SOAP response format', async () => {
        const checkCodeMock = jest.fn().mockResolvedValue('<invalid><response></response>');
        SwissService.checkCode = checkCodeMock;
        await expect(controller.processCountryCode('CH', 'CHE-123.456.789')).rejects.toThrow('service_error');
    });
    it('should process valid Swiss SOAP response correctly', async () => {
        const checkCodeMock = jest.fn().mockResolvedValue('<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><ValidateUIDResponse xmlns="http://www.uid.admin.ch/xmlns/uid-wse"><ValidateUIDResult>true</ValidateUIDResult></ValidateUIDResponse></s:Body></s:Envelope>');
        SwissService.checkCode = checkCodeMock;
        const result = await controller.processCountryCode('CH', 'CHE-123.456.789');
        expect(result.validated).toBe(true);
    });
  
});