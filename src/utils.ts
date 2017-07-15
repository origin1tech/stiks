/**
 * File operations
 * Read, Remove, Copy etc.
 *
 * All paths will be resolved from current working directory.
 */

import { CopyTuple, IMap, ICopy } from './interfaces';
import { readFileSync, readJSONSync, copySync } from 'fs-extra';
import * as del from 'del';
import { resolve, parse, relative, join } from 'path';
import { toArray, isString, split, isPlainObject, isArray, keys, isNumber, castType, isValue } from 'chek';
import * as log from './logger';

const cwd = process.cwd();

/**
 * Clean
 * Removes file(s) using provided glob(s).
 *
 * @param globs glob or array of glob strings.
 */
export function clean(globs: string | string[]) {
  globs = toArray(globs);
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
 * Loads the package.json file for project.
 */
export function pkg() {
  return readJSONSync(resolve(cwd, 'package.json'));
}

export function semver(max?: number) {

  class Server {

    pkg: IMap<any>;
    version: string;
    prerelease: string;

    constructor() {

    }

    load() {
      const _pkg = pkg();
      const ver = _pkg.version;
      const verSplit = split(ver, '-');
      const verArr = castType(split(verSplit[0]), ['integer']);
      const pre = verSplit[1] || '';

      let preSplit, preType;

      if (isValue(pre)) {
        preSplit = split(pre);
        preType = preSplit[0];
      }
    }

    toArray() {

    }

  }

  return methods;

}
