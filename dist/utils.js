"use strict";
/**
 * File operations
 * Read, Remove, Copy etc.
 *
 * All paths will be resolved from current working directory.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var del = require("del");
var path_1 = require("path");
var chek_1 = require("chek");
var log = require("./logger");
var cwd = process.cwd();
var Semver = (function () {
    function Semver(filename) {
        this.pre = ''; // pre-release version if applicable.
        this.verArr = []; // the version as an array.
        this.preArr = []; // the pre-release as an array.
        this.filename = filename;
        var _pkg = pkg(filename);
        var parsed = this.parse(_pkg.version);
        this.full = parsed.full;
        this.ver = parsed.ver;
        this.verArr = parsed.verArr;
        this.pre = parsed.pre;
        this.preArr = parsed.preArr;
    }
    /**
     * Parse
     * Parses a version string.
     *
     * @param ver the version string to parse.
     */
    Semver.prototype.parse = function (ver) {
        ver = ver.replace(/^(=|v|^|~)/, '');
        var full = ver;
        var verSplit = chek_1.split(full, '-');
        ver = verSplit[0];
        var verArr = chek_1.castType(chek_1.split(ver), ['integer'], []);
        if (verArr.length < 3)
            log.error('the parsed version is invalid, missing major, minor or patch in semver.)');
        var pre = verSplit[1] || '';
        var preSplit, preArr;
        if (chek_1.isValue(pre)) {
            preSplit = chek_1.split(pre);
            preArr = chek_1.castType(preSplit, ['string', 'integer'], []);
            if (preArr.length < 2)
                log.error('the prerelease is invalid, examples "alpha.1", "rc.1.0" )');
        }
        return {
            full: full,
            ver: ver,
            pre: pre,
            verArr: verArr,
            preArr: preArr
        };
    };
    Semver.prototype.update = function () {
        this.full = this.pre && this.pre.length ? this.ver + '-' + this.pre : this.ver;
    };
    /**
     * Get Index
     * Gets the current value in semver by index and the next value.
     *
     * @param idx the index in version array.
     * @param next optional next value.
     */
    Semver.prototype.getIndex = function (idx, next) {
        if (!chek_1.isValue(this.verArr[idx]))
            log.error("cannot get version at index " + idx + " of undefined.");
        return { current: this.verArr[idx], next: next || this.verArr[idx] + 1 };
    };
    /**
     * Set Index
     * Sets the value in semver by index.
     *
     * @param idx the index in semver to set.
     * @param next the next value to be set.
     */
    Semver.prototype.setIndex = function (idx, next) {
        if (!chek_1.isValue(this.verArr[idx]))
            log.error("could not set version at index " + idx + " of undefined.");
        this.verArr[idx] = next;
        this.ver = this.verArr.join('.');
    };
    Semver.prototype.setPre = function (idx, next) {
        var arr = this.preArr.slice(1);
        if (arr) {
        }
    };
    /**
     * Before Bump
     * Calculates and returns bumped values.
     *
     * @private
     */
    Semver.prototype.beforeBump = function () {
        var _keys = ['major', 'minor', 'patch'];
        var arr = [].slice.call(this.verArr, 0);
        var isPre = false;
        if (this.preArr.length) {
            arr = [].slice.call(this.preArr, 1);
            isPre = true;
        }
        var i = arr.length;
        var bump;
        while (i-- && !bump) {
            var next = arr[i] + 1;
            arr[i] = next;
            // If previous version level set to 0.
            if (chek_1.isValue(arr[i - 1]))
                arr[i - 1] = 0;
            bump = {
                type: !isPre ? _keys[i] : 'pre',
                next: next
            };
            if (isPre) {
                bump.preArr = [this.preArr[0]].concat(arr);
                bump.pre = bump.preArr.join('.');
                bump.ver = this.ver;
                bump.verArr = this.verArr;
            }
            else {
                bump.ver = arr.join('.');
                bump.verArr = arr;
                bump.preArr = this.preArr;
                bump.pre = this.pre;
            }
            bump.full = bump.pre && bump.pre.length ? bump.ver + '-' + bump.pre : bump.ver;
        }
        return bump;
    };
    Semver.prototype.major = function (val) {
        var cur = this.getIndex(0, val);
        this.setIndex(0, cur.next);
        return this;
    };
    Semver.prototype.minor = function (val) {
        var cur = this.getIndex(1, val);
        this.setIndex(1, cur.next);
        return this;
    };
    Semver.prototype.patch = function (val) {
        var cur = this.getIndex(2, val);
        this.setIndex(2, cur.next);
        return this;
    };
    Semver.prototype.prerelease = function (prefix, val) {
        var cur = this.getIndex(2, val);
        this.setIndex(2, cur.next);
        return this;
    };
    /**
     * Bump
     * Gets ONLY or gets and sets version bump.
     *
     * @param suppress optional bool to suppress setting values.
     */
    Semver.prototype.bump = function (suppress) {
        var bumped = this.beforeBump();
        if (suppress)
            return bumped;
        this.full = bumped.full;
        this.ver = bumped.ver;
        this.verArr = bumped.verArr;
        this.pre = bumped.pre;
        this.preArr = bumped.preArr;
        return this;
    };
    Semver.prototype.compare = function (val1, val2, operator) {
        //
    };
    Semver.prototype.save = function () {
        //
    };
    return Semver;
}());
exports.Semver = Semver;
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
function pkg(filename) {
    filename = filename || path_1.resolve(cwd, 'package.json');
    return fs_extra_1.readJSONSync(filename);
}
exports.pkg = pkg;
function semver(filename, max) {
    return new Semver(filename);
}
exports.semver = semver;
//# sourceMappingURL=utils.js.map