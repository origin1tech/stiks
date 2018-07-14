
import { isBoolean, isArray, isString, camelcase, toNumber, toBoolean, isValue, get, set, toArray } from 'chek';
import { log } from './logger';

// The original args with node and executed path stripped.
const _args: string[] = process.argv.slice(2);

let _command = null;

// Array of packages to install
const _commands = [];

// Flags passed in cli.
const _flags = {};

// Expression for finding flags.
const _flagExp = /^--?/;

// Checks if flag is inverse.
const _noFlagExp = /^--no-/;

/**
 * Cast To Type
 * : Loosely tries to cast numbers and booleans.
 *
 * @param val the value to be cast.
 */
export function castToType(val: any) {
  if (/^(true|false)$/.test(val))
    return toBoolean(val);
  if (/^[\d\.]+$/.test(val))
    return toNumber(val);
  return val;
}

/**
 * Flags To Array
 * : Convert flag object to array.
 *
 * @param flags object containing flags.
 */
export function flagsToArray(flags: any) {
  const arr = [];
  for (const k in flags) {
    const flag = flags[k];
    let prefix = flags[k] === false ? '--no-' : k.length > 1 ? '--' : '-';
    arr.push(prefix + k);
    if (!isBoolean(flags[k]))
      arr.push(flags[k]);
  }
  return arr;
}

/**
 * Split Args
 * : Splits string of command arguments honoring quotes.
 *
 * @param str the string representing arguments.
 */
export function splitArgs(str: string | any[]): any[] {
  if (isArray(str))
    return str as any[];
  if (!isString(str))
    return [];
  let arr = [];
  (str as string)
    .split(/(\x22[^\x22]*\x22)/)
    .filter(x => x)
    .forEach(s => {
      if (s.match('\x22'))
        arr.push(s.replace(/\x22/g, ''));
      else
        arr = arr.concat(s.trim().split(' '));
    });
  return arr;
}

/**
 * Normalize
 * : Spreads multi flag arguments and breaks arguments usign = sign.
 *
 * @example
 * -am: returns -a, -m.
 * --flag=value: returns --flag, value.
 *
 * @param args arguments to be normalized.
 */
export function normalizeArgs(args: any, exclude?: any) {
  let result = [];
  args = splitArgs(args || []);
  exclude = splitArgs(exclude || []);
  args.slice(0).forEach(arg => {
    let val;
    if (arg && arg.indexOf && ~arg.indexOf('=')) {
      const kv = arg.split('=');
      arg = kv[0];
      val = kv[1];
    }
    if (/^-{1}[a-z]+/i.test(arg)) {
      const spread = arg.slice(1).split('').map(a => '-' + a);
      if (val)
        spread.push(val);
      result = result.concat(spread);
    }
    else {
      result.push(arg);
      if (val)
        result.push(val);
    }
  });
  return filterArgs(result, exclude);
}

/**
 * Filter Args
 * : Filters an array of arguments by exclusion list.
 *
 * @param args the arguments to be filtered.
 * @param exclude the arguments to be excluded.
 */
export function filterArgs(args: any, exclude: any) {
  args = splitArgs(args || []);
  exclude = splitArgs(exclude || []);
  let clone = args.slice(0);
  return clone.filter((arg, i) => {
    if (!~exclude.indexOf(arg))
      return true;
    const next = clone[i + 1];
    if (_flagExp.test(arg) && next && !_flagExp.test(next))
      clone.splice(i + 1, 1);
    return false;
  });
}

/**
 * Merge Args
 * : Merges two sets of command arguments.
 *
 * @param def array of default args.
 * @param args array of new args.
 */
export function mergeArgs(def: any, args: any, exclude?: any) {
  exclude = splitArgs(exclude || []);
  def = normalizeArgs(def);
  args = normalizeArgs(args);
  let clone = def.slice(0);
  args.forEach((arg, i) => {
    const next = args[i + 1];
    const isFlag = _flagExp.test(arg);
    const isFlagNext = _flagExp.test(next || '');
    const defIdx = def.indexOf(arg);
    // Arg exists check if flag that accepts value.
    if (~defIdx && isFlag && !isFlagNext) {
      clone[defIdx + 1] = next;
      args.splice(i + 1, 1);
    }
    // new arg just push.
    else if (!~defIdx) {
      clone.push(arg);
    }
  });
  return filterArgs(clone, exclude);
}

/**
 * Parse
 * : Parses command arguments.
 *
 * @param args the arguments to be parsed if null uses process.argv.slice(2)
 * @param exclude any flags or commands that should be excluded.
 */
export function parse(args?: any, exclude?: any) {
  const normalized = normalizeArgs(args || _args, exclude);
  const clone = normalized.slice(0);
  clone.forEach((arg, i) => {
    const next = clone[i + 1];
    const isFlag = _flagExp.test(arg);
    const isFlagNext = _flagExp.test(next || '');
    const isNoFlag = _noFlagExp.test(arg);
    if (isFlag) {
      let key = isNoFlag ? arg.replace(_noFlagExp, '') : arg.replace(_flagExp, '');
      key = key.split('.').map(k => camelcase(k)).join('.'); // handle dot keys.
      let curVal: any = get(_flags, key);
      let exists = isValue(curVal);
      if (exists)
        curVal = toArray(curVal, []);
      if (!isFlagNext && next) {
        if (isNoFlag)
          log.error(`Oops cannot set flag value using inverse (--no-xxx) flag ${arg}.`);
        let val = castToType(next);
        if (exists) {
          curVal.push(val);
          val = curVal;
        }
        set(_flags, key, val);
        clone.splice(i + 1, 1);
      }
      else {
        set(_flags, key, isNoFlag ? false : true);
      }
    }
    else {
      _commands.push(castToType(arg));
    }
  });
  if (_commands)
    _command = _commands.shift();
  return {
    command: _command,
    commands: _commands,
    cmd: _command, // backward compat.
    cmds: _commands, // backward compat.
    flags: _flags,
    source: _args,
    normalized: normalized
  };
}

