#!/usr/bin/env node
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
const worker_threads_1 = require("worker_threads");
const util_1 = require("./util");
const index_1 = require("./index");
const Path = __importStar(require("path"));
if (!worker_threads_1.isMainThread) {
    throw new Error(`INTERNAL_ERROR: Cli can only be imported in main process`);
}
util_1.Util.processArguments()
    .command('start [controller]', 'path to start the controller', async (yargs) => {
    return yargs
        .positional('controller', {
        describe: 'controller to start the gameloop with'
    });
}, async (argv) => {
    const controller = require.resolve(Path.join(process.cwd(), argv.controller));
    Object.defineProperty(index_1.Context, 'Controller', {
        writable: false,
        configurable: false,
        value: controller
    });
    Object.defineProperty(index_1.Context, 'Root', {
        writable: false,
        configurable: false,
        value: util_1.Util.getDirectoryOfPath(controller)
    });
    console.log(index_1.Context, process.pid);
    try {
        require(controller);
    }
    catch (e) {
        if (index_1.Context.Shell) {
            return index_1.Context.Shell.uncaughtException(e);
        }
        throw e;
    }
})
    .strictCommands()
    .demandCommand(1)
    .argv;
