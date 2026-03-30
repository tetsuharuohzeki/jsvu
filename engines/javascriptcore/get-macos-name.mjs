import * as os from 'node:os';

export const getMacOsName = () => {
	const version = os.version();
	const [, majorVersion] = version.match(/Darwin Kernel Version (\d\d)/u)
	switch (majorVersion) {
		case '25':
			return 'tahoe';
		default:
			throw new Error(`Unknown os version: os.version() is ${version}`);
	}
};
