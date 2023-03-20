import { Construct } from 'constructs'
import * as awsCognito from 'aws-cdk-lib/aws-cognito'
import {
	IdentityPool,
	UserPoolAuthenticationProvider,
} from '@aws-cdk/aws-cognito-identitypool-alpha'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { envNameContext } from '../../cdk.context'

type CreateTravelUserpool = {
	appName: string
	env: envNameContext
	addUserPostConfirmation: NodejsFunction
}
export function createTravelUserpool(
	scope: Construct,
	props: CreateTravelUserpool
) {
	const userPool = new awsCognito.UserPool(
		scope,
		`${props.appName}-${props.env}-userpool`,
		{
			userPoolName: `${props.appName}-${props.env}-userpool`,
			selfSignUpEnabled: true,
			lambdaTriggers: {
				postConfirmation: props.addUserPostConfirmation,
			},
			accountRecovery: awsCognito.AccountRecovery.EMAIL_ONLY,
			userVerification: {
				emailStyle: awsCognito.VerificationEmailStyle.CODE,
			},
			standardAttributes: {
				email: {
					required: true,
					mutable: true,
				},
			},
		}
	)

	const userPoolClient = new awsCognito.UserPoolClient(
		scope,
		`${props.appName}-${props.env}-userpoolClient`,
		{ userPool }
	)

	const identityPool = new IdentityPool(
		scope,
		`${props.appName}-${props.env}-identityPool`,
		{
			identityPoolName: `${props.appName}-${props.env}IdentityPool`,
			allowUnauthenticatedIdentities: true,
			authenticationProviders: {
				userPools: [
					new UserPoolAuthenticationProvider({
						userPool: userPool,
						userPoolClient: userPoolClient,
					}),
				],
			},
		}
	)

	return { userPool, userPoolClient, identityPool }
}
