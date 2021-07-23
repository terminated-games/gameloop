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
exports.Allocation = void 0;
const Threading = __importStar(require("worker_threads"));
const uuid = __importStar(require("uuid"));
const context_1 = require("./context");
const Protocol = __importStar(require("./protocol"));
class Allocation {
    constructor(partition) {
        this.shared = [];
        this.partition = partition;
    }
    async extend(bytes) {
        // TODO: Extending allocation from main thread and workers
        if (this.buffer == null || this.view == null) {
            throw new Error(`Allocation.extend(bytes: number) Requires a valid buffer<SharedArrayBuffer>`);
        }
        if (Threading.isMainThread) {
            const buffer = new SharedArrayBuffer(this.buffer.byteLength + bytes);
            const target = Buffer.from(buffer);
            const source = Buffer.from(this.buffer);
            source.copy(target, 0, 0, source.byteLength);
            for (const thread of this.shared) {
                await thread.callback(Protocol.Type.SwapAllocation, {
                    partition: this.partition,
                    buffer
                });
            }
            this.view = source;
            this.buffer = buffer;
        }
        else {
            await context_1.Context.Thread.callback(Protocol.Type.ExtendAllocation, {
                partition: this.partition,
                bytes
            });
        }
    }
    async share(thread) {
        if (this.shared.indexOf(thread) > -1 || this.buffer == null) {
            return false;
        }
        this.shared.push(thread);
        return await thread.callback(Protocol.Type.Allocation, {
            partition: this.partition,
            buffer: this.buffer
        });
    }
    static async extend(partition, bytes) {
        const allocation = this.mapping.get(partition);
        if (allocation == null) {
            throw new Error(`Allocation.extend(partition: string, bytes: number) Allocation partition not found`);
        }
        return await allocation.extend(bytes);
    }
    static create(partition = uuid.v4(), bytes) {
        if (!Threading.isMainThread) {
            throw new Error(`Allocation.create(partition: string, bytes: number) Requires a main thread`);
        }
        if (this.mapping.has(partition)) {
            throw new Error(`Allocation.create(partition: string, bytes: number) Recreation of allocation is prohibited. Allocation: ${partition}`);
        }
        const allocation = new Allocation(partition);
        if (bytes > 0) {
            allocation.buffer = new SharedArrayBuffer(bytes);
            allocation.view = Buffer.from(allocation.buffer);
        }
        this.mapping.set(partition, allocation);
        return allocation;
    }
    static swap(partition, buffer) {
        const allocation = this.mapping.get(partition);
        if (allocation == null) {
            throw new Error(`Allocation.swap(partition: string, buffer: SharedArrayBuffer) Requires a valid partition: ${partition}`);
        }
        const previous = allocation.buffer || null;
        allocation.buffer = buffer;
        allocation.view = Buffer.from(buffer);
        return previous;
    }
    static ensure(partition, buffer) {
        const allocation = this.mapping.get(partition) || new Allocation(partition);
        allocation.buffer = buffer;
        allocation.view = Buffer.from(buffer);
        if (!this.mapping.has(partition)) {
            this.mapping.set(partition, allocation);
        }
        return allocation;
    }
    static find(partition) {
        return this.mapping.get(partition) || null;
    }
    static get(partition) {
        const allocation = this.mapping.get(partition);
        if (allocation == null) {
            throw new Error(`Allocation.get(partition: string) Missing allocation: ${partition}`);
        }
        return allocation;
    }
}
exports.Allocation = Allocation;
Allocation.mapping = new Map();
