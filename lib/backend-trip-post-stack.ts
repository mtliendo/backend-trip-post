import { CDKContext } from './../cdk.context.d'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createTravelTable, createUserTable } from './databases/tables'
import { createTravelUserpool } from './cognito/auth'
import { createTripPicsBucket } from './s3/tripPics'
import { createAddUserPostConfirmation } from './functions/addUserPostConfirmation/construct'
import { createAppSyncTripAPI } from './api/appsync'

export class BackendTripPostStack extends cdk.Stack {
	constructor(
		scope: Construct,
		id: string,
		props: cdk.StackProps,
		context: CDKContext
	) {
		super(scope, id, props)
		// our code will go here

		const travelDB = createTravelTable(this, {
			appName: context.appName,
			env: context.environment,
		})

		const userDB = createUserTable(this, {
			appName: context.appName,
			env: context.environment,
		})

		const addUserFunc = createAddUserPostConfirmation(this, {
			appName: context.appName,
			env: context.environment,
			userTable: userDB,
		})

		const cognitoAuth = createTravelUserpool(this, {
			appName: context.appName,
			env: context.environment,
			addUserPostConfirmation: addUserFunc,
		})

		const travelAPI = createAppSyncTripAPI(this, {
			appName: context.appName,
			env: context.environment,
			unauthenticatedRole: cognitoAuth.identityPool.unauthenticatedRole,
			userpool: cognitoAuth.userPool,
			travelDB,
			userDB,
		})

		const tripPicsBucket = createTripPicsBucket(this, {
			appName: context.appName,
			env: context.environment,
			allowedOrigins: context.s3AllowedOrigins,
			authenticatedRole: cognitoAuth.identityPool.authenticatedRole,
		})
	}
}
