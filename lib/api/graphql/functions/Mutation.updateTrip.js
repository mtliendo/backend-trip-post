import { util } from '@aws-appsync/utils'
export function request(ctx) {
	let { id, ...values } = ctx.args.input

	return {
		operation: 'PutItem',
		key: util.dynamodb.toMapValues({ id }),
		attributeValues: util.dynamodb.toMapValues({
			__typename: 'TravelPost',
			updatedAt: util.time.nowISO8601(),
			...values,
		}),
	}
}

export function response(ctx) {
	return ctx.result
}
