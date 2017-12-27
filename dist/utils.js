"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var path_1 = require("path");
var del = require("del");
var chek_1 = require("chek");
var logger_1 = require("./logger");
var glob = require("glob");
var colurs_1 = require("colurs");
var fs_extra_1 = require("fs-extra");
var semver_1 = require("semver");
var util_1 = require("util");
var _pkg;
exports.cwd = process.cwd();
var colurs = new colurs_1.Colurs();
/**
 * Get Parsed
 *
 * @param filename the filename to path.parse.
 */
function getParsed(filename) {
    filename = path_1.resolve(exports.cwd, filename);
    return path_1.parse(filename);
}
/**
 * Get Relative
 *
 * @param filename the filename to get relative path for.
 */
function getRelative(filename) {
    var parsed = chek_1.isString(filename) ? getParsed(filename) : filename;
    return path_1.relative(exports.cwd, path_1.join(parsed.dir, parsed.base || ''));
}
/**
 * Clean
 * Removes file(s) using provided glob(s).
 *
 * @param globs glob or array of glob strings.
 */
function clean(globs) {
    globs = chek_1.toArray(globs);
    globs.forEach(function (g) {
        try {
            del.sync(g);
            // Some files may not exist del doesn't throw
            // error just continues.
            // log.info(`successfully cleaned or ignored ${getRelative(g)}.`);
        }
        catch (ex) {
            logger_1.log.info("failed to clean " + getRelative(g) + ".");
        }
    });
}
exports.clean = clean;
/**
 * Copy
 * Copies source to target. Does NOT support globs.
 *
 * @param src the source path to be copied.
 * @param dest the destination path to copy to.
 */
function copy(src, dest) {
    if (!src || !dest)
        return false;
    var parsedSrc, parsedDest;
    parsedSrc = getParsed(src);
    parsedDest = getParsed(dest);
    try {
        fs_extra_1.copySync(src, dest);
        return true;
    }
    catch (ex) {
        logger_1.log.warn("failed to copy " + colurs.yellow(getRelative(parsedSrc || 'undefined')) + " to " + colurs.red(getRelative(parsedDest || 'undefined')) + ".");
        return false;
    }
}
exports.copy = copy;
/**
 * Copy All
 * Takes collection and copies to destination.
 *
 * @param copies collection of source and destination targets.
 */
function copyAll(copies) {
    var success = 0;
    var failed = 0;
    var result;
    function update(_result) {
        if (!_result)
            failed++;
        else
            success++;
    }
    function logResults() {
        // only log if something copied or failed.
        if (success || failed) {
            if (failed > success) {
                if (!success)
                    logger_1.log.error(colurs.red(failed) + " copies " + colurs.red('failed') + " to processes with 0 succeeding.");
                else
                    logger_1.log.warn(colurs.red(failed) + " copies " + colurs.red('failed') + " to processes with " + (colurs.green(success) + 'succeeding') + ".");
            }
            else {
                logger_1.log.info(colurs.green(success) + " items " + colurs.green('successfully') + " copied with " + colurs.yellow(failed) + " copies " + colurs.yellow('failing') + ".");
            }
        }
    }
    if (chek_1.isPlainObject(copies)) {
        chek_1.keys(copies).forEach(function (k) {
            var itm = copies[k];
            // Check if src is glob.
            if (itm.src.indexOf('*') !== -1) {
                var arr = glob.sync(itm.src);
                arr.forEach(function (str) {
                    result = copy(str, itm.dest);
                    update(result);
                });
            }
            else {
                result = copy(itm.src, itm.dest);
                update(result);
            }
        });
        // logResults();
    }
    else if (chek_1.isArray(copies)) {
        // If not array of tuples convert.
        if (chek_1.isString(copies[0]))
            copies = [copies[0].split('|')];
        copies.forEach(function (c) {
            var tuple = c;
            if (tuple[0].indexOf('*') !== -1) {
                var arr = glob.sync(tuple[0]);
                arr.forEach(function (str) {
                    result = copy(str, tuple[1]);
                    update(result);
                });
            }
            else {
                result = copy(tuple[0], tuple[1]);
                update(result);
            }
        });
        // logResults();
    }
    else {
        logger_1.log.warn("cannot copy using unknown configuration type of " + typeof copies + ".");
    }
    return {
        success: success,
        failed: failed
    };
}
exports.copyAll = copyAll;
/**
 * Pkg
 * Loads the package.json file for project or saves package.json.
 *
 * @param val the package.json object to be written to file.
 */
function pkg(val) {
    var filename = path_1.resolve(exports.cwd, 'package.json');
    if (!val)
        return _pkg || (_pkg = fs_extra_1.readJSONSync(filename));
    fs_extra_1.writeJSONSync(filename, val, { spaces: 2 });
}
exports.pkg = pkg;
/**
 * Bump
 * : Bumps the package version.
 *
 * @param type the release type to increment the package by.
 */
function bump(type) {
    if (type === void 0) { type = 'patch'; }
    var _pkg = pkg();
    if (!_pkg || !_pkg.version)
        logger_1.log.error('Failed to load package.json, are you sure this is a valid project?');
    var origVer = _pkg.version;
    var newVer = semver_1.inc(origVer, type);
    if (newVer === null)
        logger_1.log.error('Whoops tried to bump version but got null.');
    _pkg.version = newVer;
    pkg(_pkg);
    return { name: _pkg.name, version: _pkg.version, previous: origVer, current: _pkg.version };
}
exports.bump = bump;
/**
 * Serve
 * Hook to Browser Sync accepts name and options returning a Browser Sync Server Instance.
 * @see https://www.browsersync.io/docs/api
 *
 * @param name the name of the server or Browser Sync options.
 * @param options the Browser Sync Options.
 */
function serve(name, options, init) {
    var _pkg = pkg();
    if (chek_1.isPlainObject(name)) {
        init = options;
        options = name;
        name = undefined;
    }
    if (util_1.isBoolean(options)) {
        init = options;
        options = undefined;
    }
    var defaults = {
        server: {
            baseDir: './dist'
        }
    };
    name = name || 'dev-server';
    options = chek_1.extend({}, defaults, options);
    var bsync = chek_1.tryRootRequire('browser-sync');
    if (!bsync)
        logger_1.log.error('failed to load root module browser-sync, ensure the module is installed');
    var server = bsync.create(name);
    if (init !== false)
        server.init(options, function (err) {
            if (err) {
                logger_1.log.error(err);
            }
            else {
                logger_1.log.info("browser Sync server " + name + " successfully initialized.");
            }
        });
    return server;
}
exports.serve = serve;
/**
 * Platform
 * Gets information and paths for the current platform.
 */
function platform() {
    var cpus = os.cpus();
    var cpu = cpus[0];
    cpu.cores = cpus.length;
    var tmpPlatform = os.platform();
    if (/^win/.test(tmpPlatform))
        tmpPlatform = 'windows';
    else if (tmpPlatform === 'darwin' || tmpPlatform === 'freebsd')
        tmpPlatform = 'mac';
    else if (tmpPlatform === 'linux')
        tmpPlatform = 'linux';
    return {
        platform: tmpPlatform,
        arch: os.arch(),
        release: os.release(),
        hostname: os.hostname(),
        homedir: os.homedir(),
        cpu: cpu
    };
}
exports.platform = platform;
//# sourceMappingURL=utils.js.map