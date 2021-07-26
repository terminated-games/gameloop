"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function Handle(thread, type, request) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (type) {
            case Type.Callback: return yield thread.handleCallback(request.callback, request.error, request.result);
            case Type.ExtendAllocation: return allocation_1.Allocation.extend(request.partition, request.bytes);
            case Type.SwapAllocation: return allocation_1.Allocation.swap(request.partition, request.buffer);
            default: throw new Error(`Protocol.Handle(): Undefined handler type: ${type}`);
        }
    });
}
exports.Handle = Handle;
