
import { spawnSync } from 'child_process';
import { NodeCallback, INpmInstallOptions, INpmUninstallOptions, INpmListOptions, NodeAnyCallback, INpmOptions } from './interfaces';
import * as log from './logger';
import { isFunction, extend, keys, isValue, isUndefined, isBoolean, contains, noopIf, isString } from 'chek';

// Install Flags Reference
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

const excludeFilters = ['stdio', 'cwd', 'shell'];

const spawnDefaults = {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
};

// Parses flags to command string.
function parseFlags(options, filter?) {

  let arr = [];
  const _keys = keys(options);

  filter = filter || _keys;

  _keys.forEach((k) => {
    if (!contains(excludeFilters, k) && contains(filter, k)) {
      const flag = options[k];
      if (!isUndefined(options)) {
        arr.push('--' + k);
        if (!isBoolean(flag))
          arr.push(flag);
      }
    }
  });

  return arr;

}

// Normalize the command string.
function normalize(cmd, packages, flags?) {
  if (!cmd)
    log.error('cannot normalize command of undefined.').exit();
  let pkgs = [];
  if (isValue(packages))
    pkgs = isString(packages) ? (packages as string).split(' ') : packages;
  pkgs.unshift(cmd);
  pkgs = pkgs.concat(flags || []);
  return pkgs;
}

/**
 * Install
 * Spawns process and installs packages.
 *
 * @param packages the packages to be installed.
 * @param options options to use when installing.
 */
export function install(packages: string | string[], options: INpmInstallOptions) {

  // Extend options.
  const opts: INpmInstallOptions = extend({}, spawnDefaults, options);

  // Parse flags from options.
  const flags = parseFlags(opts);

  // Call spawn.
  spawnSync('npm', normalize('install', packages, flags), opts);

}

/**
 * Uninstall
 * Spawns process and uninstalls packages.
 *
 * @param packages the packages to be uninstalled.
 * @param options options to use when uninstalling.
 */
export function uninstall(packages: string | string[], options: INpmUninstallOptions) {

  // Extend options.
  const opts: INpmInstallOptions = extend({}, spawnDefaults, options);

  // Parse flags from options.
  const flags = parseFlags(opts);

  // Call spawn.
  spawnSync('npm', normalize('uninstall', packages, flags), opts);

}

/**
 * List
 * Displays list/tree of project packages.
 *
 * @param pkg optional package to be listed.
 * @param options list options.
 */
export function list(pkg: string | INpmListOptions, options: INpmListOptions) {

  if (!isString(pkg)) {
    options = <INpmListOptions>pkg;
    pkg = undefined;
  }

  options = options || {};
  options.depth = options.depth || 0;

  // Extend options.
  const opts: INpmInstallOptions = extend({}, spawnDefaults, options);

  // Parse flags from options.
  const flags = parseFlags(opts);

  // Call spawn.
  spawnSync('npm', normalize('ls', pkg, flags), opts);

}

/**
 * Run
 * Calls npm run-script from your package.json.
 *
 * @param script the script to be run.
 * @param options optional flags to run with script.
 */
export function run(script: string, options: INpmOptions) {

  // Extend options.
  const opts: INpmInstallOptions = extend({}, spawnDefaults, options);

  // Parse flags from options.
  const flags = parseFlags(options);

  // Call spawn.
  spawnSync('npm', normalize('run', script, flags), opts);

}

export function command(cmd: string, args?: string | string[], options?: INpmOptions, defaults?: boolean) {

  let opts = options;

  // Extend with defaults unless disabled.
  if (defaults !== false)
    opts = extend({}, spawnDefaults, options);

  const flags = parseFlags(opts);

  spawnSync('npm', normalize(cmd, args, flags), opts);

}



