
import { castType, getType, toBoolean, contains } from 'chek';

let _args: string[] = process.argv.slice(2);
let origArgs = [].slice.call(_args, 0);

// Array of packages to install
const _cmds = [];

// Flags passed in cli.
const _flags = {};

// Expression for finding flags.
const _flagExp = /^--?/;

// Holds array of args to be excluded.
const _exclude = [];

// Checks if argument is a flag.
export function isFlag(flag: string) {
  if (_flagExp.test(flag)) {
    if (/^--/.test(flag))
      return 'value';
    return 'boolean';
  }
  return false;
}

// Gets the flag.
export function getFlag(flag: string, idx: number, args: any[]) {
  const flagType = isFlag(flag);
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
  // fallback to just boolean
  // if next arg not avail.
  return true;
}

// Parse the arguments
export function parse(args?: any[]): { flags: { [key: string]: any }, cmds: any[], cmd: string } {
  args = args || _args;
  args.forEach((el, idx) => {
    const flag = getFlag(el, idx, args);
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

export function findCommand(valid: string[], args?: string[]) {

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

export { origArgs as args };

