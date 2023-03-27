// The before step.
//This runs before ALL the AppSync functions in this pipeline.
export function request(...args) {
	console.log(args)
	return {}
}

// The after step.
// The AFTER step. This runs after ALL the AppSync functions in this pipeline.
export function response(ctx) {
	return ctx.prev.result
}
