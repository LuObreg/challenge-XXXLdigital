import { Request, Response, NextFunction } from 'express';
import { validateRequest, router } from '../../source/routers/UidValidatorRouter';
import { z } from 'zod';
import { Configuration } from '../../source/models/ConfigurationModel';

const schema = z.object({
    countryCode: z.string().length(2, { message: 'must be exactly 2 characters long. ' }),
    uid: z.string()
}).strict();

describe('validateRequest middleware', () => {
    it('should return error response for invalid request body', () => {
        const req = { body: { countryCode: 'CHE', uid: 'CHE-123.456.789' } } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        const middleware = validateRequest(schema);
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            code: 'bad_request',
            message: 'countryCode must be exactly 2 characters long. ',
        });
    });

    it('should call next for valid request body', () => {
        const req = { body: { countryCode: 'CH', uid: 'CHE-123.456.789' } } as Request;
        const res = {} as Response;
        const next = jest.fn() as NextFunction;

        const middleware = validateRequest(schema);
        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });
});

jest.mock('../../source/controllers/UidValidatorController');
jest.mock('../../source/documents/errorCatalogue', () => ({
    errorCatalogue: [{ code: 'bad_request', statusCode: 400, message: 'Invalid request' }]
}));

describe('UidValidatorRouter', () => {
    it('should call next() when valid request is passed', async () => {
        const mockConfiguration = {} as Configuration;
        const req = { body: { countryCode: 'CH', uid: 'CHE-123.456.789' } } as Request;
        const res = {} as Response;
        const next = jest.fn() as NextFunction;
    
        const expressRouter = router(mockConfiguration);
    
        const middleware = expressRouter.stack.find(layer => layer.route?.path === '/validate')?.route?.stack[0].handle;
        if (middleware) {await middleware(req, res, next);}
    
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return error response for invalid request', async () => {
        const mockConfiguration = {} as Configuration;
        const req = { body: { countryCode: 'CHE', uid: 'CHE-123.456.789' } } as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        const next = jest.fn() as NextFunction;
    
        const expressRouter = router(mockConfiguration);

        const middleware = expressRouter.stack.find(layer => layer.route?.path === '/validate')?.route?.stack[0].handle;
        if (middleware) {await middleware(req, res, next);}

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            code: 'bad_request',
            message: 'countryCode must be exactly 2 characters long. '
        });
    });
});
