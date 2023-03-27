import { Table } from 'aws-cdk-lib/aws-dynamodb'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'
import path = require('path')
import { envNameContext } from '../../../cdk.context'

type CreateAddUserPostConfirmationProps = {
	appName: string
	env: envNameContext
	userTable: Table
}

export const createAddUserPostConfirmation = (
	scope: Construct,
	props: CreateAddUserPostConfirmationProps
) => {
	const addUserFunc = new NodejsFunction(scope, 'addUserFunc', {
		functionName: `${props.appName}-${props.env}-addUserFunc`,
		runtime: Runtime.NODEJS_16_X,
		handler: 'handler',
		entry: path.join(__dirname, `./main.ts`),
		environment: {
			USER_TABLE_NAME: props.userTable.tableName,
		},
	})

	addUserFunc.addToRolePolicy(
		new iam.PolicyStatement({
			effect: iam.Effect.ALLOW,
			actions: ['dynamodb:PutItem'],
			resources: [props.userTable.tableArn],
		})
	)

	return addUserFunc
}
