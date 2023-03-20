export type CDKContext = {
	appName: string
	appDescription: string
	region: string
	environment: envNameContext
	branchName: branchNameContext
}

export type envNameContext = 'develop'

export type branchNameContext = 'develop'
