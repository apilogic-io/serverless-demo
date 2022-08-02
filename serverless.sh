#!/bin/bash
############################################################
# Help                                                     #
############################################################
Help() {
  # Display Help
  echo "Script to run simulated AWS components offline."
  echo
  echo "Script options:"
  echo "-a    Application to run offline as defined in workspace.json.  Ex: appsync, custom-ts-resolvers, etc. Default value: appsync"
  echo "-d    Components to debug.  Ex: 'nodejs appsync-java' ... Possible values: nodejs, appsync-java, step-functions-java"
  echo "-h    Print this Help."
  echo
}

############################################################
# Process the input options. Add options as needed.        #
############################################################
# Get the options
while getopts ":had:" option; do
  case $option in
  h) # display Help
    Help
    exit
    ;;
  a) # Enter a name
    AppName=$OPTARG ;;
  d) # Enter a name
    Components=($OPTARG) ;;
  \?) # Invalid option
    echo "Error: Invalid option"
    exit
    ;;
  esac
done

if [ -n "$AppName" ]; then
  echo "Application to be deployed: $AppName"
else
  AppName=appsync
  echo "Application to be deployed: $AppName"
fi

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

for component in "${Components[@]}"; do
  case $component in
  "nodejs")
    echo -e "Applying patch for nodejs debugging"
    cp libs/patches/$amplifyNodejsSimulator/invoke_debug.js node_modules/$amplifyNodejsSimulator/invoke.js
    ;;
  "appsync-java")
    echo -e "Applying patch for appsync java debugging"
    cp libs/patches/$amplifyJavaSimulator/invoke_debug.js node_modules/$amplifyJavaSimulator/invoke.js
    ;;
  "step-functions-java")
    echo -e "Applying patch for step-functions java debugging"
    cp libs/patches/$javaInvokeSimulator/index_debug.js node_modules/$javaInvokeSimulator/index.js
    ;;
  esac
done

echo -n $'Kill existing offline process\n'
pushd apps/$AppName
pid=$(cat pid)
kill -9 $pid
touch server.log
echo "" >server.log
popd

#echo -n $'Applying dynamoDB migrations\n'
#pushd apps/appsync
#node --inspect ../../node_modules/.bin/serverless --config serverless-offline.yml dynamodb start
#popd

#echo -n $'Applying elastic migrations\n'
#pushd apps/appsync
#../../node_modules/.bin/serverless migrations apply --lambdaPort=3008 --config serverless-offline.yml
#popd

# echo -n $'running gradle build\n'
#./gradlew clean build -x test

echo -n $'Starting offline server \n'
pushd apps/$AppName
node --inspect ../../node_modules/.bin/serverless offline --config serverless-offline.yml --lambdaPort 3003 start >>server.log 2>&1 &
RETVAL=$?
PID=$!
[ $RETVAL -eq 0 ] && echo $PID >pid && echo success || echo failure
echo

echo -n $'Serverless application successfully deployed\n'
tail -f server.log
popd

return $RETVAL
