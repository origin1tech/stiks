
import { ILogger } from './interfaces';
import { last, isFunction, isPlainObject, noop, isString } from 'chek';
import { format, inspect } from 'util';
import { Colurs } from 'colurs';

const colurs = new Colurs();

/**
 * Logger
 * : Formats and logs message.
 *
 * @param type the type of message to log.
 * @param args rest param of log arguments.
 */
function logger(type, ...args: any[]): ILogger {

  let msg = args.shift();
  let fn = isFunction(last(args)) ? args.pop() : noop;
  let meta = isPlainObject(last(args)) ? args.pop() : null;

  let obj = {
    type: type,
    msg: null,
    meta: meta
  };

  const formatters = isString(msg) ? (msg as string).match(/%/g) : null;
  if (formatters && formatters.length)
    msg = format(msg, ...args);
  else
    msg = [msg].concat(args).join(' ');

  if (type === 'error' && !(msg instanceof Error)) {
    msg = new Error(msg);
    const stack = msg.stack.split('\n');
    const tmpMsg = stack.shift();
    stack.shift();
    stack.unshift(tmpMsg);
    msg.stack = stack.join('\n');
  }

  // If any error just throw it.
  if (msg instanceof Error) {
    if (fn) fn(msg, obj);
    msg.stack = msg.stack.split('\n').map((s, i) => {
      if (i === 0)
        return colurs.applyAnsi(s, _log.colors[type || 'error']);
      return colurs.applyAnsi(s, 'gray');
    }).join('\n');
    throw msg;
  }

  obj.msg = msg;
  fn(msg, obj);

  if (meta) {
    meta = inspect(meta, null, null, true);
    msg += ('\n' + meta);
  }

  if (type && _log.colors[type])
    msg = colurs.applyAnsi(type.toUpperCase() + ': ', _log.colors[type]) + msg;

  process.stderr.write(msg + '\n');

  return _log;

}

const _log: any = function (...args: any[]) {
  logger(null, ...args);
  return _log;
};

_log.colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green'
};
_log.colorize = true;
_log.error = logger.bind(_log, 'error');
_log.warn = logger.bind(_log, 'warn');
_log.info = logger.bind(_log, 'info');
_log.exit = process.exit;

export const log: ILogger = _log;

