
import * as os from 'os';
import { resolve, parse, relative, join } from 'path';
import * as del from 'del';
import { toArray, isString, split, isPlainObject, isArray, keys, isNumber, castType, isValue, extend, tryRequire, tryRootRequire } from 'chek';
import { log } from './logger';
import * as glob from 'glob';
import * as cliui from 'cliui';
import { Colurs } from 'colurs';
import { readFileSync, readJSONSync, copySync, writeJSONSync, existsSync } from 'fs-extra';
import { CopyTuple, IMap, ICopy, ICpu } from './interfaces';
import { Options, BrowserSyncInstance } from 'browser-sync';
import { inc } from 'semver';
import { isBoolean } from 'util';

let _pkg;

export const cwd = process.cwd();

const colurs = new Colurs();

/**
 * Get Parsed
 *
 * @param filename the filename to path.parse.
 */
function getParsed(filename) {
  filename = resolve(cwd, filename);
  return parse(filename);
}

/**
 * Get Relative
 *
 * @param filename the filename to get relative path for.
 */
function getRelative(filename) {
  const parsed = isString(filename) ? getParsed(filename) : filename;
  return relative(cwd, join(parsed.dir, parsed.base || ''));
}

/**
 * Clean
 * Removes file(s) using provided glob(s).
 *
 * @param globs glob or array of glob strings.
 */
export function clean(globs: string | string[]) {
  globs = toArray<string>(globs) as string[];
  globs.forEach((g) => {
    try {
      del.sync(g);
      // Some files may not exist del doesn't throw
      // error just continues.
      // log.info(`successfully cleaned or ignored ${getRelative(g)}.`);
    }
    catch (ex) {
      log.info(`failed to clean ${getRelative(g)}.`);
    }
  });
}

/**
 * Copy
 * Copies source to target. Does NOT support globs.
 *
 * @param src the source path to be copied.
 * @param dest the destination path to copy to.
 */
export function copy(src: string, dest: string): boolean {

  if (!src || !dest)
    return false;

  let parsedSrc, parsedDest;
  parsedSrc = getParsed(src);
  parsedDest = getParsed(dest);

  try {
    copySync(src, dest);
    return true;
  }
  catch (ex) {
    log.warn(`failed to copy ${colurs.yellow(getRelative(parsedSrc || 'undefined'))} to ${colurs.red(getRelative(parsedDest || 'undefined'))}.`);
    return false;
  }

}

/**
 * Copy All
 * Takes collection and copies to destination.
 *
 * @param copies collection of source and destination targets.
 */
export function copyAll(copies: CopyTuple[] | CopyTuple | IMap<ICopy> | string[]) {

  let success: any = 0;
  let failed: any = 0;
  let result;

  function update(_result) {
    if (!_result)
      failed++;
    else
      success++;
  }

  function logResults() {
    // only log if something copied or failed.
    if (success || failed) {
      if (failed > success) {
        if (!success)
          log.error(`${colurs.red(failed)} copies ${colurs.red('failed')} to processes with 0 succeeding.`);
        else
          log.warn(`${colurs.red(failed)} copies ${colurs.red('failed')} to processes with ${colurs.green(success) + 'succeeding'}.`);
      }
      else {
        log.info(`${colurs.green(success)} items ${colurs.green('successfully')} copied with ${colurs.yellow(failed)} copies ${colurs.yellow('failing')}.`);
      }
    }
  }

  if (isPlainObject(copies)) {

    keys(<IMap<ICopy>>copies).forEach((k) => {

      const itm: ICopy = copies[k];

      // Check if src is glob.
      if (itm.src.indexOf('*') !== -1) {
        const arr = glob.sync(itm.src);
        arr.forEach((str) => {
          result = copy(str, itm.dest);
          update(result);
        });
      }
      else {
        result = copy(itm.src, itm.dest);
        update(result);
      }

    });

    // logResults();

  }

  else if (isArray(copies)) {

    // If not array of tuples convert.
    if (isString(copies[0]))
      copies = <CopyTuple[]>[copies[0].split('|')];

    (copies as CopyTuple[]).forEach((c) => {
      const tuple = c;
      if (tuple[0].indexOf('*') !== -1) {
        const arr = glob.sync(tuple[0]);
        arr.forEach((str) => {
          result = copy(str, tuple[1]);
          update(result);
        });
      }
      else {
        result = copy(tuple[0], tuple[1]);
        update(result);
      }
    });

    // logResults();

  }
  else {
    log.warn(`cannot copy using unknown configuration type of ${typeof copies}.`);
  }

  return {
    success,
    failed
  };

}

/**
 * Pkg
 * Loads the package.json file for project or saves package.json.
 *
 * @param val the package.json object to be written to file.
 */
export function pkg(val?: any) {
  const filename = resolve(cwd, 'package.json');
  if (!val)
    return _pkg || (_pkg = readJSONSync(filename));
  writeJSONSync(filename, val, { spaces: 2 });
}

/**
 * Bump
 * : Bumps the package version.
 *
 * @param type the release type to increment the package by.
 */
export function bump(type: 'major' | 'premajor' | 'minor' | 'preminor' | 'patch' | 'prepatch' | 'prerelease' = 'patch') {

  const _pkg = pkg();

  if (!_pkg || !_pkg.version)
    log.error('Failed to load package.json, are you sure this is a valid project?');

  const origVer = _pkg.version;
  const newVer = inc(origVer, type);

  if (newVer === null)
    log.error('Whoops tried to bump version but got null.');

  _pkg.version = newVer;

  pkg(_pkg);

  return { name: _pkg.name, version: _pkg.version, previous: origVer, current: _pkg.version };

}

/**
 * Serve
 * Hook to Browser Sync accepts name and options returning a Browser Sync Server Instance.
 * @see https://www.browsersync.io/docs/api
 *
 * @param name the name of the server or Browser Sync options.
 * @param options the Browser Sync Options.
 */
export function serve(name?: string | Options, options?: Options | boolean, init?: boolean): BrowserSyncInstance {

  const _pkg = pkg();

  if (isPlainObject(name)) {
    init = <boolean>options;
    options = <Options>name;
    name = undefined;
  }

  if (isBoolean(options)) {
    init = options;
    options = undefined;
  }

  const defaults: Options = {
    server: {
      baseDir: './dist'
    }
  };

  name = name || 'dev-server';
  options = extend({}, defaults, options);

  const bsync = tryRootRequire('browser-sync');

  if (!bsync)
    log.error('failed to load root module browser-sync, ensure the module is installed');

  const server = bsync.create(<string>name);

  if (init !== false)
    server.init(<Options>options, (err) => {
      if (err) {
        log.error(err);
      }
      else {
        log.info(`browser Sync server ${name} successfully initialized.`);
      }
    });

  return server;

}

/**
 * Platform
 * Gets information and paths for the current platform.
 */
export function platform() {

  const cpus = os.cpus();
  const cpu: ICpu = cpus[0];
  cpu.cores = cpus.length;
  let tmpPlatform: any = os.platform();

  if (/^win/.test(tmpPlatform))
    tmpPlatform = 'windows';
  else if (tmpPlatform === 'darwin' || tmpPlatform === 'freebsd')
    tmpPlatform = 'mac';
  else if (tmpPlatform === 'linux')
    tmpPlatform = 'linux';

  return {
    platform: tmpPlatform,
    arch: os.arch(),
    release: os.release(),
    hostname: os.hostname(),
    homedir: os.homedir(),
    cpu: cpu
  };

}
