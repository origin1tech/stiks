"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("./logger");
exports.log = log;
var colurs = require("colurs");
exports.colurs = colurs;
var chek = require("chek");
exports.chek = chek;
var fs = require("fs-extra");
exports.fs = fs;
var argv = require("./argv");
exports.argv = argv;
var exec_1 = require("./exec");
exports.exec = exec_1.methods;
__export(require("./utils"));
//# sourceMappingURL=index.js.map