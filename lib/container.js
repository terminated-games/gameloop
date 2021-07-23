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
exports.External = exports.Internal = exports.ContainerType = void 0;
const Path = __importStar(require("path"));
const index_1 = require("./index");
const thread_1 = require("./thread");
var ContainerType;
(function (ContainerType) {
    ContainerType[ContainerType["Internal"] = 0] = "Internal";
    ContainerType[ContainerType["External"] = 1] = "External";
})(ContainerType = exports.ContainerType || (exports.ContainerType = {}));
class Container {
    constructor(type, controller) {
        this.env = {};
        this.running = [];
        this.shared = [];
        this.type = type;
        this.controller = controller;
    }
    async spawn() {
        this.running.push(await thread_1.Thread.fromContainer(this));
    }
    async start(shell) {
        const controller = Path.join(index_1.Context.Root, this.controller);
        require.resolve(controller);
        Object.defineProperty(this, 'entry', {
            writable: false,
            configurable: false,
            value: controller
        });
        await this.spawn();
    }
}
exports.default = Container;
function Internal(controller) {
    return class Internal extends Container {
        constructor() {
            super(ContainerType.Internal, controller);
        }
    };
}
exports.Internal = Internal;
function External(controller) {
    return class External extends Container {
        constructor() {
            super(ContainerType.External, controller);
        }
    };
}
exports.External = External;
