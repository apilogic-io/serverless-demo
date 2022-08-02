import { Context } from 'aws-lambda';
import { StepFunctions } from 'aws-sdk';
import { spawnSync } from 'child_process';

const invokeServerlessOffline = (lcpName, event) => {
  return event.Records.map((record) => {
    let eventString = JSON.stringify(record);
    const childProcess = spawnSync(
      '../../node_modules/.bin/serverless',
      [
        'step-functions-offline',
        '--config=serverless-offline.yml',
        '--stateMachine=' + lcpName,
        '--event=' + eventString,
      ],
      {
        cwd: process.cwd(),
        env: process.env,
        stdio: 'pipe',
        encoding: 'utf-8',
      }
    );
    const result = childProcess.stdout || childProcess.stderr;
    return result ? result.toString() : '';
  });
};

export const handler = async (event: any, context: Context, callback: any) => {
  console.log('LCP execution event', event);

  if (process.env.AWS_ENV === 'dev') {
    const lcpName = process.env.lcpName;
    invokeServerlessOffline(lcpName, event);
    callback(null, `Your event executed successfully`);
  } else {
    const stateMachineArn = process.env.statemachine_arn;
    const promises = event.Records.map((record) => {
      console.log(JSON.stringify(record));
      const params = {
        input: JSON.stringify(record),
        stateMachineArn,
      };
      return new StepFunctions().startExecution(params).promise();
    });
    await Promise.all(promises)
      .then(() => callback(null, `Your statemachine ${stateMachineArn} executed successfully`))
      .catch((error) => {
        console.log('Statemachine error: ', error);
        callback(error.message);
      });
  }
};
