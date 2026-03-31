import * as os from 'node:os';

/**
 *	@enum	{string}
 */
export const MacOsName = Object.freeze({
	Tahoe: 'tahoe',
});

export const getMacOsName = () => {
	const version = os.version();
	const [, majorVersion] = version.match(/Darwin Kernel Version (\d\d)/u)
	switch (majorVersion) {
		case '25':
			return MacOsName.Tahoe;
		default:
			throw new Error(`Unknown os version: os.version() is ${version}`);
	}
};
