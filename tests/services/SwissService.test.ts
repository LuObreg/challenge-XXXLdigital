import SwissService from '../../source/services/SwissService';

global.fetch = jest.fn();

describe('SwissService', () => {
    it('should return the response text when the request is successful', async () => {
        const mockResponse = '<s:Envelope>...</s:Envelope>';
        (fetch as jest.Mock).mockResolvedValueOnce({
            text: jest.fn().mockResolvedValue(mockResponse),
        });

        const result = await SwissService.checkCode('http://example.com', 'CHE-123.456.789');
        expect(result).toBe(mockResponse);
    });

    it('should throw an error when the fetch fails', async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

        await expect(SwissService.checkCode('http://example.com', 'CHE-123.456.789')).rejects.toThrow('service_error');
    });
});
