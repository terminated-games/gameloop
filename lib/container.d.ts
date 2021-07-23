/// <reference types="node" />
import { Shell } from './index';
import { Thread } from './thread';
import { Allocation } from './allocation';
export declare enum ContainerType {
    Internal = 0,
    External = 1
}
export interface SimpleContainer {
    readonly type: ContainerType;
    readonly controller: string;
}
export declare type Sequence = (Container | SimpleContainer)[];
export default class Container implements SimpleContainer {
    readonly env: NodeJS.Dict<string>;
    readonly controller: string;
    readonly entry: string;
    readonly type: ContainerType;
    readonly running: Thread[];
    readonly shared: Allocation[];
    constructor(type: ContainerType, controller: string);
    spawn(): Promise<void>;
    start(shell: Shell): Promise<void>;
}
export declare function Internal(controller: string): {
    new (): {
        readonly env: NodeJS.Dict<string>;
        readonly controller: string;
        readonly entry: string;
        readonly type: ContainerType;
        readonly running: Thread[];
        readonly shared: Allocation[];
        spawn(): Promise<void>;
        start(shell: Shell): Promise<void>;
    };
};
export declare function External(controller: string): {
    new (): {
        readonly env: NodeJS.Dict<string>;
        readonly controller: string;
        readonly entry: string;
        readonly type: ContainerType;
        readonly running: Thread[];
        readonly shared: Allocation[];
        spawn(): Promise<void>;
        start(shell: Shell): Promise<void>;
    };
};
