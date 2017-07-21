
import { CopyTuple, IMap, ICopy, ITSNodeOptions } from './interfaces';
import { readFileSync, readJSONSync, copySync, writeJSONSync } from 'fs-extra';
import * as npm from './npm';
import * as tsnode from 'ts-node';
import * as del from 'del';
import { resolve, parse, relative, join } from 'path';
import { toArray, isString, split, isPlainObject, isArray, keys, isNumber, castType, isValue, extend } from 'chek';
import * as log from './logger';

const cwd = process.cwd();
let _pkg;

/**
 * Clean
 * Removes file(s) using provided glob(s).
 *
 * @param globs glob or array of glob strings.
 */
export function clean(globs: string | string[]) {
  globs = toArray<string>(globs);
  del.sync(globs);
}

/**
 * Copy
 * Copies source to target.
 *
 * @param src the source path to be copied.
 * @param dest the destination path to copy to.
 */
export function copy(src: string, dest: string) {

  const globs = toArray<string>(src);

  src = resolve(process.cwd(), src);
  dest = resolve(process.cwd(), dest);

  const parsedSrc = parse(src);
  const parsedDest = parse(dest);

  copySync(src, dest);

  log.info(`successfully copied ${relative(cwd, join(parsedSrc.dir, parsedSrc.base))} to ${relative(cwd, join(parsedDest.dir, parsedDest.base))}.`);

}

/**
 * CopyAll
 * Takes collection and copies each source/destination pair.
 *
 * @param copies collection of source and destination targets.
 */
export function copyAll(copies: CopyTuple | IMap<ICopy> | string[]) {

  if (isPlainObject(copies)) {

    keys(<IMap<ICopy>>copies).forEach((k) => {

      const itm: ICopy = copies[k];
      copy(itm.src, itm.dest);

    });

  }

  else if (isArray(copies)) {

    (copies as string[]).forEach((c) => {

      const tuple = isString(c) ? split(c) : c;
      copy(tuple[0], tuple[1]);

    });

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
  if (!val)
    return _pkg || (_pkg = readJSONSync(filename));
  writeJSONSync(filename, val, { spaces: 2 });
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

  log.info(`bumped ${_pkg.name} from ${origVer} to ${bump.full}.`);


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

