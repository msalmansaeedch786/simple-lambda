# simple-lamda-api
This repo contains everything needed to build, test, and deploy a simple REST endpoint in AWS.

## Simple-Lambda Architecture
The architecture is based on the AWS API Gateway and a Lambda function.  While the architecture may seem very simple, 
it is serverless and can easily support millions of users without the need to scale or manage any infrastructure on AWS.
Additionally, it is extremely cost-effective, as AWS provides 1,000,000 free invocations per month.  

![Simple-Lambda Architecture](docs/simple-lambda-architecture.png)

(Based on [AWS Architecture Icons 2019](https://aws.amazon.com/architecture/icons/)

___

## The AWS Serverless Application Model (SAM)
The [AWS Serverless Application Model (SAM)](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/)
is an open-source framework that can be used to build serverless applications on AWS.  SAM is basically an extension of
AWS CloudFormation that makes it very straight forward to develop, debug, build and deploy serverless applications.
SAM provides the following:  
* Single-deployment configuration
* Extension of AWS CloudFormation
* Built-in best practices
* Local debugging and testing

SAM is used in all aspects of the SDLC of this project.

___

## Developer Workstation Set-Up
This project can be maintained and deployed on pretty much any type of developer workstation (Linux, Windows, and macOS) as long as the following are installed:

**Node.js**   
Node.js is required to perform builds and deployments and it is recommended that you have Node.js 10+ installed, though Node.js 8+ will work.  For more information on installing Node.js see [Node.js Downloads](https://nodejs.org/en/download/)

**AWS CLI**  
To use the SAM CLI ensure you have the latest version of the AWS CLI installed and configured on your workstation.  For more information on installing and updating the AWS CLI see [Installing the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)

**SAM CLI**  
The SAM CLI must be installed on your workstation to perform builds and deploys to AWS. For more information see [Installing the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) 

___

## Testing, Building and Deploying the SImple-Lambda
Once you have your developer workstation set up as per above, it is quite simple to test, build, and deploy the Simple-Lambda to AWS.
The only AWS infrastructure prerequisite is a single S3 bucket in your account that is needed to save deployment artifacts to.  Once you have the bucket name, execute the following command line to set up the bucket name in the deployment configuration:
```
npm config set simplelambda:s3Bucket simplelambda-devops
```
**NOTE:** You *must* replace ```simplelambda-devops``` with your bucket name.

You must install the Node.js dev dependencies before anything else can be done.  From the root of this project, execute the following command:
```sh
npm install
```

Once the dev dependencies have been installed, you can test, build, and run the API Gateway run  the Simple-Lambda by executing the following command in the root of this project:
```sh
npm run sam:run-local
``` 

This single command performs the following operations:
 - Source code linting (static analysis)  
 - Code security checks  
 - Unit tests  
 - Code coverage  
 - Building  
 - Runs the lambda locally  

You can test, build, and deploy the Simple-Lambda by  executing the following command in the root of this project:
```sh
npm run test-build-and-deploy
``` 

This command performs the following operations:
 - Source code linting (static analysis)  
 - Code security checks  
 - Unit tests  
 - Code coverage  
 - Building  
 - Packaging  
 - Deployment  

If any operation fails the process will be halted.

Once deployed you can get the URL of the Simple-Lambda-Project REST endpoint by executing the following command:
```sh
npm run apiurl
```
An example output would be:  
[https://mbizs03i21.execute-api.us-east-1.amazonaws.com/Prod/simplelambda/](https://mbizs03i21.execute-api.us-east-1.amazonaws.com/Prod/simplelambda/)
___
## Cleanup (Resource Deletion)
To cleanup a deployment, simply execute the following command, this will delete the CloudFormation stack:
```sh
npm run delete-stack
```
This command will completely delete any and all resources from AWS that were created by the Simple-Lambda deployment.

___

## Additional Info
All the CI/CD operations are also available as single commands.  
  
Linting and security checks:
```sh
npm run lint
```
Unit tests:
```sh
npm test
```
Code coverage (also does linting, security checks, and unit tests):
```sh
npm run coverage
```
Building:
```sh
npm run sam:build
```
Packaging (also uploads code artifact to S3):
```sh
npm run sam:package
```
Deploying: 
```sh
npm run sam:deploy
```
Integration Tests (of deployed stack):
```
npm run integration-test
```

You can also update the [JSDOC documentation](docs/jsdoc/index.html) that is in the ```./docs/jsdoc``` directory:
```sh
npm run docs
```
