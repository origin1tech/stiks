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
function configure(config, onLog) {
    // Parse command line args. We'll
    // merge these in for convenience.
    var onDone = chek_1.noop;
    var parsed = argv.parse();
    config = chek_1.extend({}, defaults, config, parsed.flags);
    function handleDone(err, data) {
        if (err)
            log.error(err);
        (onDone)(err, data);
    }
    function exec(cmd) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (onLog)
            npm.on('log', onLog);
        // check if args have any flags.
        var parsedArgs = argv.parse(args);
        // Extend flags from parsed args.
        config = chek_1.extend({}, config, parsedArgs.flags);
        // Concat any command args pased from cli.
        args = (parsed.cmds || []).concat(parsedArgs.cmds || []); // args.concat(parsed.cmds);
        npm.load(config, function (err) {
            if (err)
                return handleDone(err, null);
            // Exec npm command.
            var val = npm.commands[cmd](args, handleDone);
        });
    }
    var cmds = {};
    chek_1.keys(npm.commands).forEach(function (k) {
        cmds[k] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (chek_1.isFunction(chek_1.last(args)))
                onDone = args.pop();
            exec.apply(void 0, [k].concat(args));
        };
    });
    return cmds;
}
exports.configure = configure;
//# sourceMappingURL=npm.js.map