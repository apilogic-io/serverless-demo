import { Client } from '@opensearch-project/opensearch';
import { Context } from 'aws-lambda';

export const handler = async (event: any, context: Context, callback: any) => {
  const length = Object.keys(event).length;
  if(length > 0) {
    const host = process.env.host;
    const username = process.env.username;
    const password = process.env.password;
    const options = {
      node: host,
      auth: {username, password},
    };
    console.log('Options: ' + options);
    const esClient = new Client(options);
    const index = event.indexName;
    const body = event.data;
    const id = event.id;
    const template = {
      index,
      id,
      body,
    };
    console.log('Upsert entity to elastic', template);
    esClient.index(template);
  }
  return callback(null, event);
};
