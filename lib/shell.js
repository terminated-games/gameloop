"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shell = void 0;
const context_1 = require("./context");
const Path = __importStar(require("path"));
const worker_threads_1 = require("worker_threads");
class Shell {
    constructor() {
        this.cwd = process.cwd();
        this.dependencies = [];
        this.sequence = [];
        this.hooks = [];
    }
    async import(module) {
        return require(Path.join(context_1.Context.Root, module));
    }
    uncaughtException(error) {
        if (worker_threads_1.isMainThread || worker_threads_1.parentPort == null) {
            console.error(error);
            process.exit(0);
        }
        else {
            throw error;
        }
    }
    unhandledRejection(error, promise) {
        if (worker_threads_1.isMainThread || worker_threads_1.parentPort == null) {
            console.error(error);
            process.exit(0);
        }
        else {
            throw error;
        }
    }
    static Hook() {
        return (target, propertyKey) => {
            context_1.Context.Shell.hooks.push(target[propertyKey]);
        };
    }
}
exports.Shell = Shell;
