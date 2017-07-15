/**
 * File operations
 * Read, Remove, Copy etc.
 *
 * All paths will be resolved from current working directory.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var del = require("del");
var path_1 = require("path");
var chek_1 = require("chek");
var log = require("./logger");
var cwd = process.cwd();
/**
 * Clean
 * Removes file(s) using provided glob(s).
 *
 * @param globs glob or array of glob strings.
 */
function clean(globs) {
    globs = chek_1.toArray(globs);
    del.sync(globs);
}
exports.clean = clean;
/**
 * Copy
 * Copies source to target.
 *
 * @param src the source path to be copied.
 * @param dest the destination path to copy to.
 */
function copy(src, dest) {
    var globs = chek_1.toArray(src);
    src = path_1.resolve(process.cwd(), src);
    dest = path_1.resolve(process.cwd(), dest);
    var parsedSrc = path_1.parse(src);
    var parsedDest = path_1.parse(dest);
    fs_extra_1.copySync(src, dest);
    log.info("successfully copied " + path_1.relative(cwd, path_1.join(parsedSrc.dir, parsedSrc.base)) + " to " + path_1.relative(cwd, path_1.join(parsedDest.dir, parsedDest.base)) + ".");
}
exports.copy = copy;
/**
 * CopyAll
 * Takes collection and copies each source/destination pair.
 *
 * @param copies collection of source and destination targets.
 */
function copyAll(copies) {
    if (chek_1.isPlainObject(copies)) {
        chek_1.keys(copies).forEach(function (k) {
            var itm = copies[k];
            copy(itm.src, itm.dest);
        });
    }
    else if (chek_1.isArray(copies)) {
        copies.forEach(function (c) {
            var tuple = chek_1.isString(c) ? chek_1.split(c) : c;
            copy(tuple[0], tuple[1]);
        });
    }
    else {
        log.warn("cannot copy using unknown configuration type of " + typeof copies + ".");
    }
}
exports.copyAll = copyAll;
/**
 * Pkg
 * Loads the package.json file for project.
 */
function pkg() {
    return fs_extra_1.readJSONSync(path_1.resolve(cwd, 'package.json'));
}
exports.pkg = pkg;
function semver(max) {
    var Server = (function () {
        function Server() {
        }
        Server.prototype.load = function () {
            var _pkg = pkg();
            var ver = _pkg.version;
            var verSplit = chek_1.split(ver, '-');
            var verArr = chek_1.castType(chek_1.split(verSplit[0]), ['integer']);
            var pre = verSplit[1] || '';
            var preSplit, preType;
            if (chek_1.isValue(pre)) {
                preSplit = chek_1.split(pre);
                preType = preSplit[0];
            }
        };
        Server.prototype.toArray = function () {
        };
        return Server;
    }());
    return methods;
}
exports.semver = semver;
//# sourceMappingURL=utils.js.map