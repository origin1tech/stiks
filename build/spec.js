const stiks = require('../dist');

/**
 * TS-Node
 * Helper file to setup ts-node for testing.
 * @see https://github.com/TypeStrong/ts-node#configuration-options
 */

// Options
const options = {
  project: './src/tsconfig.spec.json',
  ignoreWarnings: true,
  disableWarnings: true,
  fast: true
};

stiks.tsnodeRegister(options);