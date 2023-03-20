import { CDKContext } from './../cdk.context.d'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createTravelTable, createUserTable } from './databases/tables'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import path = require('path')
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { createTravelUserpool } from './cognito/auth'

export class BackendTripPostStack extends cdk.Stack {
	constructor(
		scope: Construct,
		id: string,
		props: cdk.StackProps,
		context: CDKContext
	) {
		super(scope, id, props)
		// our code will go here
		const addUserFunc = new NodejsFunction(this, 'addUserFunc', {
			functionName: `${context.appName}-${context.environment}-addUserFunc`,
			runtime: Runtime.NODEJS_16_X,
			handler: 'handler',
			entry: path.join(__dirname, `./functions/addUser/main.ts`),
		})

		const cognitoAuth = createTravelUserpool(this, {
			appName: context.appName,
			env: context.environment,
			addUserPostConfirmation: addUserFunc,
		})

		const travelDB = createTravelTable(this, {
			appName: context.appName,
			env: context.environment,
		})

		const userDB = createUserTable(this, {
			appName: context.appName,
			env: context.environment,
			addUserFunc,
		})
	}
}
