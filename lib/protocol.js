"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = exports.Type = void 0;
const allocation_1 = require("./allocation");
var Type;
(function (Type) {
    Type[Type["Callback"] = 0] = "Callback";
    Type[Type["Allocation"] = 1] = "Allocation";
    Type[Type["ExtendAllocation"] = 2] = "ExtendAllocation";
    Type[Type["SwapAllocation"] = 3] = "SwapAllocation";
})(Type = exports.Type || (exports.Type = {}));
async function Handle(thread, type, request) {
    switch (type) {
        case Type.Callback: return await thread.handleCallback(request.callback, request.error, request.result);
        case Type.ExtendAllocation: return allocation_1.Allocation.extend(request.partition, request.bytes);
        case Type.SwapAllocation: return allocation_1.Allocation.swap(request.partition, request.buffer);
        default: throw new Error(`Protocol.Handle(): Undefined handler type: ${type}`);
    }
}
exports.Handle = Handle;
