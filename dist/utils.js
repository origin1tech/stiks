"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var path_1 = require("path");
var del = require("del");
var chek_1 = require("chek");
var logger = require("./logger");
var glob = require("glob");
var clrs = require("colurs");
var fs_extra_1 = require("fs-extra");
var _pkg;
exports.cwd = process.cwd();
var colurs = clrs.get();
var log = logger.get();
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
 * Seed
 * Internal method for seeding examples/templates.
 *
 * @param type the type of seed to run.
 * @param dest the optional destination relative to root.
 */
function seed(type, dest) {
    var source = path_1.resolve(__dirname, path_1.join('blueprints', type));
    dest = dest ? path_1.resolve(exports.cwd, dest) : path_1.resolve(exports.cwd, type);
    switch (type) {
        case 'build':
            copyAll([source, dest]);
            break;
        default:
            log.warn("seed type " + type + " was not found.");
            break;
    }
}
exports.seed = seed;
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
        log.warn("failed to copy " + colurs.yellow(getRelative(parsedSrc || 'undefined')) + " to " + colurs.red(getRelative(parsedDest || 'undefined')) + ".");
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
    // log.info(`bumped ${_pkg.name} from ${colurs.magenta(origVer)} to ${colurs.green(bump.full)}.`);
    return { name: _pkg.name, version: _pkg.version, original: origVer };
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
    var defaults = {
        server: {
            baseDir: './dist'
        }
    };
    name = name || _pkg.name || 'dev-server';
    options = chek_1.extend({}, defaults, options);
    var bsync = chek_1.tryRootRequire('browser-sync');
    if (!bsync)
        log.error('failed to load root module browser-sync, ensure the module is installed');
    var server = bsync.create(name);
    if (init !== false)
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
// export function layout(width?: number, wrap?: boolean) {
//   // Base width of all divs.
//   width = width || 95;
//   const ui = cliui({ width: width, wrap: wrap });
//   function invalidExit(element, elements) {
//     if (isString(element) && elements.length && isPlainObject(elements[0]))
//       log.error('invalid element(s) cannot mix string element with element options objects.').exit();
//   }
//   function add(type: string, ...elements: any[]) {
//     ui[type](...elements);
//   }
//   /**
//    * Div
//    * Adds Div to the UI.
//    *
//    * @param elements array of string or IUIOptions
//    */
//   function div<T>(...elements: T[]) {
//     add('div', ...elements);
//   }
//   /**
//    * Span
//    * Adds Span to the UI.
//    *
//    * @param elements array of string or IUIOptions
//    */
//   function span<T>(...elements: T[]) {
//     add('span', ...elements);
//   }
//   /**
//    * Join
//    * Simply joins element args separated by space.
//    *
//    * @param elements the elements to be created.
//    */
//   function join(...elements: any[]) {
//     add('div', elements.join(' '));
//   }
//   /**
//    * Get
//    * Gets the defined UI as string.
//    */
//   function getString() {
//     return ui.toString() || '';
//   }
//   /**
//    * Render
//    * Renders out the defined UI.
//    * When passing elements in render they default to "div" layout.
//    *
//    * @param elements optional elements to be defined at render.
//    */
//   function render<T>(...elements: T[]) {
//     if (elements.length)
//       add('div', ...elements);
//     console.log(getString());
//   }
//   // Alias for render.
//   const show = render;
//   return {
//     div,
//     join,
//     span,
//     render,
//     show,
//     ui
//   };
// }
/**
 * String Builder
 * Builds string then joins by char with optional colorization.
 *
 * @param str the base value to build from if any.
 */
// export function stringBuilder(str?: any): IStringBuilderMethods {
//   const arr = [];
//   str = str || '';
//   let methods: IStringBuilderMethods;
//   let result;
//   /**
//    * Add
//    * Adds a value to the collection for rendering.
//    *
//    * @param str the string to be added.
//    * @param styles any colurs styles to be applied.
//    */
//   function add(str: any, styles: string | string[]) {
//     if (isString(styles))
//       styles = (styles as string).split('.');
//     styles = toArray(styles, null, []);
//     if (styles.length)
//       str = colurs.applyAnsi(str, styles);
//     arr.push(str);
//     return methods;
//   }
//   /**
//    * Join
//    *
//    * @param char the char used for joining array.
//    */
//   function join(char?: string) {
//     char = char || ' ';
//     result = arr.join(char);
//     return methods;
//   }
//   /**
//    * Format
//    *
//    * @param args arguments used to format string.
//    */
//   function format(...args: any[]) {
//     if (!result)
//       join();
//     result = stringFormat(result, args);
//     return methods;
//   }
//   /**
//    * Render
//    * Joins and renders the built string.
//    *
//    * @param char optional character to join by.
//    */
//   function render(char?: string) {
//     if (result)
//       return result;
//     join();
//     return result;
//   }
//   methods = {
//     add,
//     join,
//     format,
//     render
//   };
//   return methods;
// }
/**
 * String Format
 * Very simple string formatter by index.
 * Supports using %s or %n chars.
 *
 * @private
 * @param str the string to be formatted.
 * @param args arguments used for formatting.
 */
// export function stringFormat(str, ...args: any[]) {
//   let ctr = 0;
//   return str.replace(/%(s|n)/g, (cur) => {
//     const val = args[ctr];
//     ctr++;
//     return val || cur;
//   });
// }
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