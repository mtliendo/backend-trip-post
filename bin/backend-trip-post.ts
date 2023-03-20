#!/usr/bin/env node
import { initStack } from './init-stack'
import 'source-map-support/register'
import { BackendTripPostStack } from '../lib/backend-trip-post-stack'

const { app, stackNameWithEnv, stackProps, context } = initStack()

const travelStack = new BackendTripPostStack(
	app,
	stackNameWithEnv,
	stackProps,
	context
)
