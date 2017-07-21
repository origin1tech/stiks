"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var tsnode = require("ts-node");
var del = require("del");
var path_1 = require("path");
var chek_1 = require("chek");
var log = require("./logger");
var cwd = process.cwd();
var _pkg;
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
 * Loads the package.json file for project or saves package.json.
 *
 * @param val the package.json object to be written to file.
 */
function pkg(val) {
    var filename = path_1.resolve(cwd, 'package.json');
    if (!val)
        return _pkg || (_pkg = fs_extra_1.readJSONSync(filename));
    fs_extra_1.writeJSONSync(filename, val, { spaces: 2 });
}
exports.pkg = pkg;
/**
 * Bump
 * Bumps project to next version.
 *
 * @param filename optional filename defaults to package.json in cwd.
 */
function bump() {
    var semverKeys = ['major', 'minor', 'patch'];
    var _pkg = pkg();
    var origVer = _pkg.version;
    var splitVer = _pkg.version.split('-');
    var ver = (splitVer[0] || '').replace(/^(=|v|^|~)/, '');
    var pre = splitVer[1] || '';
    var verArr = chek_1.castType(chek_1.split(ver), ['integer'], []);
    var preArr = [];
    if (pre && pre.length)
        preArr = chek_1.castType(chek_1.split(pre), ['string', 'integer'], []);
    var arr = verArr;
    var isPre = false;
    if (preArr.length) {
        arr = [].slice.call(preArr, 1); // remove first arg.
        isPre = true;
    }
    var i = arr.length;
    var bump;
    while (i-- && !bump) {
        var next = arr[i] + 1;
        arr[i] = next;
        bump = {
            type: !isPre ? semverKeys[i] : 'pre',
            next: next
        };
        if (isPre) {
            bump.preArr = [preArr[0]].concat(arr);
            bump.pre = bump.preArr.join('.');
            bump.ver = ver;
            bump.verArr = verArr;
        }
        else {
            bump.ver = arr.join('.');
            bump.verArr = arr;
            bump.preArr = preArr;
            bump.pre = pre;
        }
        bump.full = bump.pre && bump.pre.length ? bump.ver + '-' + bump.pre : bump.ver;
    }
    _pkg.version = bump.full;
    pkg(_pkg);
    log.info("bumped " + _pkg.name + " from " + origVer + " to " + bump.full + ".");
}
exports.bump = bump;
/**
 * TS Node Register
 * Calls ts-node's register method for use with testing frameworks..
 * @see https://github.com/TypeStrong/ts-node#configuration-options
 *
 * @param project the tsconfig.json path or ts-node options.
 * @param opts ts-node options.
 */
function tsnodeRegister(project, opts) {
    if (chek_1.isPlainObject(project)) {
        opts = project;
        project = undefined;
    }
    var defaults = {
        project: './src/tsconfig.spec.json',
        fast: true
    };
    opts = chek_1.extend({}, defaults, opts);
    tsnode.register(opts);
}
exports.tsnodeRegister = tsnodeRegister;
//# sourceMappingURL=utils.js.map