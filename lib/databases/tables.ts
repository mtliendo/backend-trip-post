import { Construct } from 'constructs'
import * as awsDynamodb from 'aws-cdk-lib/aws-dynamodb'
import { RemovalPolicy } from 'aws-cdk-lib'
import { envNameContext } from '../../cdk.context'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

type BaseTableProps = {
	appName: string
	env: envNameContext
}

type createTravelTableProps = BaseTableProps & {}
export function createTravelTable(
	scope: Construct,
	props: createTravelTableProps
): awsDynamodb.Table {
	const travelTable = new awsDynamodb.Table(scope, 'TravelTable', {
		tableName: `${props.appName}-${props.env}-TravelTable`,
		removalPolicy:
			props.env === 'develop' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
		billingMode: awsDynamodb.BillingMode.PAY_PER_REQUEST,
		partitionKey: { name: 'id', type: awsDynamodb.AttributeType.STRING },
	})

	return travelTable
}

type CreateUserTableProps = BaseTableProps & {}
export function createUserTable(
	scope: Construct,
	props: CreateUserTableProps
): awsDynamodb.Table {
	const userTable = new awsDynamodb.Table(scope, 'UserTable', {
		tableName: `${props.appName}-${props.env}-UserTable`,
		removalPolicy:
			props.env === 'develop' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
		billingMode: awsDynamodb.BillingMode.PAY_PER_REQUEST,
		partitionKey: { name: 'id', type: awsDynamodb.AttributeType.STRING },
	})

	return userTable
}
