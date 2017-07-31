
import { castType, getType } from 'chek';

let _args = process.argv.slice(2);

// Array of packages to install
const _cmds = [];

// Flags passed in cli.
const _flags = {};

// Expression for finding flags.
const _flagExp = /^--?/;

// Holds array of args to be excluded.
const _exclude = [];

// Checks if argument is a flag.
function isFlag(flag: string) {
  if (_flagExp.test(flag)) {
    if (/^--/.test(flag))
      return 'value';
    return 'boolean';
  }
  return false;
}

// Gets the flag.
function getFlag(flag: string, idx: number, args: any[]) {
  const flagType = isFlag(flag);
  if (!flagType)
    return false;
  if (flagType === 'boolean')
    return true;
  const nextIdx = idx + 1;
  if (args[nextIdx]) {
    _exclude.push(nextIdx);
    return args[nextIdx];
  }
  // fallback to just boolean
  // if next arg not avail.
  return true;
}

// Parse the arguments
function parse(args?: any[]): { flags: { [key: string]: any }, cmds: any[] } {
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
    cmds: _cmds
  };
}

export {
  isFlag,
  getFlag,
  parse
};
