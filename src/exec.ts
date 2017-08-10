import { spawnSync, SpawnSyncOptions } from 'child_process';
import { IExecMethods } from './interfaces';
import { isString, extend } from 'chek';
import * as logger from './logger';
const log = logger.get();

// COMMANDS REFERENCE //

//   access, adduser, bin, bugs, c, cache, completion, config,
//   ddp, dedupe, deprecate, dist-tag, docs, edit, explore, get,
//   help, help-search, i, init, install, install-test, it, link,
//   list, ln, login, logout, ls, outdated, owner, pack, ping,
//   prefix, prune, publish, rb, rebuild, repo, restart, root,
//   run, run-script, s, se, search, set, shrinkwrap, star,
//   stars, start, stop, t, tag, team, test, tst, un, uninstall,
//   unpublish, unstar, up, update, v, version, view, whoami

// FLAGS REFERENCE //

// -v: --version
// -h, -?, --help, -H: --usage
// -s, --silent: --loglevel silent
// -q, --quiet: --loglevel warn
// -d: --loglevel info
// -dd, --verbose: --loglevel verbose
// -ddd: --loglevel silly
// -g: --global
// -C: --prefix
// -l: --long
// -m: --message
// -p, --porcelain: --parseable
// -reg: --registry
// -f: --force
// -desc: --description
// -S: --save
// -P: --save-prod
// -D: --save-dev
// -O: --save-optional
// -B: --save-bundle
// -E: --save-exact
// -y: --yes
// -n: --yes false

// Default spawn options.
const spawnDefaults = {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
};

/**
 * Exec
 * Executes command using child process.
 *
 * @param cmd node, npm or shell command to be executed.
 * @param args arguments to be passed to command.
 * @param options the child process spawn options.
 */
function exec(cmd: string, args: string | string[], options?: boolean | SpawnSyncOptions) {

  // If true user wants stdout to output
  // instead of using inherit outputting
  // to process.stdout.
  if (options === true)
    options = { stdio: 'pipe' };

  options = extend({}, spawnDefaults, options);

  if (isString(args))
    args = (args as string).split(' ');

  // Ensure command and arguments.
  if (!cmd)
    log.error('cannot execute process with command or arguments of undefined.').exit();

  // Spawn child.
  const child = spawnSync(cmd, <string[]>args, <SpawnSyncOptions>options);

  // Get the output.
  let output: string | string[] = child.output || [];
  output = output.slice(1, 2) || '';
  output = String(output).replace(/\n/, '');

  return output;

}

export const methods: IExecMethods = {
  command: exec,
  node: exec.bind(null, 'node'),
  npm: exec.bind(null, 'npm')
};


