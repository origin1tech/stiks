"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var chek_1 = require("chek");
var argv_1 = require("./argv");
var logger_1 = require("./logger");
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
    // If true user wants stdout to output value
    // instead of using inherit outputting
    // to process.stdout stream.
    if (options === true)
        options = { stdio: 'pipe' };
    options = chek_1.extend({}, spawnDefaults, options);
    if (chek_1.isString(args))
        args = argv_1.splitArgs(args);
    // Ensure command and arguments.
    if (!cmd)
        logger_1.log.error('Cannot execute process with command of undefined.');
    args = args.map(function (s) {
        if (/\s/g.test(s))
            return '"' + s + '"';
        return s;
    });
    console.log(args);
    // Spawn child.
    var child = child_process_1.spawnSync(cmd, args, options);
    if (child.stdout)
        return child.stdout.toString();
}
exports.methods = {
    command: exec,
    node: exec.bind(null, 'node'),
    npm: exec.bind(null, 'npm'),
    git: exec.bind(null, 'git')
};
//# sourceMappingURL=exec.js.map