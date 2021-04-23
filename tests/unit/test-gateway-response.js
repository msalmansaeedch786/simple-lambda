'use strict';

const GatewayResponse = require('../../libs/aws/gateway-response');
const expect = require('chai').expect;

const TEST_MESSAGE = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz 1234567890 <>{}[]!@#$%^&*()';
const TEST_HEADERS = { 'Contnt-Type' : 'application/json', 'Last-Modified' : 'Mon, 25 Jul 2016 04:32:39 GMT' };

describe('Test gateway-response', function () {
    it('verifies plain text response', () => {
        let result = GatewayResponse.createResponse(200, TEST_HEADERS, TEST_MESSAGE, false);

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.isBase64Encoded).to.be.false;
        expect(result.headers).to.be.eql(TEST_HEADERS);
        expect(result.body).to.be.an('string');
        expect(result.body).to.be.equal(TEST_MESSAGE);
    });

    it('verifies base64 response', () => {

        if (process.env.FAIL_COVERAGE) {
            return;
        }

        let result = GatewayResponse.createResponse(201, {}, TEST_MESSAGE, true);

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(201);
        expect(result.isBase64Encoded).to.be.true;
        expect(result.body).to.be.an('string');
        expect(result.headers).to.be.eql({});

        let buff = Buffer.from(result.body, 'base64');
        let message = buff.toString('ascii');
        expect(message).to.be.equal(TEST_MESSAGE);
    });
});
