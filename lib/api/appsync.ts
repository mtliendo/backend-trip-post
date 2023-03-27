import { envNameContext } from './../../cdk.context.d'
import { Construct } from 'constructs'
import * as awsAppsync from 'aws-cdk-lib/aws-appsync'
import * as path from 'path'
import { UserPool } from 'aws-cdk-lib/aws-cognito'
import { Table } from 'aws-cdk-lib/aws-dynamodb'
import { IRole } from 'aws-cdk-lib/aws-iam'

type AppSyncAPIProps = {
	appName: string
	env: envNameContext
	unauthenticatedRole: IRole
	userpool: UserPool
	travelDB: Table
	userDB: Table
}

export function createAppSyncTripAPI(scope: Construct, props: AppSyncAPIProps) {
	const api = new awsAppsync.GraphqlApi(scope, 'TripAPI', {
		name: `${props.appName}-${props.env}-TripAPI`,
		schema: awsAppsync.SchemaFile.fromAsset(
			path.join(__dirname, './graphql/schema.graphql')
		),
		authorizationConfig: {
			defaultAuthorization: {
				authorizationType: awsAppsync.AuthorizationType.USER_POOL,
				userPoolConfig: {
					userPool: props.userpool,
				},
			},
			additionalAuthorizationModes: [
				{ authorizationType: awsAppsync.AuthorizationType.IAM },
			],
		},
		logConfig: {
			fieldLogLevel: awsAppsync.FieldLogLevel.ALL,
		},
	})

	api.grantQuery(props.unauthenticatedRole, 'getTrip', 'listTrips')

	const TripDataSource = api.addDynamoDbDataSource(
		`${props.appName}-${props.env}-TripDataSource`,
		props.travelDB
	)
	const UserDataSource = api.addDynamoDbDataSource(
		`${props.appName}-${props.env}-UserDataSource`,
		props.userDB
	)

	const createTripFunction = new awsAppsync.AppsyncFunction(
		scope,
		'createTripFunction',
		{
			name: 'createTripFunction',
			api,
			dataSource: TripDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Mutation.createTrip.js')
			),
		}
	)
	const getUserFunction = new awsAppsync.AppsyncFunction(
		scope,
		'getUserFunction',
		{
			name: 'getUserFunction',
			api,
			dataSource: UserDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Query.getUser.js')
			),
		}
	)

	const getTripFunction = new awsAppsync.AppsyncFunction(
		scope,
		'getTripFunction',
		{
			name: 'getTripFunction',
			api,
			dataSource: TripDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Query.getTrip.js')
			),
		}
	)

	const updateTripFunction = new awsAppsync.AppsyncFunction(
		scope,
		'updateTripFunction',
		{
			name: 'updateTripFunction',
			api,
			dataSource: TripDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Mutation.updateTrip.js')
			),
		}
	)

	const deleteTripFunction = new awsAppsync.AppsyncFunction(
		scope,
		'deleteTripFunction',
		{
			name: 'deleteTripFunction',
			api,
			dataSource: TripDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Mutation.deleteTrip.js')
			),
		}
	)

	const listTripsFunction = new awsAppsync.AppsyncFunction(
		scope,
		'listTripsFunction',
		{
			name: 'listTripsFunction',
			api,
			dataSource: TripDataSource,
			runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
			code: awsAppsync.Code.fromAsset(
				path.join(__dirname, 'graphql/functions/Query.listTrips.js')
			),
		}
	)

	new awsAppsync.Resolver(scope, 'createTripPipelineResolver', {
		api,
		typeName: 'Mutation',
		fieldName: 'createTrip',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [createTripFunction],
	})

	new awsAppsync.Resolver(scope, 'getUserPipelineResolver', {
		api,
		typeName: 'Query',
		fieldName: 'getUser',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [getUserFunction],
	})

	new awsAppsync.Resolver(scope, 'getTripPipelineResolver', {
		api,
		typeName: 'Query',
		fieldName: 'getTrip',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [getTripFunction],
	})

	new awsAppsync.Resolver(scope, 'updateTripPipelineResolver', {
		api,
		typeName: 'Mutation',
		fieldName: 'updateTrip',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [updateTripFunction],
	})

	new awsAppsync.Resolver(scope, 'deleteTripPipelineResolver', {
		api,
		typeName: 'Mutation',
		fieldName: 'deleteTrip',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [deleteTripFunction],
	})

	new awsAppsync.Resolver(scope, 'listTripsPipelineResolver', {
		api,
		typeName: 'Query',
		fieldName: 'listTrips',
		code: awsAppsync.Code.fromAsset(
			path.join(__dirname, 'graphql/functions/passThrough.js')
		),
		runtime: awsAppsync.FunctionRuntime.JS_1_0_0,
		pipelineConfig: [listTripsFunction],
	})

	return api
}
