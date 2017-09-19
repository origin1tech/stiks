
import { castType, getType, toBoolean, contains } from 'chek';

// The original array.
let _args: string[] = process.argv.slice(0);

// The original args with node and executed path stripped.
let _baseArgs: string[] = _args.slice(2);

// The original args without node, executed path and first command stripped.
let _optionArgs: string[] = _baseArgs.slice(1);

// Array of packages to install
const _cmds = [];

// Flags passed in cli.
const _flags = {};

// Expression for finding flags.
const _flagExp = /^--?/;

// Holds array of args to be excluded.
const _exclude = [];

/**
 * Is Flag
 * Checks if value is type of flag param.
 *
 * @param flag the value to inspect to detect if is flag.
 */
export function isFlag(flag: string) {
  if (_flagExp.test(flag)) {
    if (/^--/.test(flag))
      return 'value';
    return 'boolean';
  }
  return false;
}

/**
 * Parse Element
 * Inspects value parses value as command or flag.
 *
 * @param val the value to inspect/convert to flag.
 * @param idx the current index position of the value.
 * @param args the array of argv params.
 */
export function parseElement(val: string, idx: number, args: any[]) {
  const flagType = isFlag(val);
  if (!flagType)
    return false;
  if (flagType === 'boolean')
    return true;
  const nextIdx = idx + 1;
  if (args[nextIdx]) {
    _exclude.push(nextIdx);
    const val = args[nextIdx];
    if (val === 'true' || val === 'false')
      return toBoolean(val);
    return castType(val, getType(val));
  }
  // If not next arg is boolean flag.
  return true;
}

// Parse the arguments
export function parse(args?: any[]): { flags: { [key: string]: any }, cmds: any[], cmd: string } {
  args = args || _baseArgs;
  args.forEach((el, idx) => {
    const flag = parseElement(el, idx, args);
    if (!flag && _exclude.indexOf(idx) === -1)
      _cmds.push(el);
    else if (flag)
      _flags[el.replace(_flagExp, '')] = flag;
  });
  return {
    flags: _flags,
    cmds: _cmds,
    cmd: _cmds[0] // the primary command.
  };
}

/**
 * Find
 * Iterates expected or valid values stopping if matching value is found in provided args.
 *
 * @param valid array of expected valid values.
 * @param args array of params to inspect.
 */
export function find(valid: string[], args?: string[]) {

  // If no command line args passed try to parse them.
  args = args || parse().cmds;
  let i = valid.length;
  let found;
  while (i-- && !found) {
    if (contains(args, valid[i]))
      found = valid[i];
  }
  return found;

}

export { _args as args, _baseArgs as normalized, _optionArgs as options };

