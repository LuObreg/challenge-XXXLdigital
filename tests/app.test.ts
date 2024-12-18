import request from 'supertest';
import { app } from '../source/app';

describe('POST /validate', () => {
    it('should return 200 if the UID is valid for Switzerland', async () => {
        const response = await request(app)
            .post('/validate')
            .send({ countryCode: 'CH', uid: 'CHE-116.281.710' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('validated', true);
    });

    it('should return 400 if the UID is invalid for Switzerland (invalid regex)', async () => {
        const response = await request(app)
            .post('/validate')
            .send({ countryCode: 'CH', uid: 'C-123.456.789' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Bad Request');
    });

    it('should return 200 if the UID is invalid for Switzerland (but matching regex)', async () => {
        const response = await request(app)
            .post('/validate')
            .send({ countryCode: 'CH', uid: 'CHE-123.456.789' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('validated', false);
    });

    it('should return 200 if the UID doesnt exist for EU (Germany)', async () => {
        const response = await request(app)
            .post('/validate')
            .send({ countryCode: 'DE', uid: 'DE325114412' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('validated', false);
    });

    it('should return 501 if country is not supported (country not found)', async () => {
        const response = await request(app)
            .post('/validate')
            .send({ countryCode: 'XX', uid: 'as' });

        expect(response.status).toBe(501);
        expect(response.body).toHaveProperty('message', 'Not Implemented');
    });

    it('should return 400 if the request format is invalid (wronf countryCode format)', async () => {
        const response = await request(app)
            .post('/validate')
            .send({ countryCode: 'CHE', uid: '123456789' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'countryCode must be exactly 2 characters long. ');
    });

    it('should return 400 if the body is invalid (countryCode is empty)', async () => {
        const response = await request(app)
            .post('/validate')
            .send({ countryCode: '', uid: '' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'countryCode must be exactly 2 characters long. ');
    });
});
