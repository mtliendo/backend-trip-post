export function request(ctx) {
	return {
		version: '2018-05-29',
		operation: 'Scan',
	}
}

export function response(ctx) {
	const response = ctx.result.items

	return response
}
