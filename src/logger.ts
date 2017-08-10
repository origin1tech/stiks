/**
 * Logger
 * Barebones just for building apps logs only to console.
 */



import { relative, parse } from 'path';
import { get as colursInstance } from 'colurs';
import { extend, isDebug, keys, isBoolean, isPlainObject, isError, first, last, noop, isFunction, isNumber, toArray, toInteger } from 'chek';
import { ILoggerOptions, IStacktraceFrame, IStacktraceResult, LogCallback } from './interfaces';
import { format, inspect } from 'util';

const colurs = colursInstance();

const DEFAULTS = {
  depth: 2,
  level: 'info',
  colors: true,
  errorExit: true,
  errorCapture: false,
  stackTrace: true,
  prettyStack: false,
  miniStack: true,
  timestamp: 'time'
};

// Logger types.
const TYPES = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'magenta'
};

const TYPE_KEYS = keys(TYPES);
const FORMAT_TOKEN_EXP = /(%s|%d|%j|%%)/g;

export class Logger {

  stream: NodeJS.WritableStream;
  options: ILoggerOptions;

  constructor(options?: ILoggerOptions) {

    let debugOpts;

    if (isDebug())
      debugOpts = { level: 'debug' };

    this.options = extend({}, DEFAULTS, debugOpts, options);

    this.stream = this.options.stream || process.stdout;

  }

  /**
   * Get Index
   * Gets the index of a value in an array.
   *
   * @param key the key to get the index for.
   * @param arr the array to be inspected.
   */
  private getIndex(key: any, arr: any[]) {
    return arr.indexOf(key);
  }

  /**
   * Colorize
   * Applies ansi styles to value.
   *
   * @param val the value to be colorized.
   * @param styles the styles to be applied.
   */
  private colorize(val: any, styles: string | string[]) {
    return colurs.applyAnsi(val, styles);
  }

  /**
   * Colorize If
   * If colors are enabled apply ansi styles to value.
   *
   * @param val the value to be colorized.
   * @param styles the styles to be applied.
   */
  private colorizeIf(val: any, styles: string | string[]) {
    if (!this.options.colors)
      return val;
    return this.colorize(val, styles);
  }

  /**
   * Parse Stack
   * Simple stack parser to limit and stylize stacktraces.
   *
   * @param stack the stacktrace to be parsed.
   * @param prune number of stack frames to prune.
   * @param depth the depth to trace.
   */
  private parseStack(stack: any, prune?: number, depth?: number): IStacktraceResult {

    prune = prune || 0;
    depth = depth || this.options.depth;

    if (!stack)
      return null;

    const frames = [];
    const traced = [];
    let miniStack;

    stack.split('\n')
      .slice(prune)
      .forEach((s, i) => {

        if (i >= depth)
          return;

        let relativeFile, filename, column, line, method;

        method = s;
        method = s.replace(/^\s*at\s?/, '').split(' ')[0];
        s = s.replace(/^\s+/, '').replace(/^.+\(/, '').replace(/\)$/, '');
        s = s.split(':');
        filename = s[0];
        column = s[1];
        line = s[2];

        const isModule = /^module/.test(filename);
        relativeFile = filename;

        // Make path relative to cwd if not
        // module.js, bootstrap_node.js etc.
        if (/^\//.test(filename) && !isModule)
          relativeFile = `/${relative(process.cwd(), filename)}`;

        const parsedRelative = isModule ? filename : parse(relativeFile);

        const frame = {
          method: method,
          filename: filename,
          relative: relativeFile,
          line: toInteger(line, 0),
          column: toInteger(column, 0)
        };

        // const trace = `    at ${this.colorizeIf(method || 'uknown', 'magenta')} (${this.colorizeIf(relativeFile, 'green')}:${this.colorizeIf(line, 'yellow')}:${this.colorizeIf(column, 'yellow')})`;

        const trace = this.colorizeIf(`    at ${method} (${relativeFile}:${line}:${column})`, 'gray');

        if (i === 0)
          miniStack = this.colorizeIf(`(${parsedRelative.base}:${line}:${column})`, 'gray');

        frames.push(frame);
        traced.push(trace);

      });

    return {
      frames: frames,
      stack: traced,
      miniStack: miniStack
    };

  }

  /**
   * Get Timestamp
   * Gets a timestamp by format.
   *
   * @param format the format to return.
   */
  private getTimestamp(format?: boolean | 'time' | 'date') {
    format = format || this.options.timestamp;
    const timestamp = (new Date()).toISOString();
    const split = timestamp.replace('Z', '').split('T');
    const idx = format === 'date' ? 0 : 1;
    if (format === true)
      return timestamp;
    return split[idx];
  }

  /**
   * Uncaught Exception
   * Handler for uncaught excrptions.
   *
   * @param err the error caught by process uncaughtException.
   */
  private uncaughtException(err: Error) {
    if (!this.options.errorCapture)
      throw err;
    this.error(err);
    // Remove the listener to prevent exception loops.
    this.toggleExceptionHandler(false);
  }

  /**
   * Toggle Exception Handler
   * Toggles uncaughtException listener.
   *
   * @param capture whether to capture uncaught exceptions or not.
   */
  private toggleExceptionHandler(capture?: boolean) {
    if (!capture)
      process.removeListener('uncaughtException', this.uncaughtException);
    else
      process.on('uncaughtException', this.uncaughtException);
  }

  /**
   * Logger
   * Private common logger method.
   *
   * @param type the type of log message to log.
   * @param args the arguments to be logged.
   */
  private logger(type: string, ...args: any[]) {

    let stackTrace: IStacktraceResult;
    let err, errMsg, meta, prune, timestamp, msg, normalized, rawMsg;
    let fn = noop;
    const clone = args.slice(0);
    const result = [];
    const suffix = [];
    const idx = this.getIndex(type, TYPE_KEYS);
    const level = this.getIndex(this.options.level, TYPE_KEYS);

    if (idx > level || idx === -1)
      return this;

    if (isFunction(last(clone))) {
      fn = clone.pop();
      args.pop();
    }

    meta = isPlainObject(last(clone)) ? clone.pop() : null;
    err = isError(first(clone)) ? clone.shift() : null;
    stackTrace = err ? this.parseStack(err.stack, 1) : this.parseStack((new Error('get stack')).stack, 3);
    timestamp = `${this.getTimestamp()}`;

    // Add optional timestamp.
    if (this.options.timestamp)
      result.push(this.colorizeIf(`[${timestamp}]`, 'magenta'));

    // Add the type.
    result.push(this.colorizeIf(`${type}:`, TYPES[type]));

    // If error we need to build the message.
    if (err) {
      errMsg = (err.name || 'Error') + ': ';
      errMsg += (err.message || 'Uknown Error');
      clone.unshift(errMsg);
    }

    rawMsg = clone[0] || null;

    // Format the message.
    if (clone.length) {
      if (clone.length > 1) {
        if (FORMAT_TOKEN_EXP.test(clone[0])) {
          rawMsg = format(clone[0], clone.slice(1))
          result.push(rawMsg);
        }
        else {
          rawMsg = clone.join(' ');
          result.push(rawMsg);
        }
      }
      else {
        result.push(clone[0]);
      }
    }

    // Add formatted metadata to result.
    if (meta) {
      result.push(format(inspect(meta, null, null, this.options.colors)));
    }

    // Add ministack.
    if (this.options.miniStack && stackTrace)
      result.push(this.colorizeIf(stackTrace.miniStack, 'gray'));

    // Add stack trace if error.
    if (err && stackTrace) {
      if (this.options.prettyStack)
        suffix.push(format(inspect(stackTrace.frames, null, null, this.options.colors)));
      else
        suffix.push(stackTrace.stack.join('\n'));
    }

    msg = result.join(' ');
    msg = (suffix.length ? msg + '\n' + suffix.join('\n') : msg) + '\n';

    // Output to stream.
    this.stream.write(msg);

    // Check if should exit on error.
    if (type === 'error' && this.options.errorExit)
      process.exit();

    // Call callback.
    fn(type, rawMsg, meta, {
      timestamp: timestamp,
      error: err,
      stackTrace: stackTrace.frames,
      args: args
    });

    return this;

  }

  /**
   * Get
   * Gets a current option value.
   *
   * @param key the option key to get.
   */
  get<T>(key: string): T {
    return this.options[key];
  }

  /**
   * Set
   * Sets options for Logger.
   *
   * @param key the key or options object to be set.
   * @param value the value for the key.
   */
  set(key: string | ILoggerOptions, value: any) {
    if (isPlainObject(key)) {
      this.options = extend({}, this.options, key);
    }
    else {
      if (this.options[<string>key])
        this.options[<string>key] = value;
    }
  }

  error(...args: any[]): Logger {
    return this.logger('error', ...args);
  }

  warn(...args: any[]): Logger {
    return this.logger('warn', ...args);
  }

  info(...args: any[]): Logger {
    return this.logger('info', ...args);
  }

  debug(...args: any[]): Logger {
    return this.logger('debug', ...args);
  }

  write(...args: any[]): Logger {
    args[0] = args[0] || '';
    let msg;
    if (FORMAT_TOKEN_EXP.test(args[0]))
      msg = format(args[0], args.slice(1));
    else
      msg = args.join(' ');
    this.stream.write(msg + '\n');
    return this;
  }

  exit(code?: number) {
    process.exit(code || 0);
  }

}

let instance: Logger;

function createInstance(options?: ILoggerOptions) {
  if (!instance)
    instance = new Logger(options);
  return instance;
}


export { createInstance as get };



