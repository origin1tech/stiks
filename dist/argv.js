"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chek_1 = require("chek");
var _args = process.argv.slice(2);
var origArgs = [].slice.call(_args, 0);
exports.args = origArgs;
// Array of packages to install
var _cmds = [];
// Flags passed in cli.
var _flags = {};
// Expression for finding flags.
var _flagExp = /^--?/;
// Holds array of args to be excluded.
var _exclude = [];
// Checks if argument is a flag.
function isFlag(flag) {
    if (_flagExp.test(flag)) {
        if (/^--/.test(flag))
            return 'value';
        return 'boolean';
    }
    return false;
}
exports.isFlag = isFlag;
// Gets the flag.
function getFlag(flag, idx, args) {
    var flagType = isFlag(flag);
    if (!flagType)
        return false;
    if (flagType === 'boolean')
        return true;
    var nextIdx = idx + 1;
    if (args[nextIdx]) {
        _exclude.push(nextIdx);
        var val = args[nextIdx];
        if (val === 'true' || val === 'false')
            return chek_1.toBoolean(val);
        return chek_1.castType(val, chek_1.getType(val));
    }
    // fallback to just boolean
    // if next arg not avail.
    return true;
}
exports.getFlag = getFlag;
// Parse the arguments
function parse(args) {
    args = args || _args;
    args.forEach(function (el, idx) {
        var flag = getFlag(el, idx, args);
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
//# sourceMappingURL=argv.js.map