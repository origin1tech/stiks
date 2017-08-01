"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var tsnode = require("ts-node");
var del = require("del");
var path_1 = require("path");
var chek_1 = require("chek");
var log = require("./logger");
var glob = require("glob");
var bsync = require("browser-sync");
var cliui = require("cliui");
var clrs = require("colurs");
var _pkg;
exports.cwd = process.cwd();
var colurs = clrs.get();
function getParsed(filename) {
    filename = path_1.resolve(exports.cwd, filename);
    return path_1.parse(filename);
}
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
            log.info("successfully cleaned " + getRelative(g) + ".");
        }
        catch (ex) {
            log.info("failed to clean " + getRelative(g) + ".");
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
    var parsedSrc = getParsed(src);
    var parsedDest = getParsed(dest);
    try {
        fs_extra_1.copySync(src, dest);
        log.info("successfully copied " + colurs.magenta(getRelative(parsedSrc)) + " to " + colurs.green(getRelative(parsedDest)) + ".");
        return true;
    }
    catch (ex) {
        log.info("failed to copy " + colurs.yellow(getRelative(parsedSrc)) + " to " + colurs.red(getRelative(parsedDest)) + ".");
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
                    log.error(colurs.red(failed) + " copies " + colurs.red('failed') + " to processes with 0 succeeding.");
                else
                    log.warn(colurs.red(failed) + " copies " + colurs.red('failed') + " to processes with " + (colurs.green(success) + 'succeeding') + ".");
            }
            else {
                log.info(colurs.green(success) + " items " + colurs.green('successfully') + " copied with " + colurs.yellow(failed) + " copies " + colurs.yellow('failing') + ".");
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
        logResults();
    }
    else if (chek_1.isArray(copies)) {
        // If not array of tuples convert.
        if (chek_1.isString(copies[0]))
            copies = chek_1.toArray(copies);
        copies.forEach(function (c) {
            var tuple = chek_1.isString(c) ? chek_1.split(c, '|') : c;
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
        logResults();
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
    var filename = path_1.resolve(exports.cwd, 'package.json');
    try {
        if (!val)
            return _pkg || (_pkg = fs_extra_1.readJSONSync(filename));
        fs_extra_1.writeJSONSync(filename, val, { spaces: 2 });
    }
    catch (ex) {
        log.error(ex);
    }
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
    if (!_pkg || !_pkg.version)
        log.error('failed to load package.json, are you sure this is a valid project?').exit();
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
    log.write("bumped " + _pkg.name + " from " + origVer + " to " + bump.full + ".");
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
/**
 * Serve
 * Hook to Browser Sync accepts name and options returning a Browser Sync Server Instance.
 * @see https://www.browsersync.io/docs/api
 *
 * @param name the name of the server or Browser Sync options.
 * @param options the Browser Sync Options.
 */
function serve(name, options) {
    var _pkg = pkg();
    if (chek_1.isPlainObject(name)) {
        options = name;
        name = undefined;
    }
    var defaults = {
        server: {
            baseDir: './dist'
        }
    };
    name = name || _pkg.name || 'dev-server';
    options = chek_1.extend({}, defaults, options);
    var server = bsync.create(name);
    server.init(options, function (err) {
        if (err) {
            log.error(err);
        }
        else {
            log.info("browser Sync server " + name + " successfully initialized.");
        }
    });
    return server;
}
exports.serve = serve;
/**
 * Layout
 * Creates a CLI layout much like creating divs in the terminal.
 * Supports strings with \t \s \n or IUIOptions object.
 * @see https://www.npmjs.com/package/cliui
 *
 * @param width the width of the layout.
 * @param wrap if the layout should wrap.
 */
function layout(width, wrap) {
    // Base width of all divs.
    width = width || 95;
    var ui = cliui({ width: width, wrap: wrap });
    function invalidExit(element, elements) {
        if (chek_1.isString(element) && elements.length && chek_1.isPlainObject(elements[0]))
            log.error('invalid element(s) cannot mix string element with element options objects.').exit();
    }
    function add(type) {
        var elements = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            elements[_i - 1] = arguments[_i];
        }
        ui[type].apply(ui, elements);
    }
    /**
     * Div
     * Adds Div to the UI.
     *
     * @param elements array of string or IUIOptions
     */
    function div() {
        var elements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elements[_i] = arguments[_i];
        }
        add.apply(void 0, ['div'].concat(elements));
    }
    /**
     * Span
     * Adds Span to the UI.
     *
     * @param elements array of string or IUIOptions
     */
    function span() {
        var elements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elements[_i] = arguments[_i];
        }
        add.apply(void 0, ['span'].concat(elements));
    }
    /**
     * Get
     * Gets the defined UI as string.
     */
    function getString() {
        return ui.toString() || '';
    }
    /**
     * Render
     * Renders out the defined UI.
     * When passing elements in render they default to "div" layout.
     *
     * @param elements optional elements to be defined at render.
     */
    function render() {
        var elements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elements[_i] = arguments[_i];
        }
        if (elements.length)
            add.apply(void 0, ['div'].concat(elements));
        console.log(getString());
    }
    return {
        ui: ui,
        div: div,
        span: span,
        render: render
    };
}
exports.layout = layout;
/**
 * String Builder
 * Builds string then joins by char with optional colorization.
 *
 * @param str the base value to build from if any.
 */
function stringBuilder(str) {
    var arr = [];
    str = str || '';
    var methods;
    var result;
    /**
     * Add
     * Adds a value to the collection for rendering.
     *
     * @param str the string to be added.
     * @param styles any colurs styles to be applied.
     */
    function add(str, styles) {
        if (chek_1.isString(styles))
            styles = styles.split('.');
        styles = chek_1.toArray(styles, null, []);
        if (styles.length)
            str = colurs.applyAnsi(str, styles);
        arr.push(str);
        return methods;
    }
    /**
     * Join
     *
     * @param char the char used for joining array.
     */
    function join(char) {
        char = char || ' ';
        result = arr.join(char);
        return methods;
    }
    /**
     * Format
     *
     * @param args arguments used to format string.
     */
    function format() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!result)
            join();
        result = stringFormat(result, args);
        return methods;
    }
    /**
     * Render
     * Joins and renders the built string.
     *
     * @param char optional character to join by.
     */
    function render(char) {
        if (result)
            return result;
        join();
        return result;
    }
    methods = {
        add: add,
        join: join,
        format: format,
        render: render
    };
    return methods;
}
exports.stringBuilder = stringBuilder;
/**
 * String Format
 * Very simple string formatter by index.
 * Supports using %s or %n chars.
 *
 * @private
 * @param str the string to be formatted.
 * @param args arguments used for formatting.
 */
function stringFormat(str) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var ctr = 0;
    return str.replace(/%(s|n)/g, function (cur) {
        var val = args[ctr];
        ctr++;
        return val || cur;
    });
}
exports.stringFormat = stringFormat;
//# sourceMappingURL=utils.js.map