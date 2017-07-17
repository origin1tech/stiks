/**
 * Enables installing npm packages
 * programatically. Only supports
 * install and uninstall.
 */

import * as npm from 'npm';
import * as parser from './parser';
import { extend, isArray } from 'chek';
import * as log from './logger';

const args = parser.parse();

// NPM Options.
let config = {
  loaded: false
};

function run(cmd: string, conf: any, pkgs: any[] | Function, done?: Function) {

  if (isArray(conf)) {
    done = <Function>pkgs;
    pkgs = conf;
    conf = undefined;
  }

  // extend the options
  config = extend<any>({}, config, conf || args.flags);

  pkgs = pkgs || args.cmds;

  // Load and install.
  npm.load(config, (err) => {

    if (err)
      log.error(err);

    // function log(msg) {
    //   console.log(msg);
    // }
    // npm.on('log', log);

    function _done(err, data) {
      if (err)
        log.error(err);
      done(err, data);
    }

    if (cmd === 'install')
      npm.commands.install(pkgs, _done);
    else
      npm.commands.uninstall(pkgs, _done);

  });

}