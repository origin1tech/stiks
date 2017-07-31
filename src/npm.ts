/**
 * Enables installing npm packages
 * programatically.
 *
 * Should support most if not all
 * methods but not tested.
 */

import * as npm from 'npm';
import * as argv from './argv';
import { extend, isArray, noop, keys } from 'chek';
import { INpmCommands, NpmCommand } from './interfaces';
import * as log from './logger';

// NPM Options.
let defaults = {
  loaded: false
};

export function configure(config?: any, onDone?: (err?: Error, data?: any) => void, onLog?: (msg: any) => void): INpmCommands {

  // Parse command line args. We'll
  // merge these in for convenience.
  const parsed = argv.parse();

  config = extend({}, defaults, config, parsed.flags);

  function handleDone(err, data) {
    if (err)
      log.error(err);
    (onDone || noop)(err, data);
  }

  function exec(cmd: string, ...args: any[]) {

    if (onLog)
      npm.on('log', onLog);

    // Concat any command args pased from cli.
    args = args.concat(parsed.cmds);

    npm.load(config, (err) => {

      if (err)
        return handleDone(err, null);

      // Exec npm command.
      npm.commands[cmd](args, handleDone);

    });

  }

  let cmds: INpmCommands = <any>{};

  keys(npm.commands).forEach((k) => {
    cmds[k] = exec.bind(null, k);
  });

  return cmds;

}