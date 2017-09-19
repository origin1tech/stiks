"use strict";
/**
 * Just a wrapper to Timbr
 * for backward compatibility.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var timbr_1 = require("timbr");
exports.Timbr = timbr_1.Timbr;
var instance;
var get = function (options) {
    if (instance)
        return instance;
    return new timbr_1.Timbr(options);
};
exports.get = get;
//# sourceMappingURL=logger.js.map