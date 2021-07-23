"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = exports.Context = void 0;
const worker_threads_1 = require("worker_threads");
const container_1 = __importDefault(require("./container"));
const thread_1 = require("./thread");
const util_1 = require("./util");
exports.Context = {
    Root: null,
    Shell: null,
    Controller: null,
    Thread: null
};
async function thread(shell) {
    const thread = await thread_1.Thread.fromMessagePort(worker_threads_1.parentPort);
    Object.defineProperty(exports.Context, 'Thread', {
        configurable: false,
        writable: false,
        value: thread
    });
    for (const dependency of shell.dependencies) {
        await shell.import(dependency);
    }
}
async function main(shell) {
    for (const dependency of shell.dependencies) {
        await shell.import(dependency);
    }
    for (let index = 0; index < shell.sequence.length; index++) {
        let container = shell.sequence[index];
        if (!(container instanceof container_1.default)) {
            shell.sequence[index] = container = new container_1.default(container.type, container.controller);
        }
        await container.start(shell);
    }
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
        Object.defineProperty(exports.Context, 'Root', {
            writable: false,
            configurable: false,
            value: util_1.Util.getDirectoryOfPath(process.argv[1])
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
