let result: NodeRequire;

if (typeof window !== 'undefined' && 
	typeof navigator !== 'undefined' &&
	navigator.userAgent.indexOf('Electron') > -1) { 

	// Use electron require
	const remote = window['require']('@electron/remote');
	result = remote.require;
} else if (typeof process !== 'undefined' && !!module['require']) {
	// Regular nodejs
	result = require;
} else {
	// Not a supported plattform. Return dummy, do not fail on execute of the lambda.
	result = (() => new Proxy({}, {
		get() {
			throw new Error('This platform is not supported');
		},
		set() {
			throw new Error('This platform is not supported');
		}
	})) as unknown as NodeRequire;
}

export const requireLocal = result;
