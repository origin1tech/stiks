"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chek_1 = require("chek");
var util_1 = require("util");
var colurs_1 = require("colurs");
var colurs = new colurs_1.Colurs();
/**
 * Logger
 * : Formats and logs message.
 *
 * @param type the type of message to log.
 * @param args rest param of log arguments.
 */
function logger(type) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var msg = args.shift();
    var fn = chek_1.isFunction(chek_1.last(args)) ? args.pop() : chek_1.noop;
    var meta = chek_1.isPlainObject(chek_1.last(args)) ? args.pop() : null;
    var obj = {
        type: type,
        msg: null,
        meta: meta
    };
    var formatters = chek_1.isString(msg) ? msg.match(/%/g) : null;
    if (formatters && formatters.length)
        msg = util_1.format.apply(void 0, [msg].concat(args));
    else
        msg = [msg].concat(args).join(' ');
    if (type === 'error' && !(msg instanceof Error)) {
        msg = new Error(msg);
        var stack = msg.stack.split('\n');
        var tmpMsg = stack.shift();
        stack.shift();
        stack.unshift(tmpMsg);
        msg.stack = stack.join('\n');
    }
    // If any error just throw it.
    if (msg instanceof Error) {
        if (fn)
            fn(msg, obj);
        msg.stack = msg.stack.split('\n').map(function (s, i) {
            if (i === 0)
                return colurs.applyAnsi('[error]', _log.colors.error) + ' ' + (msg.name || 'Error') + ': ' + msg.message;
            return s;
        }).join('\n');
        throw msg;
    }
    obj.msg = msg;
    fn(msg, obj);
    if (meta) {
        meta = util_1.inspect(meta, null, null, true);
        msg += ('\n' + meta);
    }
    if (type && _log.colors[type])
        msg = colurs.applyAnsi('[' + type + ']: ', _log.colors[type]) + msg;
    process.stderr.write(msg + '\n');
    return _log;
}
var _log = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    logger.apply(void 0, [null].concat(args));
    return _log;
};
_log.colors = {
    error: 'red',
    warn: ['yellow', 'dim'],
    notify: 'blue'
};
_log.colorize = true;
_log.error = logger.bind(_log, 'error');
_log.warn = logger.bind(_log, 'warn');
_log.info = logger.bind(_log, 'notify'); // backward compat.
_log.notify = logger.bind(_log, 'notify');
_log.exit = process.exit;
exports.log = _log;
//# sourceMappingURL=logger.js.map