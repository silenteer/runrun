// require('esbuild-register')()

const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const path = require('path')
const util = require('util')
const lodash = require('lodash')
const kleur = require('kleur')

/** @type { import ("command-line-args").OptionDefinition[] } */
const optionDefinitions = [
	{
		name: 'help',
		alias: 'h',
		type: Boolean,
		description: 'Display this usage guide.'
	},
	{
		name: 'entry',
		defaultOption: true,
		type: String,
		description: 'file or library to be called',
		typeLabel: '<entry>'
	},
	{
		name: 'at',
		type: String,
		description: 'access using https://lodash.com/docs/4.17.15#at'
	},
	{
		name: 'method',
		alias: 'm',
		type: String,
		description: 'info, warn or error'
	},
	{
		name: 'arg',
		alias: 'a',
		multiple: true,
		type: String,
		description: `Value will be parsed using this rule
s:<value> will be parsed as string
n:<value> will be parsed as number
b:<value> will be parsed as boolean
j:<value> will be parsed as json using JSON.parse
everything else will be parsed as string
        `
	},
	{
		name: 'cwd',
		type: String,
		defaultValue: process.cwd()
	},
	{
		name: 'esbuild-register',
		alias: 'r',
		description: 'Enable esbuild-register to transform typescript automatically. Default true',
		defaultValue: true
	},
	{
		name: 'verbose',
		alias: "v",
		description: 'Enable trace for debugging. Default false',
		type: Boolean,
		defaultValue: false
	}
]

function processArgs() {
	if (options.arg) {
		options.arg = options.arg.map(option => {
			if (option.startsWith('s:')) {
				return option.substring(2)
			}

			if (option.startsWith('n:')) {
				return Number(option.substring(2))
			}

			if (option.startsWith('b:')) {
				return Boolean(option.substring(2))
			}

			if (option.startsWith('j:')) {
				return JSON.parse(option.substring(2))
			}

			return option
		})
	} else {
		options.arg = []
	}
}

const options = commandLineArgs(optionDefinitions)
processArgs()

const trace = (...args) => {
	if (options.verbose) {
		console.log(kleur.gray("TRACE -"), ...args)
	}
}

if (options['esbuild-register']) {
	require('esbuild-register')
}


if (options.help) {
	const usage = commandLineUsage([
		{
			header: 'Usage',
			content: 'runrun index.ts --arg \'hello world\' --method test'
		},
		{
			header: 'Options',
			optionList: optionDefinitions
		}
	])
	console.log(usage)
} else {
	trace("Options value", { options })
	const mod = options.entry.startsWith('.')
		? require(path.join(options.cwd, options.entry))
		: require(options.entry)

	let target
	if (options.at) {
		target = lodash.get(mod, options.at)
		
		if (target) {
			trace("Found target", {target, mod, options})
		} else {
			console.error("Target cannot be found", {mod, target: options.at})
			process.exit(1)
		}
	} else {
		target = mod
	}
	
	// if (typeof target !== 'function') {
	// 	console.error("Target is not a function", { mod, target})
	// 	process.exit(2)
	// }

	// trace("target requires", target.length, "arguments")
	// if (target.length > options.arg.length) {
	// 	console.log("WARN -", "target requires more arguments than given")
	// }

	let maybePromise
	
	try {
		
		trace("Looking for default method", {target: target[options.method], mod, options})
		maybePromise = lodash.invoke(mod, options.at, ...options.arg)

		if (util.types.isPromise(maybePromise)) {
			maybePromise.then()
		}
	} catch (e) {
		console.error("Process is terminated due to", e)
	}
}

