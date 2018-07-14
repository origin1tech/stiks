"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chek_1 = require("chek");
var logger_1 = require("./logger");
// The original args with node and executed path stripped.
var _args = process.argv.slice(2);
var _command = null;
// Array of packages to install
var _commands = [];
// Flags passed in cli.
var _flags = {};
// Expression for finding flags.
var _flagExp = /^--?/;
// Checks if flag is inverse.
var _noFlagExp = /^--no-/;
/**
 * Cast To Type
 * : Loosely tries to cast numbers and booleans.
 *
 * @param val the value to be cast.
 */
function castToType(val) {
    if (/^(true|false)$/.test(val))
        return chek_1.toBoolean(val);
    if (/^[\d\.]+$/.test(val))
        return chek_1.toNumber(val);
    return val;
}
exports.castToType = castToType;
/**
 * Flags To Array
 * : Convert flag object to array.
 *
 * @param flags object containing flags.
 */
function flagsToArray(flags) {
    var arr = [];
    for (var k in flags) {
        var flag = flags[k];
        var prefix = flags[k] === false ? '--no-' : k.length > 1 ? '--' : '-';
        arr.push(prefix + k);
        if (!chek_1.isBoolean(flags[k]))
            arr.push(flags[k]);
    }
    return arr;
}
exports.flagsToArray = flagsToArray;
/**
 * Split Args
 * : Splits string of command arguments honoring quotes.
 *
 * @param str the string representing arguments.
 */
function splitArgs(str) {
    if (chek_1.isArray(str))
        return str;
    if (!chek_1.isString(str))
        return [];
    var arr = [];
    str
        .split(/(\x22[^\x22]*\x22)/)
        .filter(function (x) { return x; })
        .forEach(function (s) {
        if (s.match('\x22'))
            arr.push(s.replace(/\x22/g, ''));
        else
            arr = arr.concat(s.trim().split(' '));
    });
    return arr;
}
exports.splitArgs = splitArgs;
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
function normalizeArgs(args, exclude) {
    var result = [];
    args = splitArgs(args || []);
    exclude = splitArgs(exclude || []);
    args.slice(0).forEach(function (arg) {
        var val;
        if (arg && arg.indexOf && ~arg.indexOf('=')) {
            var kv = arg.split('=');
            arg = kv[0];
            val = kv[1];
        }
        if (/^-{1}[a-z]+/i.test(arg)) {
            var spread = arg.slice(1).split('').map(function (a) { return '-' + a; });
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
exports.normalizeArgs = normalizeArgs;
/**
 * Filter Args
 * : Filters an array of arguments by exclusion list.
 *
 * @param args the arguments to be filtered.
 * @param exclude the arguments to be excluded.
 */
function filterArgs(args, exclude) {
    args = splitArgs(args || []);
    exclude = splitArgs(exclude || []);
    var clone = args.slice(0);
    return clone.filter(function (arg, i) {
        if (!~exclude.indexOf(arg))
            return true;
        var next = clone[i + 1];
        if (_flagExp.test(arg) && next && !_flagExp.test(next))
            clone.splice(i + 1, 1);
        return false;
    });
}
exports.filterArgs = filterArgs;
/**
 * Merge Args
 * : Merges two sets of command arguments.
 *
 * @param def array of default args.
 * @param args array of new args.
 */
function mergeArgs(def, args, exclude) {
    exclude = splitArgs(exclude || []);
    def = normalizeArgs(def);
    args = normalizeArgs(args);
    var clone = def.slice(0);
    args.forEach(function (arg, i) {
        var next = args[i + 1];
        var isFlag = _flagExp.test(arg);
        var isFlagNext = _flagExp.test(next || '');
        var defIdx = def.indexOf(arg);
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
exports.mergeArgs = mergeArgs;
/**
 * Parse
 * : Parses command arguments.
 *
 * @param args the arguments to be parsed if null uses process.argv.slice(2)
 * @param exclude any flags or commands that should be excluded.
 */
function parse(args, exclude) {
    var normalized = normalizeArgs(args || _args, exclude);
    var clone = normalized.slice(0);
    clone.forEach(function (arg, i) {
        var next = clone[i + 1];
        var isFlag = _flagExp.test(arg);
        var isFlagNext = _flagExp.test(next || '');
        var isNoFlag = _noFlagExp.test(arg);
        if (isFlag) {
            var key = isNoFlag ? arg.replace(_noFlagExp, '') : arg.replace(_flagExp, '');
            key = key.split('.').map(function (k) { return chek_1.camelcase(k); }).join('.'); // handle dot keys.
            var curVal = chek_1.get(_flags, key);
            var exists = chek_1.isValue(curVal);
            if (exists)
                curVal = chek_1.toArray(curVal, []);
            if (!isFlagNext && next) {
                if (isNoFlag)
                    logger_1.log.error("Oops cannot set flag value using inverse (--no-xxx) flag " + arg + ".");
                var val = castToType(next);
                if (exists) {
                    curVal.push(val);
                    val = curVal;
                }
                chek_1.set(_flags, key, val);
                clone.splice(i + 1, 1);
            }
            else {
                chek_1.set(_flags, key, isNoFlag ? false : true);
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
        cmd: _command,
        cmds: _commands,
        flags: _flags,
        source: _args,
        normalized: normalized
    };
}
exports.parse = parse;
//# sourceMappingURL=argv.js.map