"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var log = require("./logger");
var chek_1 = require("chek");
// Install Flags Reference
// -v: --version
// -h, -?, --help, -H: --usage
// -s, --silent: --loglevel silent
// -q, --quiet: --loglevel warn
// -d: --loglevel info
// -dd, --verbose: --loglevel verbose
// -ddd: --loglevel silly
// -g: --global
// -C: --prefix
// -l: --long
// -m: --message
// -p, --porcelain: --parseable
// -reg: --registry
// -f: --force
// -desc: --description
// -S: --save
// -P: --save-prod
// -D: --save-dev
// -O: --save-optional
// -B: --save-bundle
// -E: --save-exact
// -y: --yes
// -n: --yes false
var excludeFilters = ['stdio', 'cwd', 'shell'];
var spawnDefaults = {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
};
// Parses flags to command string.
function parseFlags(options, filter) {
    var arr = [];
    var _keys = chek_1.keys(options);
    filter = filter || _keys;
    _keys.forEach(function (k) {
        if (!chek_1.contains(excludeFilters, k) && chek_1.contains(filter, k)) {
            var flag = options[k];
            if (!chek_1.isUndefined(options)) {
                arr.push('--' + k);
                if (!chek_1.isBoolean(flag))
                    arr.push(flag);
            }
        }
    });
    return arr;
}
// Normalize the command string.
function normalize(cmd, packages, flags) {
    if (!cmd)
        log.error('cannot normalize command of undefined.').exit();
    var pkgs = [];
    if (chek_1.isValue(packages))
        pkgs = chek_1.isString(packages) ? packages.split(' ') : packages;
    pkgs.unshift(cmd);
    pkgs = pkgs.concat(flags || []);
    return pkgs;
}
/**
 * Install
 * Spawns process and installs packages.
 *
 * @param packages the packages to be installed.
 * @param options options to use when installing.
 */
function install(packages, options) {
    // Extend options.
    var opts = chek_1.extend({}, spawnDefaults, options);
    // Parse flags from options.
    var flags = parseFlags(opts);
    // Call spawn.
    child_process_1.spawnSync('npm', normalize('install', packages, flags), opts);
}
exports.install = install;
/**
 * Uninstall
 * Spawns process and uninstalls packages.
 *
 * @param packages the packages to be uninstalled.
 * @param options options to use when uninstalling.
 */
function uninstall(packages, options) {
    // Extend options.
    var opts = chek_1.extend({}, spawnDefaults, options);
    // Parse flags from options.
    var flags = parseFlags(opts);
    // Call spawn.
    child_process_1.spawnSync('npm', normalize('uninstall', packages, flags), opts);
}
exports.uninstall = uninstall;
/**
 * List
 * Displays list/tree of project packages.
 *
 * @param pkg optional package to be listed.
 * @param options list options.
 */
function list(pkg, options) {
    if (!chek_1.isString(pkg)) {
        options = pkg;
        pkg = undefined;
    }
    options = options || {};
    options.depth = options.depth || 0;
    // Extend options.
    var opts = chek_1.extend({}, spawnDefaults, options);
    // Parse flags from options.
    var flags = parseFlags(opts);
    // Call spawn.
    child_process_1.spawnSync('npm', normalize('ls', pkg, flags), opts);
}
exports.list = list;
/**
 * Run
 * Calls npm run-script from your package.json.
 *
 * @param script the script to be run.
 * @param options optional flags to run with script.
 */
function run(script, options) {
    // Extend options.
    var opts = chek_1.extend({}, spawnDefaults, options);
    // Parse flags from options.
    var flags = parseFlags(options);
    // Call spawn.
    child_process_1.spawnSync('npm', normalize('run', script, flags), opts);
}
exports.run = run;
function command(cmd, args, options, defaults) {
    var opts = options;
    // Extend with defaults unless disabled.
    if (defaults !== false)
        opts = chek_1.extend({}, spawnDefaults, options);
    var flags = parseFlags(opts);
    child_process_1.spawnSync('npm', normalize(cmd, args, flags), opts);
}
exports.command = command;
//# sourceMappingURL=npm.js.map