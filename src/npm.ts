/**
 * Enables installing npm packages
 * programatically.
 *
 * Should support most if not all
 * methods but not tested.
 */

import * as npm from 'npm';
import * as argv from './argv';
import { extend, isArray, noop, keys, last, isFunction } from 'chek';
import { INpmCommands, NpmCommand } from './interfaces';
import * as log from './logger';

// NPM Options.
let defaults = {
  loaded: false
};

export function configure(config?: any, onLog?: (msg: any) => void): INpmCommands {

  // Parse command line args. We'll
  // merge these in for convenience.
  let onDone = noop;
  const parsed = argv.parse();

  config = extend({}, defaults, config, parsed.flags);

  function handleDone(err, data) {
    if (err)
      log.error(err);
    (onDone)(err, data);
  }

  function exec(cmd: string, ...args: any[]) {

    if (onLog)
      npm.on('log', onLog);

    // check if args have any flags.
    const parsedArgs = argv.parse(args);

    // Extend flags from parsed args.
    config = extend({}, config, parsedArgs.flags);

    // Concat any command args pased from cli.
    args = (parsed.cmds || []).concat(parsedArgs.cmds || []); // args.concat(parsed.cmds);

    npm.load(config, (err) => {

      if (err)
        return handleDone(err, null);

      // Exec npm command.
      const val = npm.commands[cmd](args, handleDone);

    });

  }

  let cmds: INpmCommands = <any>{};

  keys(npm.commands).forEach((k) => {
    cmds[k] = function (...args: any[]) {
      if (isFunction(last(args)))
        onDone = args.pop();
      exec(k, ...args);
    };
  });

  return cmds;

}