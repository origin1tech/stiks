
import { CopyTuple, IMap, ICopy, ITSNodeOptions, IUIOptions, IStringBuilderMethods, ICpu } from './interfaces';
import { readFileSync, readJSONSync, copySync, writeJSONSync, existsSync } from 'fs-extra';
import * as tsnode from 'ts-node';
import * as del from 'del';
import { resolve, parse, relative, join } from 'path';
import { toArray, isString, split, isPlainObject, isArray, keys, isNumber, castType, isValue, extend } from 'chek';
import * as log from './logger';
import * as glob from 'glob';
import * as bsync from 'browser-sync';
import * as cliui from 'cliui';
import * as clrs from 'colurs';
import * as os from 'os';

let _pkg;

export const cwd = process.cwd();
const colurs = clrs.get();

function getParsed(filename) {
  filename = resolve(cwd, filename);
  return parse(filename);
}

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
  globs = toArray<string>(globs);
  globs.forEach((g) => {
    try {
      del.sync(g);
      log.info(`successfully cleaned ${getRelative(g)}.`);
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

  const parsedSrc = getParsed(src);
  const parsedDest = getParsed(dest);

  try {
    copySync(src, dest);
    log.info(`successfully copied ${colurs.magenta(getRelative(parsedSrc))} to ${colurs.green(getRelative(parsedDest))}.`);
    return true;
  }
  catch (ex) {
    log.info(`failed to copy ${colurs.yellow(getRelative(parsedSrc))} to ${colurs.red(getRelative(parsedDest))}.`);
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

    logResults();

  }

  else if (isArray(copies)) {

    // If not array of tuples convert.
    if (isString(copies[0]))
      copies = toArray<CopyTuple>(copies);

    (copies as CopyTuple[]).forEach((c) => {
      const tuple = isString(c) ? split(c, '|') : c;
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

    logResults();

  }
  else {
    log.warn(`cannot copy using unknown configuration type of ${typeof copies}.`);
  }

}

/**
 * Pkg
 * Loads the package.json file for project or saves package.json.
 *
 * @param val the package.json object to be written to file.
 */
export function pkg(val?: any) {
  const filename = resolve(cwd, 'package.json');
  try {
    if (!val)
      return _pkg || (_pkg = readJSONSync(filename));
    writeJSONSync(filename, val, { spaces: 2 });
  }
  catch (ex) {
    log.error(ex);
  }
}

/**
 * Bump
 * Bumps project to next version.
 *
 * @param filename optional filename defaults to package.json in cwd.
 */
export function bump() {

  const semverKeys = ['major', 'minor', 'patch'];
  const _pkg = pkg();

  if (!_pkg || !_pkg.version)
    log.error('failed to load package.json, are you sure this is a valid project?').exit();

  const origVer = _pkg.version;
  const splitVer = _pkg.version.split('-');
  let ver = (splitVer[0] || '').replace(/^(=|v|^|~)/, '');
  let pre = splitVer[1] || '';
  let verArr = castType<number[]>(split(ver), ['integer'], []);
  let preArr = [];

  if (pre && pre.length)
    preArr = castType<any[]>(split(pre), ['string', 'integer'], []);

  let arr = verArr;
  let isPre = false;

  if (preArr.length) {
    arr = [].slice.call(preArr, 1); // remove first arg.
    isPre = true;
  }

  let i = arr.length;
  let bump: any;

  while (i-- && !bump) {

    const next = arr[i] + 1;

    arr[i] = next;

    bump = {
      type: !isPre ? semverKeys[i] : 'pre',
      next: next
    };

    if (isPre) {
      bump.preArr = [preArr[0]].concat(arr);
      bump.pre = bump.preArr.join('.');
      bump.ver = ver;
      bump.verArr = verArr;
    }
    else {
      bump.ver = arr.join('.');
      bump.verArr = arr;
      bump.preArr = preArr;
      bump.pre = pre;
    }

    bump.full = bump.pre && bump.pre.length ? bump.ver + '-' + bump.pre : bump.ver;

  }

  _pkg.version = bump.full;
  pkg(_pkg);

  log.write(`bumped ${_pkg.name} from ${origVer} to ${bump.full}.`);


}

/**
 * TS Node Register
 * Calls ts-node's register method for use with testing frameworks..
 * @see https://github.com/TypeStrong/ts-node#configuration-options
 *
 * @param project the tsconfig.json path or ts-node options.
 * @param opts ts-node options.
 */
export function tsnodeRegister(project?: string | ITSNodeOptions, opts?: ITSNodeOptions) {

  if (isPlainObject(project)) {
    opts = <ITSNodeOptions>project;
    project = undefined;
  }

  const defaults = {
    project: './src/tsconfig.spec.json',
    fast: true
  };

  opts = extend<ITSNodeOptions>({}, defaults, opts);

  tsnode.register(opts);

}

/**
 * Serve
 * Hook to Browser Sync accepts name and options returning a Browser Sync Server Instance.
 * @see https://www.browsersync.io/docs/api
 *
 * @param name the name of the server or Browser Sync options.
 * @param options the Browser Sync Options.
 */
export function serve(name?: string | bsync.Options, options?: bsync.Options): bsync.BrowserSyncInstance {

  const _pkg = pkg();

  if (isPlainObject(name)) {
    options = <bsync.Options>name;
    name = undefined;
  }

  const defaults: bsync.Options = {
    server: {
      baseDir: './dist'
    }
  };

  name = name || _pkg.name || 'dev-server';
  options = extend({}, defaults, options);

  const server = bsync.create(<string>name);

  server.init(options, (err) => {
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
 * Layout
 * Creates a CLI layout much like creating divs in the terminal.
 * Supports strings with \t \s \n or IUIOptions object.
 * @see https://www.npmjs.com/package/cliui
 *
 * @param width the width of the layout.
 * @param wrap if the layout should wrap.
 */
export function layout(width?: number, wrap?: boolean) {

  // Base width of all divs.
  width = width || 95;

  const ui = cliui({ width: width, wrap: wrap });

  function invalidExit(element, elements) {
    if (isString(element) && elements.length && isPlainObject(elements[0]))
      log.error('invalid element(s) cannot mix string element with element options objects.').exit();
  }

  function add(type: string, ...elements: any[]) {
    ui[type](...elements);
  }

  /**
   * Div
   * Adds Div to the UI.
   *
   * @param elements array of string or IUIOptions
   */
  function div<T>(...elements: T[]) {
    add('div', ...elements);
  }

  /**
   * Span
   * Adds Span to the UI.
   *
   * @param elements array of string or IUIOptions
   */
  function span<T>(...elements: T[]) {
    add('span', ...elements);
  }

  /**
   * Get
   * Gets the defined UI as string.
   */
  function getString() {
    return ui.toString() || '';
  }

  /**
   * Render
   * Renders out the defined UI.
   * When passing elements in render they default to "div" layout.
   *
   * @param elements optional elements to be defined at render.
   */
  function render<T>(...elements: T[]) {
    if (elements.length)
      add('div', ...elements);
    console.log(getString());
  }

  return {
    ui,
    div,
    span,
    render
  };


}

/**
 * String Builder
 * Builds string then joins by char with optional colorization.
 *
 * @param str the base value to build from if any.
 */
export function stringBuilder(str?: any): IStringBuilderMethods {

  const arr = [];
  str = str || '';

  let methods: IStringBuilderMethods;
  let result;

  /**
   * Add
   * Adds a value to the collection for rendering.
   *
   * @param str the string to be added.
   * @param styles any colurs styles to be applied.
   */
  function add(str: any, styles: string | string[]) {
    if (isString(styles))
      styles = (styles as string).split('.');
    styles = toArray(styles, null, []);
    if (styles.length)
      str = colurs.applyAnsi(str, styles);
    arr.push(str);
    return methods;
  }

  /**
   * Join
   *
   * @param char the char used for joining array.
   */
  function join(char?: string) {
    char = char || ' ';
    result = arr.join(char);
    return methods;
  }

  /**
   * Format
   *
   * @param args arguments used to format string.
   */
  function format(...args: any[]) {
    if (!result)
      join();
    result = stringFormat(result, args);
    return methods;
  }

  /**
   * Render
   * Joins and renders the built string.
   *
   * @param char optional character to join by.
   */
  function render(char?: string) {
    if (result)
      return result;
    join();
    return result;
  }

  methods = {
    add,
    join,
    format,
    render
  };

  return methods;

}

/**
 * String Format
 * Very simple string formatter by index.
 * Supports using %s or %n chars.
 *
 * @private
 * @param str the string to be formatted.
 * @param args arguments used for formatting.
 */
export function stringFormat(str, ...args: any[]) {

  let ctr = 0;

  return str.replace(/%(s|n)/g, (cur) => {
    const val = args[ctr];
    ctr++;
    return val || cur;
  });

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