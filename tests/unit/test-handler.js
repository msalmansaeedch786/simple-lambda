'use strict';

const app = require('../../simplelambda');
const chai = require('chai');
const expect = chai.expect;

describe('Test simplelambda.lambdaHandler', function () {

    it('verifies successful response for GET without name param', async () => {
        const timestamp = Math.floor(new Date() / 1000);
        const result = await app.lambdaHandler({ httpMethod: 'GET', queryStringParameters: null });

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.isBase64Encoded).to.be.false;
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal('NorthBay Labs is Awesome!');
        expect(response.timestamp).to.be.closeTo(timestamp, 1);
    });

    it('verifies successful response for GET with name param', async () => {
        const timestamp = Math.floor(new Date() / 1000);
        let nameParam = { name : 'John Doe' };
        const result = await app.lambdaHandler({ httpMethod: 'GET', queryStringParameters: nameParam });

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.isBase64Encoded).to.be.false;
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.contain(nameParam.name);
        expect(response.timestamp).to.be.closeTo(timestamp, 1);
    });

    it('verifies successful response for POST with proper data', async () => {
        const timestamp = Math.floor(new Date() / 1000);
        const body = '{ "name": "Jane Doe" }';
        const result = await app.lambdaHandler({ httpMethod: 'POST', body: body });

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.isBase64Encoded).to.be.false;
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal('Jane Doe is Awesome!');
        expect(response.timestamp).to.be.closeTo(timestamp, 1);
    });

    it('verifies error response for POST with missing name field in data', async () => {
        const timestamp = Math.floor(new Date() / 1000);
        const result = await app.lambdaHandler({ httpMethod: 'POST', body: '{}' });

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(400);
        expect(result.isBase64Encoded).to.be.false;
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.contain('Missing [name] parameter');
        expect(response.timestamp).to.be.closeTo(timestamp, 1);
    });

    it('verifies error response for POST with no data', async () => {
        const timestamp = Math.floor(new Date() / 1000);
        const result = await app.lambdaHandler({ httpMethod: 'POST', body: null });

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(400);
        expect(result.isBase64Encoded).to.be.false;
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.contain('Invalid JSON');
        expect(response.timestamp).to.be.closeTo(timestamp, 1);
    });

    it('verifies error response for PUT request', async () => {
        const timestamp = Math.floor(new Date() / 1000);
        const result = await app.lambdaHandler({ httpMethod: 'PUT' });

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(405);
        expect(result.isBase64Encoded).to.be.false;
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.contain('HTTP method is not supported');
        expect(response.timestamp).to.be.closeTo(timestamp, 1);
    });
});
