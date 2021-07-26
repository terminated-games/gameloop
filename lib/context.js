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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = exports.Context = void 0;
const worker_threads_1 = require("worker_threads");
const container_1 = __importDefault(require("./container"));
const thread_1 = require("./thread");
const util_1 = require("./util");
const Runtime = __importStar(require("./runtime"));
const module_1 = __importDefault(require("module"));
const _require = module_1.default.prototype.require;
exports.Context = {
    Root: null,
    Shell: null,
    Controller: null,
    Thread: null
};
function thread(shell) {
    return __awaiter(this, void 0, void 0, function* () {
        Object.defineProperty(exports.Context, 'Root', {
            writable: false,
            configurable: false,
            value: worker_threads_1.workerData.root
        });
        Object.defineProperty(exports.Context, 'Thread', {
            configurable: false,
            writable: false,
            value: yield thread_1.Thread.fromMessagePort(worker_threads_1.parentPort)
        });
        // Module.
        // const _require = Module.prototype.require
        // Module.prototype.resolve = function require(module: string)
        // {
        //   return _require(module)
        // }
        // Module.createRequire('')
        // Module.prototype.require = function require (filename: string) {
        //   // const module = requir
        //   return _require(filename)
        // }
        // module.paths.push(Context.Root)
        // console.log('thread root:', Context.Root)
        for (const dependency of shell.dependencies) {
            yield shell.import(dependency);
        }
        yield Runtime.Flush();
    });
}
function main(shell) {
    return __awaiter(this, void 0, void 0, function* () {
        Object.defineProperty(exports.Context, 'Root', {
            writable: false,
            configurable: false,
            value: util_1.Util.getDirectoryOfPath(process.argv[1])
        });
        // module.paths.push(Context.Root)
        // console.log('root:', Context.Root)
        for (const dependency of shell.dependencies) {
            yield shell.import(dependency);
        }
        for (let index = 0; index < shell.sequence.length; index++) {
            let container = shell.sequence[index];
            if (!(container instanceof container_1.default)) {
                shell.sequence[index] = container = new container_1.default(container.type, container.controller);
            }
            yield container.start(shell);
        }
        yield Runtime.Flush();
    });
}
function Controller(name) {
    return (target) => {
        if (exports.Context.Shell) {
            throw new Error(`INTERNAL_ERROR: Only one controller per process is allowed`);
        }
        Object.defineProperty(exports.Context, 'Controller', {
            writable: false,
            configurable: false,
            value: process.argv[1]
        });
        const shell = new target();
        Object.defineProperty(exports.Context, 'Name', {
            writable: false,
            configurable: false,
            value: name
        });
        Object.defineProperty(exports.Context, 'Shell', {
            writable: false,
            configurable: false,
            value: shell
        });
        process.on('uncaughtException', shell.uncaughtException.bind(shell));
        process.on('unhandledRejection', shell.unhandledRejection.bind(shell));
        if (worker_threads_1.isMainThread) {
            main(shell).catch(e => shell.uncaughtException(e));
        }
        else {
            thread(shell).catch(e => shell.uncaughtException(e));
        }
    };
}
exports.Controller = Controller;
