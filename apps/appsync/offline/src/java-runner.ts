import { Context } from 'aws-lambda';

const JavaRunner = require('serverless-offline/dist/lambda/handler-runner/java-runner/JavaRunner');

export const handler = async (event: any, context: Context, callback: any) => {
  const funOptions = {
    functionName: process.env['func_name'],
    handler: process.env['func_handler'],
    servicePackage: process.env['servicePackage'],
  };
  const javaRunner = new JavaRunner.default(funOptions, process.env, true);
  context.functionName = process.env['func_name'];
  const result = await javaRunner.run(event, context);
  console.log('Java runner event:', event);
  return callback(null, result);
};
