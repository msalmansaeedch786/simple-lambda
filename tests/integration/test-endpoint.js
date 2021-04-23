'use strict';

const AWS = require('aws-sdk');
const cloudFormation = new AWS.CloudFormation({ region: process.env.AWS_REGION || 'us-east-1' });

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

var apiUrl;
var maxApiElapsed = 2;

// eslint-disable-next-line no-undef
before(async () => {

    let endpoint = process.env.ENDPOINT;
    if (endpoint !== undefined && endpoint != null) {
        apiUrl = endpoint;
        maxApiElapsed = 4;
    } else {
        const data = await cloudFormation.describeStacks({ StackName: 'simplelambda' }).promise();
        let apiUrlOutput = data.Stacks[0].Outputs.find(stack => stack.OutputKey === 'SimpleLambdaApi');
        if (apiUrlOutput !== null) {
            apiUrl = apiUrlOutput.OutputValue;
        }
    }
});

describe('Test simplelambda endpoint', () => {

    it('verifies successful response for GET', (done) => {

        expect(apiUrl).to.not.be.null;
        const timestamp = Math.floor(new Date() / 1000);
        chai.request(apiUrl)
            .get('')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.message).to.be.equal('NorthBay Labs is Awesome!');
                expect(res.body.timestamp).to.be.closeTo(timestamp, maxApiElapsed);
                done();
            });
    }).timeout(5000);

    it('verifies successful response for POST', (done) => {

        expect(apiUrl).to.not.be.null;
        const timestamp = Math.floor(new Date() / 1000);
        let body = {
            name: 'John Doe'
        };
        chai.request(apiUrl)
            .post('')
            .send(body)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body.message).to.be.equal('John Doe is Awesome!');
                expect(res.body.timestamp).to.be.closeTo(timestamp, maxApiElapsed);
                done();
            });
    }).timeout(5000);

    it('verifies forbidden response', (done) => {

        expect(apiUrl).to.not.be.null;
        chai.request(apiUrl)
            .get('/i-dont-exist')
            .end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
    });
});
