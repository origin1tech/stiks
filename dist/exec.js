"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var chek_1 = require("chek");
var log = require("./logger");
// COMMANDS REFERENCE //
//   access, adduser, bin, bugs, c, cache, completion, config,
//   ddp, dedupe, deprecate, dist-tag, docs, edit, explore, get,
//   help, help-search, i, init, install, install-test, it, link,
//   list, ln, login, logout, ls, outdated, owner, pack, ping,
//   prefix, prune, publish, rb, rebuild, repo, restart, root,
//   run, run-script, s, se, search, set, shrinkwrap, star,
//   stars, start, stop, t, tag, team, test, tst, un, uninstall,
//   unpublish, unstar, up, update, v, version, view, whoami
// FLAGS REFERENCE //
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
// Keys to exclude when building flags.
var excludeFilters = ['cwd', 'input', 'stdio', 'env', 'uid', 'gid', 'timeout', 'killSignal', 'maxBuffer', 'encoding', 'shell'];
// Default spawn options.
var spawnDefaults = {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
};
/**
 * Exec
 * Executes command using child process.
 *
 * @param cmd node, npm or shell command to be executed.
 * @param args arguments to be passed to command.
 * @param options the child process spawn options.
 */
function exec(cmd, args, options) {
    // If true user wants stdout to output
    // instead of using inherit outputting
    // to process.stdout.
    if (options === true)
        options = { stdio: 'pipe' };
    options = chek_1.extend({}, spawnDefaults, options);
    if (chek_1.isString(args))
        args = args.split(' ');
    // Ensure command and arguments.
    if (!cmd)
        log.error('cannot execute process with command or arguments of undefined.').exit();
    // Spawn child.
    var child = child_process_1.spawnSync(cmd, args, options);
    // Get the output.
    var output = child.output || [];
    output = output.slice(1, 2) || '';
    output = String(output).replace(/\n/, '');
    return output;
}
exports.methods = {
    command: exec,
    node: exec.bind(null, 'node'),
    npm: exec.bind(null, 'npm')
};
//# sourceMappingURL=exec.js.map