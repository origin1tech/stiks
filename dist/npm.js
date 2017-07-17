/**
 * Enables installing npm packages
 * programatically. Only supports
 * install and uninstall.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var npm = require("npm");
var parser = require("./parser");
var chek_1 = require("chek");
var log = require("./logger");
var args = parser.parse();
// NPM Options.
var config = {
    loaded: false
};
function run(cmd, conf, pkgs, done) {
    if (chek_1.isArray(conf)) {
        done = pkgs;
        pkgs = conf;
        conf = undefined;
    }
    // extend the options
    config = chek_1.extend({}, config, conf || args.flags);
    pkgs = pkgs || args.cmds;
    // Load and install.
    npm.load(config, function (err) {
        if (err)
            log.error(err);
        // function log(msg) {
        //   console.log(msg);
        // }
        // npm.on('log', log);
        function _done(err, data) {
            if (err)
                log.error(err);
            done(err, data);
        }
        if (cmd === 'install')
            npm.commands.install(pkgs, _done);
        else
            npm.commands.uninstall(pkgs, _done);
    });
}
//# sourceMappingURL=npm.js.map