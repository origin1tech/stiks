"use strict";
/**
 * Logger
 * Barebones just for building apps logs only to console.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var colurs_1 = require("colurs");
var chek_1 = require("chek");
var util_1 = require("util");
var colurs = colurs_1.get();
var DEFAULTS = {
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
var TYPES = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'magenta'
};
var TYPE_KEYS = chek_1.keys(TYPES);
var FORMAT_TOKEN_EXP = /(%s|%d|%j|%%)/g;
var Logger = (function () {
    function Logger(options) {
        var debugOpts;
        if (chek_1.isDebug())
            debugOpts = { level: 'debug' };
        this.options = chek_1.extend({}, DEFAULTS, debugOpts, options);
        this.stream = this.options.stream || process.stdout;
    }
    /**
     * Get Index
     * Gets the index of a value in an array.
     *
     * @param key the key to get the index for.
     * @param arr the array to be inspected.
     */
    Logger.prototype.getIndex = function (key, arr) {
        return arr.indexOf(key);
    };
    /**
     * Colorize
     * Applies ansi styles to value.
     *
     * @param val the value to be colorized.
     * @param styles the styles to be applied.
     */
    Logger.prototype.colorize = function (val, styles) {
        return colurs.applyAnsi(val, styles);
    };
    /**
     * Colorize If
     * If colors are enabled apply ansi styles to value.
     *
     * @param val the value to be colorized.
     * @param styles the styles to be applied.
     */
    Logger.prototype.colorizeIf = function (val, styles) {
        if (!this.options.colors)
            return val;
        return this.colorize(val, styles);
    };
    /**
     * Parse Stack
     * Simple stack parser to limit and stylize stacktraces.
     *
     * @param stack the stacktrace to be parsed.
     * @param prune number of stack frames to prune.
     * @param depth the depth to trace.
     */
    Logger.prototype.parseStack = function (stack, prune, depth) {
        var _this = this;
        prune = prune || 0;
        depth = depth || this.options.depth;
        if (!stack)
            return null;
        var frames = [];
        var traced = [];
        var miniStack;
        stack.split('\n')
            .slice(prune)
            .forEach(function (s, i) {
            if (i >= depth)
                return;
            var relativeFile, filename, column, line, method;
            method = s;
            method = s.replace(/^\s*at\s?/, '').split(' ')[0];
            s = s.replace(/^\s+/, '').replace(/^.+\(/, '').replace(/\)$/, '');
            s = s.split(':');
            filename = s[0];
            column = s[1];
            line = s[2];
            var isModule = /^module/.test(filename);
            relativeFile = filename;
            // Make path relative to cwd if not
            // module.js, bootstrap_node.js etc.
            if (/^\//.test(filename) && !isModule)
                relativeFile = "/" + path_1.relative(process.cwd(), filename);
            var parsedRelative = isModule ? filename : path_1.parse(relativeFile);
            var frame = {
                method: method,
                filename: filename,
                relative: relativeFile,
                line: chek_1.toInteger(line, 0),
                column: chek_1.toInteger(column, 0)
            };
            // const trace = `    at ${this.colorizeIf(method || 'uknown', 'magenta')} (${this.colorizeIf(relativeFile, 'green')}:${this.colorizeIf(line, 'yellow')}:${this.colorizeIf(column, 'yellow')})`;
            var trace = _this.colorizeIf("    at " + method + " (" + relativeFile + ":" + line + ":" + column + ")", 'gray');
            if (i === 0)
                miniStack = _this.colorizeIf("(" + parsedRelative.base + ":" + line + ":" + column + ")", 'gray');
            frames.push(frame);
            traced.push(trace);
        });
        return {
            frames: frames,
            stack: traced,
            miniStack: miniStack
        };
    };
    /**
     * Get Timestamp
     * Gets a timestamp by format.
     *
     * @param format the format to return.
     */
    Logger.prototype.getTimestamp = function (format) {
        format = format || this.options.timestamp;
        var timestamp = (new Date()).toISOString();
        var split = timestamp.replace('Z', '').split('T');
        var idx = format === 'date' ? 0 : 1;
        if (format === true)
            return timestamp;
        return split[idx];
    };
    /**
     * Uncaught Exception
     * Handler for uncaught excrptions.
     *
     * @param err the error caught by process uncaughtException.
     */
    Logger.prototype.uncaughtException = function (err) {
        if (!this.options.errorCapture)
            throw err;
        this.error(err);
        // Remove the listener to prevent exception loops.
        this.toggleExceptionHandler(false);
    };
    /**
     * Toggle Exception Handler
     * Toggles uncaughtException listener.
     *
     * @param capture whether to capture uncaught exceptions or not.
     */
    Logger.prototype.toggleExceptionHandler = function (capture) {
        if (!capture)
            process.removeListener('uncaughtException', this.uncaughtException);
        else
            process.on('uncaughtException', this.uncaughtException);
    };
    /**
     * Logger
     * Private common logger method.
     *
     * @param type the type of log message to log.
     * @param args the arguments to be logged.
     */
    Logger.prototype.logger = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var stackTrace;
        var err, errMsg, meta, prune, timestamp, msg, normalized, rawMsg;
        var fn = chek_1.noop;
        var clone = args.slice(0);
        var result = [];
        var suffix = [];
        var idx = this.getIndex(type, TYPE_KEYS);
        var level = this.getIndex(this.options.level, TYPE_KEYS);
        if (idx > level || idx === -1)
            return this;
        if (chek_1.isFunction(chek_1.last(clone))) {
            fn = clone.pop();
            args.pop();
        }
        meta = chek_1.isPlainObject(chek_1.last(clone)) ? clone.pop() : null;
        err = chek_1.isError(chek_1.first(clone)) ? clone.shift() : null;
        stackTrace = err ? this.parseStack(err.stack, 1) : this.parseStack((new Error('get stack')).stack, 3);
        timestamp = "" + this.getTimestamp();
        // Add optional timestamp.
        if (this.options.timestamp)
            result.push(this.colorizeIf("[" + timestamp + "]", 'magenta'));
        // Add the type.
        result.push(this.colorizeIf(type + ":", TYPES[type]));
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
                    rawMsg = util_1.format(clone[0], clone.slice(1));
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
            result.push(util_1.format(util_1.inspect(meta, null, null, this.options.colors)));
        }
        // Add ministack.
        if (this.options.miniStack && stackTrace)
            result.push(this.colorizeIf(stackTrace.miniStack, 'gray'));
        // Add stack trace if error.
        if (err && stackTrace) {
            if (this.options.prettyStack)
                suffix.push(util_1.format(util_1.inspect(stackTrace.frames, null, null, this.options.colors)));
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
    };
    /**
     * Get
     * Gets a current option value.
     *
     * @param key the option key to get.
     */
    Logger.prototype.get = function (key) {
        return this.options[key];
    };
    /**
     * Set
     * Sets options for Logger.
     *
     * @param key the key or options object to be set.
     * @param value the value for the key.
     */
    Logger.prototype.set = function (key, value) {
        if (chek_1.isPlainObject(key)) {
            this.options = chek_1.extend({}, this.options, key);
        }
        else {
            if (this.options[key])
                this.options[key] = value;
        }
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.logger.apply(this, ['error'].concat(args));
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.logger.apply(this, ['warn'].concat(args));
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.logger.apply(this, ['info'].concat(args));
    };
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.logger.apply(this, ['debug'].concat(args));
    };
    Logger.prototype.write = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args[0] = args[0] || '';
        var msg;
        if (FORMAT_TOKEN_EXP.test(args[0]))
            msg = util_1.format(args[0], args.slice(1));
        else
            msg = args.join(' ');
        this.stream.write(msg + '\n');
        return this;
    };
    Logger.prototype.exit = function (code) {
        process.exit(code || 0);
    };
    return Logger;
}());
exports.Logger = Logger;
var instance;
function createInstance(options) {
    if (!instance)
        instance = new Logger(options);
    return instance;
}
exports.get = createInstance;
//# sourceMappingURL=logger.js.map