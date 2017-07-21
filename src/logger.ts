/**
 * Logger
 * Barebones just for building apps logs only to console.
 */



import { relative } from 'path';
import * as colurs from 'colurs';
import { isDebug, keys } from 'chek';

const clrs = colurs.get();
let _depth = 1;
let _level = 2;

if (isDebug())
  _level = 3;

// Logger types.
const types = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  debug: 'magenta'
};

const typeKeys = keys(types);

function getConsole(type?) {
  let consol: any = console.log;
  if (type && console[type])
    consol = console[type];
  return consol.bind(console);
}

/**
 * Parse Stack
 * Simple stack parser to limit and stylize stacktraces.
 *
 * @private
 * @param stack the stacktrace to be parsed.
 * @param depth the depth to trace.
 * @param colors whether to colorize output.
 */
function parseStack(stack, depth, colors) {
  let arr = [];
  depth = depth || 0;
  if (!stack) return;
  stack = stack.split('\n');
  stack.forEach((s, i) => {
    if (i === 0 && depth !== 0) return;
    if (depth !== 0 && i > depth) return;
    let filename, column, line;
    s = s.replace(/^\s+/, '').replace(/^.+\(/, '').replace(/\)$/, '');
    s = s.split(':');
    filename = s[0];
    column = s[1];
    line = s[2];
    // Make path relative to cwd if not
    // module.js, bootstrap_node.js etc.
    if (/^\//.test(filename))
      filename = '/' + relative(process.cwd(), filename);
    if (colors) {
      filename = filename ? clrs.green(filename) : ''; // colorize.apply(filename, 'green') : '';
      column = column ? clrs.yellow(filename) : ''; // colorize.apply(column, 'yellow') : '';
      line = line ? clrs.yellow(filename) : ''; // colorize.apply(line, 'yellow') : '';
    }
    let str = `${filename} ${line}:${column}`;
    arr.push(str);
  });
  return arr;
}

/**
 * Error
 * Logs error and parses stack if present.
 *
 * @private
 * @param err the error to be logged.
 */
function error(err) {

  if (typeof err === 'string') {
    const args = [].slice.call(arguments, 0);
    logger('error', ...args);
  }

  else {
    const name = err.name || 'Error';
    const msg = err.message || 'Unknown error.';
    let stack = parseStack(err.stack, _depth, true);
    logger('error', msg, stack[0]);
  }

}

/**
 * Logger
 * Simple logging method.
 *
 * @private
 * @param type the type of log message.
 * @param args args to apply in console.
 */
function logger(type, ...args: any[]) {
  const idx = typeKeys.indexOf(type);
  if (idx > _level || idx === -1)
    return;
  if (typeKeys.indexOf(type) !== -1)
    type = clrs[types[type]](type);
  args.unshift(type + ':');
  getConsole(type)(...args);
  return methods;
}

const methods = {
  error: error,
  warn: logger.bind(logger, 'warn'),
  info: logger.bind(logger, 'info'),
  debug: logger.bind(logger, 'debug'),
  write: function write(...args: any[]) { getConsole()(...args); return methods; },
  exit: process.exit,
  depth: (depth?: number) => { if (depth) _depth = depth; else return _depth; },
  level: (level?: number) => { if (level) _level = level; else return _level; }
};

export = methods;
