'use strict';

// Get the lambda logger and enable log.debug ()
const log = require('lambda-log');

/* istanbul ignore next */
log.options.debug = process.env.LOG_DEBUG === 'true' || false;

const GatewayResponse = require('./libs/aws/gateway-response');
const HEADERS = { 'Content-Type' : 'application/json' };

/**
 * This Lambda function responds with an API Gateway response with the body containing the following JSON:
 * <pre><code>{
 *   "message": ":name is Awesome!",
 *   "timestamp": 1529611161
 * }</code></pre>
 * Where :name is either a query or form parameter and "timestamp" is the
 * current Unix timestamp (seconds since epoch).
 *
 * @param {Object} event - An object in the API Gateway Lambda Proxy Input Format.
 * @returns {Object} object - An object in the API Gateway Lambda Proxy Output Format.
 */
exports.lambdaHandler = async (event) => {

	let httpMethod = event.httpMethod;
	log.info({ message: 'Received simplelambda request', httpMethod });
	log.debug({ event: event });

	var response;
	if (httpMethod === 'GET') {
		response = get(event);
	} else if (httpMethod === 'POST') {
		response = post(event);
	} else {
		response = createGatewayResponse(405, httpMethod + ' HTTP method is not supported!');
	}

	log.info({ message: 'Sending simplelambda response' });
	log.debug({ response: response });
	return (response);
};

/**
 * Creates and returns an API Gateway response.
 *
 * @param {Number} httpStatus - The HTTP status code for the response
 * @param {string} message - The message for the response
 * @returns {Object} - An object in the API Gateway Lambda Proxy Output Format.
 */
function createGatewayResponse(httpStatus, message) {

	let timestamp = Math.floor(new Date() / 1000);
	let body = JSON.stringify({
		message: message,
		timestamp: timestamp
	}, null, 2);

	return (GatewayResponse.createResponse(httpStatus, HEADERS, body, false));
}

/**
 * This method handles an HTTP GET method request.  Takes an optional query parameter of 'name',
 * if name is not provided will default name to 'NorthBay Labs'.
 *
 * @param {Object} event - An object in the API Gateway Lambda Proxy Input Format.
 * @returns {Object} - An object in the API Gateway Lambda Proxy Output Format.
 */
function get(event) {
	let name = (event.queryStringParameters !== null
		? event.queryStringParameters.name : null) || 'NorthBay Labs';
	return (createGatewayResponse(200, name + ' is Awesome!'));
}

/**
 * This method handles an HTTP POST method request.  Expects the body of the request
 * to contain JSON with a name field as follows:
 * <pre><code>
 * {
 *     "name" : "John Doe"
 * }
 * </code></pre>
 *
 * @param {Object} event - An object in the API Gateway Lambda Proxy Input Format.
 * @returns {Object} - An object in the API Gateway Lambda Proxy Output Format.
 */
function post(event) {

	try {
		let params = JSON.parse(event.body);
		if (!params.name) {
			return (createGatewayResponse(400, 'Missing [name] parameter.'));
		} else {
			return (createGatewayResponse(200, params.name + ' is Awesome!'));
		}
	} catch(err) {
		return (createGatewayResponse(400, 'Invalid JSON: ' + err.message));
	}
}
