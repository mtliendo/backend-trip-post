import { util } from '@aws-appsync/utils'
export function request(ctx) {
	let { id, ...values } = ctx.args.input
	if (!id) {
		id = util.autoId()
	}

	return {
		operation: 'PutItem',
		key: util.dynamodb.toMapValues({ id }),
		attributeValues: util.dynamodb.toMapValues({
			__typename: 'Trip',
			createdAt: util.time.nowISO8601(),
			updatedAt: util.time.nowISO8601(),
			...values,
		}),
	}
}

export function response(ctx) {
	return ctx.result
}
