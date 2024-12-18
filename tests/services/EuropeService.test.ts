import EuropeService from '../../source/services/EuropeService';

global.fetch = jest.fn();

describe('EuropeService', () => {
    it('should return JSON data when the request is successful', async () => {
        const mockResponse = { valid: true };
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue(mockResponse),
        });

        const result = await EuropeService.checkCode('http://example.com', 'VAT-123456', 'DE');
        expect(result).toEqual(mockResponse);
    });

    it('should throw an error when the fetch fails', async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

        await expect(EuropeService.checkCode('http://example.com', 'VAT-123456', 'DE')).rejects.toThrow('service_error');
    });
});