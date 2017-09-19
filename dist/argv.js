"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chek_1 = require("chek");
// The original array.
var _args = process.argv.slice(0);
exports.args = _args;
// The original args with node and executed path stripped.
var _baseArgs = _args.slice(2);
exports.normalized = _baseArgs;
// The original args without node, executed path and first command stripped.
var _optionArgs = _baseArgs.slice(1);
exports.options = _optionArgs;
// Array of packages to install
var _cmds = [];
// Flags passed in cli.
var _flags = {};
// Expression for finding flags.
var _flagExp = /^--?/;
// Holds array of args to be excluded.
var _exclude = [];
/**
 * Is Flag
 * Checks if value is type of flag param.
 *
 * @param flag the value to inspect to detect if is flag.
 */
function isFlag(flag) {
    if (_flagExp.test(flag)) {
        if (/^--/.test(flag))
            return 'value';
        return 'boolean';
    }
    return false;
}
exports.isFlag = isFlag;
/**
 * Parse Element
 * Inspects value parses value as command or flag.
 *
 * @param val the value to inspect/convert to flag.
 * @param idx the current index position of the value.
 * @param args the array of argv params.
 */
function parseElement(val, idx, args) {
    var flagType = isFlag(val);
    if (!flagType)
        return false;
    if (flagType === 'boolean')
        return true;
    var nextIdx = idx + 1;
    if (args[nextIdx]) {
        _exclude.push(nextIdx);
        var val_1 = args[nextIdx];
        if (val_1 === 'true' || val_1 === 'false')
            return chek_1.toBoolean(val_1);
        return chek_1.castType(val_1, chek_1.getType(val_1));
    }
    // If not next arg is boolean flag.
    return true;
}
exports.parseElement = parseElement;
// Parse the arguments
function parse(args) {
    args = args || _baseArgs;
    args.forEach(function (el, idx) {
        var flag = parseElement(el, idx, args);
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
exports.parse = parse;
/**
 * Find
 * Iterates expected or valid values stopping if matching value is found in provided args.
 *
 * @param valid array of expected valid values.
 * @param args array of params to inspect.
 */
function find(valid, args) {
    // If no command line args passed try to parse them.
    args = args || parse().cmds;
    var i = valid.length;
    var found;
    while (i-- && !found) {
        if (chek_1.contains(args, valid[i]))
            found = valid[i];
    }
    return found;
}
exports.find = find;
//# sourceMappingURL=argv.js.map