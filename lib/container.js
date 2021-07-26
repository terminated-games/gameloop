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
        this.argv = [];
        this.running = [];
        this.shared = [];
        this.type = type;
        this.controller = controller;
    }
    spawn() {
        return __awaiter(this, void 0, void 0, function* () {
            this.running.push(yield thread_1.Thread.fromContainer(this));
        });
    }
    start(shell) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = Path.join(index_1.Context.Root, this.controller);
            require.resolve(controller);
            Object.defineProperty(this, 'entry', {
                writable: false,
                configurable: false,
                value: controller
            });
            yield this.spawn();
        });
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
