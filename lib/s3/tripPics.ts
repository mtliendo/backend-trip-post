import { envNameContext } from './../../cdk.context.d'
import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as awsCloudfront from 'aws-cdk-lib/aws-cloudfront'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'

type CreateTripPicsBucketProps = {
	appName: string
	env: envNameContext
	allowedOrigins: [string]
	authenticatedRole: iam.IRole
}

export function createTripPicsBucket(
	scope: Construct,
	props: CreateTripPicsBucketProps
) {
	const fileStorageBucket = new s3.Bucket(
		scope,
		`${props.appName}-${props.env}-bucket`,
		{
			cors: [
				{
					allowedMethods: [
						s3.HttpMethods.GET,
						s3.HttpMethods.POST,
						s3.HttpMethods.PUT,
						s3.HttpMethods.DELETE,
					],
					allowedOrigins: props.allowedOrigins,
					allowedHeaders: ['*'],
					exposedHeaders: [
						'x-amz-server-side-encryption',
						'x-amz-request-id',
						'x-amz-id-2',
						'ETag',
					],
				},
			],
		}
	)

	const fileStorageBucketCFDistribution = new awsCloudfront.Distribution(
		scope,
		`${props.appName}-${props.env}-CDN`,
		{
			defaultBehavior: {
				origin: new S3Origin(fileStorageBucket, { originPath: '/public' }),
				cachePolicy: awsCloudfront.CachePolicy.CACHING_OPTIMIZED,
				allowedMethods: awsCloudfront.AllowedMethods.ALLOW_GET_HEAD,
				cachedMethods: awsCloudfront.AllowedMethods.ALLOW_GET_HEAD,
				viewerProtocolPolicy:
					awsCloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
			},
		}
	)

	// Let signed in users CRUD on a bucket
	const canReadUpdateDeleteFromPublicDirectory = new iam.PolicyStatement({
		effect: iam.Effect.ALLOW,
		actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
		resources: [`arn:aws:s3:::${fileStorageBucket.bucketName}/public/*`],
	})

	new iam.ManagedPolicy(scope, 'SignedInUserManagedPolicy', {
		description:
			'managed Policy to allow access to s3 bucket by signed in users.',
		statements: [canReadUpdateDeleteFromPublicDirectory],
		roles: [props.authenticatedRole],
	})

	return { fileStorageBucket, fileStorageBucketCFDistribution }
}
