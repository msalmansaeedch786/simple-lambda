#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable security/detect-child-process */
/* eslint-disable no-process-exit */

const { execSync } = require('child_process');
const { unlinkSync } = require('fs');
const path = require('path');
const commander = require('commander');
const appPackage = require('../package.json');

// Get stack name from package.json
let stackName = appPackage.name;

// Get AWS Profile from environment variables
const defaultProfile = process.env.AWS_PROFILE || 'default';

// Create command to get parameters from cmd
commander
  .description(`Tests, builds, packages, and deploys the ${stackName} CloudFormation stack.`)
  .option('--env <environment>', 'Environment to deploy to.', process.env.ENV)
  .option('--s3-bucket <name>', 'S3 bucket where deployment artifacts are uploaded to.', process.env.S3_BUCKET)
  .option('--profile <name>', `Name of the AWS CLI profile to use with the script, default='${defaultProfile}'.`, defaultProfile)
  .parse(process.argv);

// If no environment was provided print the usage and exit
if (!commander.env) {
  console.error('\nERROR: --env option or ENV environment variable are required!\n');
  commander.description(null);
  commander.outputHelp();
  process.exit(1);
}

// If no S3 bucket was provided print the usage and exit
if (!commander.s3Bucket) {
  console.error('\nERROR: --s3-bucket option or S3_BUCKET environment variable are required!\n');
  commander.description(null);
  commander.outputHelp();
  process.exit(1);
}

// Executes the command. If error occurs outputs the error message and exits with error code.
function exec(args, errorMessage) {
  try {
    // Setup stdio to output to caller, this allows the output to stream as it happens
    execSync(args.join(' '), { stdio: 'inherit' });
  } catch (err) {
    console.error(`\n${errorMessage}\n`);
    process.exit(err.code);
  }
}

// Use npm test to unit test the Lambda
exec(['npm', 'test'], 'Unit tests failed!');

// Use SAM build to build the package
exec(['sam', 'build', '--manifest', 'package.json'], 'SAM build failed!');

// Remove the README.md and package.json files, they don't need to be deployed.
let buildDir = path.resolve(process.cwd(), '.aws-sam/build/SimpleLambdaFunction');
try {
    console.log('Removing README.md from build package');
    unlinkSync(path.resolve(buildDir, 'README.md'));
    console.log('Removing package.json from build package');
    unlinkSync(path.resolve(buildDir, 'package.json'));
} catch(err) {
    // Ignore any error, not critical
}

// Use SAM package to package the deployment artifact and save to the specified S3 bucket
exec(['sam', 'package', '--output-template-file', 'packaged.yaml', '--s3-bucket', commander.s3Bucket, '--profile', commander.profile], 'SAM package failed!');

// Use SAM deploy to deploy the stack
stackName = stackName + '-' + commander.env;
let environmentParam = 'Environment=' + commander.env;
let deployArgs = ['sam', 'deploy', '--stack-name', stackName, '--template-file', 'packaged.yaml',
    '--capabilities', 'CAPABILITY_IAM', '--parameter-overrides', environmentParam, '--profile', commander.profile];
exec(deployArgs, `SAM deploy of ${stackName} stack failed!`);
