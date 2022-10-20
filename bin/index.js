// require('esbuild-register')()

const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const path = require('path')
const util = require('util')

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
		description: 'file or library to be called. Use "default" to execute the default export',
		typeLabel: '<entry>'
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
	}
}

const options = commandLineArgs(optionDefinitions)
processArgs()

const trace = (...args) => {
	if (options.verbose) {
		console.log("DEBUG -", ...args)
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

	let maybePromise

	try {

		if (options.method) {
			maybePromise = mod[options.method].apply(null, options.arg)
		} else {
			if (mod.default) {
				maybePromise = mod.default.apply(null, options.arg)
			} else {
				maybePromise = mod.apply(null, options.arg)
			}
		}

		if (util.types.isPromise(maybePromise)) {
			maybePromise
				.then(() => process.exit(0))
		}
	} catch (e) {
		console.error("Process is terminated due to", e)
	}
}

