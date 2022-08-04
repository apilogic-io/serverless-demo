#!/bin/bash

echo -n $'Applying patches to make offline work possible\n'
dynamoDataLoaderPath=amplify-appsync-simulator/lib/data-loader/dynamo-db
amplifyJavaSimulator=amplify-java-function-runtime-provider/lib/utils
javaInvokeSimulator=java-invoke-local/lib
serverlessOfflinePath=serverless-step-functions-offline
amplifyNodejsSimulator=amplify-nodejs-function-runtime-provider/lib/utils
cp libs/patches/$dynamoDataLoaderPath/index.js node_modules/$dynamoDataLoaderPath
cp libs/patches/$amplifyJavaSimulator/invoke.js node_modules/$amplifyJavaSimulator
cp libs/patches/$javaInvokeSimulator/index.js node_modules/$javaInvokeSimulator
cp libs/patches/$serverlessOfflinePath/index.js node_modules/$serverlessOfflinePath
cp libs/patches/$serverlessOfflinePath/build.js node_modules/$serverlessOfflinePath
cp libs/patches/$serverlessOfflinePath/parse.js node_modules/$serverlessOfflinePath

cp libs/patches/$amplifyNodejsSimulator/invoke_debug.js node_modules/$amplifyNodejsSimulator/invoke.js

pushd apps/appsync

#echo -n $'Applying dynamoDB migrations\n'
#node --inspect ../../node_modules/.bin/serverless --config serverless-offline.yml dynamodb start

echo -n $'Applying elastic migrations\n'
../../node_modules/.bin/serverless migrations apply --lambdaPort=3008 --config serverless-offline.yml

popd
