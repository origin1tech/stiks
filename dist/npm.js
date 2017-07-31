"use strict";
/**
 * Enables installing npm packages
 * programatically.
 *
 * Should support most if not all
 * methods but not tested.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var npm = require("npm");
var argv = require("./argv");
var chek_1 = require("chek");
var log = require("./logger");
// NPM Options.
var defaults = {
    loaded: false
};
function configure(config, onDone, onLog) {
    // Parse command line args. We'll
    // merge these in for convenience.
    var parsed = argv.parse();
    config = chek_1.extend({}, defaults, config, parsed.flags);
    function handleDone(err, data) {
        if (err)
            log.error(err);
        (onDone || chek_1.noop)(err, data);
    }
    function exec(cmd) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (onLog)
            npm.on('log', onLog);
        // Concat any command args pased from cli.
        args = args.concat(parsed.cmds);
        npm.load(config, function (err) {
            if (err)
                return handleDone(err, null);
            // Exec npm command.
            npm.commands[cmd](args, handleDone);
        });
    }
    var cmds = {};
    chek_1.keys(npm.commands).forEach(function (k) {
        cmds[k] = exec.bind(null, k);
    });
    return cmds;
}
exports.configure = configure;
//# sourceMappingURL=npm.js.map