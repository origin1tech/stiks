"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GroupedQueue = require("grouped-queue");
var chek_1 = require("chek");
/**
 * Create
 * : Creates a new Grouped Queue.
 *
 * @param queues the sub queue names to be run.
 */
function createQueue() {
    var queues = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        queues[_i] = arguments[_i];
    }
    var _queue;
    _queue = new GroupedQueue(chek_1.flatten(queues));
    return _queue;
}
exports.createQueue = createQueue;
//# sourceMappingURL=queue.js.map