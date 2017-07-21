"use strict";
/**
 * Logger
 * Barebones just for building apps logs only to console.
 */
var path_1 = require("path");
var colurs = require("colurs");
var chek_1 = require("chek");
var clrs = colurs.get();
var _depth = 1;
var _level = 2;
if (chek_1.isDebug())
    _level = 3;
// Logger types.
var types = {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    debug: 'magenta'
};
var typeKeys = chek_1.keys(types);
function getConsole(type) {
    var consol = console.log;
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
    var arr = [];
    depth = depth || 0;
    if (!stack)
        return;
    stack = stack.split('\n');
    stack.forEach(function (s, i) {
        if (i === 0 && depth !== 0)
            return;
        if (depth !== 0 && i > depth)
            return;
        var filename, column, line;
        s = s.replace(/^\s+/, '').replace(/^.+\(/, '').replace(/\)$/, '');
        s = s.split(':');
        filename = s[0];
        column = s[1];
        line = s[2];
        // Make path relative to cwd if not
        // module.js, bootstrap_node.js etc.
        if (/^\//.test(filename))
            filename = '/' + path_1.relative(process.cwd(), filename);
        if (colors) {
            filename = filename ? clrs.green(filename) : ''; // colorize.apply(filename, 'green') : '';
            column = column ? clrs.yellow(filename) : ''; // colorize.apply(column, 'yellow') : '';
            line = line ? clrs.yellow(filename) : ''; // colorize.apply(line, 'yellow') : '';
        }
        var str = filename + " " + line + ":" + column;
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
        var args = [].slice.call(arguments, 0);
        logger.apply(void 0, ['error'].concat(args));
    }
    else {
        var name = err.name || 'Error';
        var msg = err.message || 'Unknown error.';
        var stack = parseStack(err.stack, _depth, true);
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
function logger(type) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var idx = typeKeys.indexOf(type);
    if (idx > _level || idx === -1)
        return;
    if (typeKeys.indexOf(type) !== -1)
        type = clrs[types[type]](type);
    args.unshift(type + ':');
    getConsole(type).apply(void 0, args);
    return methods;
}
var methods = {
    error: error,
    warn: logger.bind(logger, 'warn'),
    info: logger.bind(logger, 'info'),
    debug: logger.bind(logger, 'debug'),
    write: function write() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        getConsole().apply(void 0, args);
        return methods;
    },
    exit: process.exit,
    depth: function (depth) { if (depth)
        _depth = depth;
    else
        return _depth; },
    level: function (level) { if (level)
        _level = level;
    else
        return _level; }
};
module.exports = methods;
//# sourceMappingURL=logger.js.map