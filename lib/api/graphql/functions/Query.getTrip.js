import { util } from '@aws-appsync/utils'

export function request(ctx) {
	const getTravePostRequest = {
		operation: 'GetItem',
		key: util.dynamodb.toMapValues({ id: ctx.args.id }),
	}
	return getTravePostRequest
}

export function response(ctx) {
	return ctx.result
}
