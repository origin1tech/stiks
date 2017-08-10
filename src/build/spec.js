const stiks = require('stiks');
const ts = require('ts-node');

/**
 * TS-Node
 * Helper file to setup ts-node for testing.
 * @see https://github.com/TypeStrong/ts-node#configuration-options
 *
 * NOTE: requires ts-node to be installed in root of package.
 * Mocha opts will call this file using the --compilers flag.
 * If for example you want to use babel the process is
 * much the same and is only really needed if you want to
 * pass specific options, namely the path to a typescript
 * tsconfig file.
 */

// ts-node options.
const options = {
  project: './src/tsconfig.spec.json',
  fast: true
};

ts.register(options);