'use strict';

/**
 * Creates and returns a response object for the API Gateway per documentation at:<br />
 * {@link https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format|Output Format of a Lambda Function for Proxy Integration}
 *
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {Map<string, string>} - A map containing single value headers for the response.
 * @param {string} body - the content for the response.
 * @param {boolean} base64Encode- specifies whether the body is base64 encoded, optional.
 * @return {Object} A response object for the API Gateway.
 */
function createResponse(statusCode, headers, body, base64Encode) {

	let res = {
		statusCode: statusCode,
		headers: headers
	};

	// If base64Encode is defined and true, base64 encode the body
	if (base64Encode === true) {
		var buff = Buffer.from(body);
		res.body = buff.toString('base64');
		res.isBase64Encoded = true;
	} else {
		res.body = body;
		res.isBase64Encoded = false;
	}

	return (res);
}

module.exports = { createResponse };
