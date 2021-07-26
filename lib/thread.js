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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thread = void 0;
const worker_threads_1 = require("worker_threads");
const allocation_1 = require("./allocation");
const context_1 = require("./context");
const uuid = __importStar(require("uuid"));
const Protocol = __importStar(require("./protocol"));
var STATE;
(function (STATE) {
    STATE[STATE["INITIALIZING"] = 0] = "INITIALIZING";
})(STATE || (STATE = {}));
class Thread {
    constructor() {
        this.container = null;
        this.state = STATE.INITIALIZING;
        this.queue = [];
        this.callbacks = new Map();
        this._handler = null;
    }
    send(type, request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.process == null) {
                throw new Error(`INTERNAL: Unreached connection`);
            }
            this.process.postMessage({
                type,
                request
            });
        });
    }
    callback(type, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.process == null) {
                    throw new Error(`INTERNAL: Unreached Message Port`);
                }
                const callback = uuid.v4();
                this.callbacks.set(callback, { resolve, reject });
                this.process.postMessage({
                    type,
                    callback,
                    request
                });
            });
        });
    }
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            const [message] = this.queue.splice(0, 1);
            if (message == null) {
                return void 0;
            }
            Protocol.Handle(this, message.type, message.request)
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                if (message.callback) {
                    yield this.send(Protocol.Type.Callback, {
                        callback: message.callback,
                        error: null,
                        result
                    });
                }
            }))
                .catch((e) => __awaiter(this, void 0, void 0, function* () {
                if (message.callback) {
                    return yield this.send(Protocol.Type.Callback, {
                        callback: message.callback,
                        error: e.message,
                        result: null
                    });
                }
                throw e;
            }))
                .catch(e => this.uncaughtException(e));
            return yield new Promise((resolve, reject) => {
                setImmediate(() => {
                    this.handle()
                        .then(resolve)
                        .catch(reject);
                });
            });
        });
    }
    handleCallback(uuid, error, result) {
        return __awaiter(this, void 0, void 0, function* () {
            const callback = this.callbacks.get(uuid);
            if (callback == null) {
                throw new Error(`Thread.popCallback() Missing callback: ${uuid}`);
            }
            this.callbacks.delete(uuid);
            if (error) {
                return callback.reject(new Error(error));
            }
            return callback.resolve(result);
        });
    }
    close() {
        console.log('thread closed: isMainThread:', worker_threads_1.isMainThread);
    }
    uncaughtException(e) {
        console.error(`thread uncaught exception:`, e);
    }
    static fromMessagePort(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            if (channel == null || worker_threads_1.isMainThread) {
                throw new Error(`Access violation: Thread.fromMessagePort() is invalid or called from a Main Thread`);
            }
            for (const { partition, buffer } of worker_threads_1.workerData.shared) {
                allocation_1.Allocation.ensure(partition, buffer);
            }
            const thread = new Thread();
            thread.process = channel;
            channel.on('message', (message) => {
                thread.queue.push(message);
                if (thread._handler == null) {
                    thread._handler = thread.handle()
                        .finally(() => {
                        thread._handler = null;
                    });
                }
            });
            channel.on('close', () => {
                console.log('on process channel close');
            });
            return thread;
        });
    }
    static fromContainer(container) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!worker_threads_1.isMainThread) {
                throw new Error(`Access violation: Thread.fromContainer() is called from a Main Thread`);
            }
            const thread = new Thread();
            thread.container = container;
            const process = thread.process = new worker_threads_1.Worker(container.entry, {
                argv: container.argv,
                env: container.env,
                workerData: {
                    root: context_1.Context.Root,
                    controller: container.controller,
                    shared: container.shared.map(allocation => {
                        allocation.shared.push(thread);
                        return {
                            partition: allocation.partition,
                            buffer: allocation.buffer
                        };
                    })
                }
            });
            return yield new Promise((resolve, reject) => {
                process.on('online', () => resolve(thread));
                process.on('error', (e) => reject(e));
            })
                .finally(() => {
                process.removeAllListeners();
            })
                .then(() => {
                process.on('exit', (code) => thread.close());
                process.on('error', (e) => thread.uncaughtException(e));
                process.on('message', (message) => {
                    thread.queue.push(message);
                    if (thread._handler == null) {
                        thread._handler = thread.handle()
                            .finally(() => {
                            thread._handler = null;
                        });
                    }
                });
                return thread;
            });
        });
    }
}
exports.Thread = Thread;
