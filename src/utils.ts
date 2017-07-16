/**
 * File operations
 * Read, Remove, Copy etc.
 *
 * All paths will be resolved from current working directory.
 */

import { CopyTuple, IMap, ICopy, ISemverMax } from './interfaces';
import { readFileSync, readJSONSync, copySync } from 'fs-extra';
import * as del from 'del';
import { resolve, parse, relative, join } from 'path';
import { toArray, isString, split, isPlainObject, isArray, keys, isNumber, castType, isValue } from 'chek';
import * as log from './logger';

const cwd = process.cwd();

export class Semver {

  filename: string;
  full: string;           // full version incl. pre-release if any.
  ver: string;            // version without pre-release.
  pre: string = '';       // pre-release version if applicable.
  verArr: number[] = [];  // the version as an array.
  preArr: number[] = [];  // the pre-release as an array.

  constructor(filename?: string) {

    this.filename = filename;

    const _pkg = pkg(filename);
    const parsed = this.parse(_pkg.version);
    this.full = parsed.full;
    this.ver = parsed.ver;
    this.verArr = parsed.verArr;
    this.pre = parsed.pre;
    this.preArr = parsed.preArr;

  }

  /**
   * Parse
   * Parses a version string.
   *
   * @param ver the version string to parse.
   */
  private parse(ver: string) {

    ver = ver.replace(/^(=|v|^|~)/, '');
    const full = ver;
    const verSplit = split(full, '-');
    ver = verSplit[0];
    const verArr = castType<number[]>(split(ver), ['integer'], []);

    if (verArr.length < 3)
      log.error('the parsed version is invalid, missing major, minor or patch in semver.)');

    const pre = verSplit[1] || '';
    let preSplit, preArr;

    if (isValue(pre)) {
      preSplit = split(pre);
      preArr = castType<any[]>(preSplit, ['string', 'integer'], []);
      if (preArr.length < 2)
        log.error('the prerelease is invalid, examples "alpha.1", "rc.1.0" )');
    }

    return {
      full,
      ver,
      pre,
      verArr,
      preArr
    };

  }

  private update() {
    this.full = this.pre && this.pre.length ? this.ver + '-' + this.pre : this.ver;
  }

  /**
   * Get Index
   * Gets the current value in semver by index and the next value.
   *
   * @param idx the index in version array.
   * @param next optional next value.
   */
  private getIndex(idx: number, next?: number) {
    if (!isValue(this.verArr[idx]))
      log.error(`cannot get version at index ${idx} of undefined.`);
    return { current: this.verArr[idx], next: next || this.verArr[idx] + 1 };
  }

  /**
   * Set Index
   * Sets the value in semver by index.
   *
   * @param idx the index in semver to set.
   * @param next the next value to be set.
   */
  private setIndex(idx: number, next: number) {
    if (!isValue(this.verArr[idx]))
      log.error(`could not set version at index ${idx} of undefined.`);
    this.verArr[idx] = next;
    this.ver = this.verArr.join('.');
  }

  private setPre(idx: number, next: number) {
    const arr = this.preArr.slice(1);
    if (arr) {

    }
  }

  /**
   * Before Bump
   * Calculates and returns bumped values.
   *
   * @private
   */
  private beforeBump() {

    const _keys = ['major', 'minor', 'patch'];
    let arr = [].slice.call(this.verArr, 0);
    let isPre = false;

    if (this.preArr.length) {
      arr = [].slice.call(this.preArr, 1);
      isPre = true;
    }

    let i = arr.length;
    let bump: any;

    while (i-- && !bump) {

      const next = arr[i] + 1;

      arr[i] = next;

      // If previous version level set to 0.
      if (isValue(arr[i - 1]))
        arr[i - 1] = 0;

      bump = {
        type: !isPre ? _keys[i] : 'pre',
        next: next
      };

      if (isPre) {
        bump.preArr = [this.preArr[0]].concat(arr);
        bump.pre = bump.preArr.join('.');
        bump.ver = this.ver;
        bump.verArr = this.verArr;
      }
      else {
        bump.ver = arr.join('.');
        bump.verArr = arr;
        bump.preArr = this.preArr;
        bump.pre = this.pre;
      }

      bump.full = bump.pre && bump.pre.length ? bump.ver + '-' + bump.pre : bump.ver;

    }

    return bump;
  }

  major(val?: number): Semver {
    const cur = this.getIndex(0, val);
    this.setIndex(0, cur.next);
    return this;
  }

  minor(val?: number): Semver {
    const cur = this.getIndex(1, val);
    this.setIndex(1, cur.next);
    return this;
  }

  patch(val?: number): Semver {
    const cur = this.getIndex(2, val);
    this.setIndex(2, cur.next);
    return this;
  }

  prerelease(prefix: string, val?: number): Semver {
    const cur = this.getIndex(2, val);
    this.setIndex(2, cur.next);
    return this;
  }

  /**
   * Bump
   * Gets ONLY or gets and sets version bump.
   *
   * @param suppress optional bool to suppress setting values.
   */
  bump(suppress?: boolean): Semver {

    const bumped = this.beforeBump();

    if (suppress)
      return bumped;

    this.full = bumped.full;
    this.ver = bumped.ver;
    this.verArr = bumped.verArr;
    this.pre = bumped.pre;
    this.preArr = bumped.preArr;

    return this;

  }

  compare(val1: string, val2: string, operator: string) {
    //
  }

  save() {
    //
  }

}

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
export function pkg(filename?: string) {
  filename = filename || resolve(cwd, 'package.json');
  return readJSONSync(filename);
}

export function semver(filename?: string, max?: number) {
  return new Semver(filename);
}
